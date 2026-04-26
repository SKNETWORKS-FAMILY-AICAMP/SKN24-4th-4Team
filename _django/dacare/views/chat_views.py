from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from dacare.forms import ChatSendForm, ChatDeleteForm, ChatStartForm, CompareInsuranceForm
from dacare.models import TblUserChatHistory
from dacare.decorators import login_required_json
from dacare.services.chat_service import (
    send_chat_message,
    start_new_chat,
    call_fastapi_compare_server,
    save_chat_detail,
    get_or_create_chat_history,
)
from dacare.utils.request import get_json_body, json_success, json_error


@csrf_exempt
@require_POST
@login_required_json
def start_chat(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = ChatStartForm(data)

    if not form.is_valid():
        return json_error('Select insurer first', errors=form.errors)

    result = start_new_chat(
        user_id=request.session['user_id'],
        insurance_name=form.cleaned_data['insurance_name']
    )

    return json_success('Chat started successfully.', result)


@csrf_exempt
@require_POST
@login_required_json
def send_chat(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = ChatSendForm(data)

    if not form.is_valid():
        errors = form.errors.as_json()

        if 'insurance_name' in form.errors:
            return json_error('Select insurer first', errors=errors)

        if 'message' in form.errors:
            return json_error('Message must be within 500 characters', errors=errors)

        return json_error('Invalid chat request.', errors=errors)

    try:
        result = send_chat_message(
            user_id=request.session['user_id'],
            message=form.cleaned_data['message'],
            insurance_name=form.cleaned_data['insurance_name'],
            chat_id=form.cleaned_data.get('chat_id')
        )
    except ValueError as e:
        return json_error(str(e))

    return json_success('Message sent successfully.', result)


@require_GET
@login_required_json
def chat_list(request):
    histories = TblUserChatHistory.objects.filter(
        user_id=request.session['user_id']
    ).order_by('-reg_dt')

    data = [
        {
            'chat_id': history.chat_id,
            'chat_title': history.insurance_name,
            'insurance_name': history.insurance_name,
            'session_id': history.session_id,
            'reg_dt': history.reg_dt.strftime('%Y.%m.%d %H:%M'),
        }
        for history in histories
    ]

    return json_success('Chat history retrieved successfully.', data)


@require_GET
@login_required_json
def chat_detail(request, chat_id):
    try:
        history = TblUserChatHistory.objects.get(
            chat_id=chat_id,
            user_id=request.session['user_id']
        )
    except TblUserChatHistory.DoesNotExist:
        return json_error('Chat history not found', status=404)

    details = history.details.all().order_by('reg_dt')

    data = {
        'chat_id': history.chat_id,
        'chat_title': history.chat_title,
        'insurance_name': history.insurance_name,
        'messages': [
            {
                'chat_dtl_id': detail.chat_dtl_id,
                'bot_yn': detail.bot_yn,
                'chat_content': detail.chat_content,
                'sources': detail.sources or [],
                'suggestions': detail.suggestions or [],
                'files': detail.files or [],
                'comparison': detail.comparison,
                'reg_dt': detail.reg_dt.strftime('%Y.%m.%d %H:%M'),
            }
            for detail in details
        ]
    }

    return json_success('Chat history retrieved successfully.', data)


@csrf_exempt
@require_POST
@login_required_json
def delete_chat(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = ChatDeleteForm(data)

    if not form.is_valid():
        return json_error('Chat history not found', errors=form.errors)

    deleted_count, _ = TblUserChatHistory.objects.filter(
        chat_id=form.cleaned_data['chat_id'],
        user_id=request.session['user_id']
    ).delete()

    if deleted_count == 0:
        return json_error('Chat history not found', status=404)

    return json_success('Chat deleted successfully.')


@csrf_exempt
@require_POST
@login_required_json
def compare_insurance(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = CompareInsuranceForm(data)

    if not form.is_valid():
        return json_error('Invalid comparison request.', errors=form.errors)

    user_id = request.session['user_id']
    message = form.cleaned_data.get('message') or ''
    insurance_names = form.cleaned_data['insurance_names']
    selected_topics = form.cleaned_data['selected_topics']

    result = call_fastapi_compare_server(
        user_id=user_id,
        message=message,
        insurance_names=insurance_names,
        selected_topics=selected_topics
    )

    chat = get_or_create_chat_history(
        user_id=user_id,
        insurance_name='Compare Insurance',
        title='Compare Insurance'
    )

    user_summary = f"Selected Topics: {', '.join(selected_topics)}"

    save_chat_detail(
        chat=chat,
        content=user_summary,
        bot_yn='N'
    )

    answer = (result.get('answer') or '')[:1500]
    sources = result.get('sources') or []
    comparison = result.get('comparison') or {}

    bot_message = save_chat_detail(
        chat=chat,
        content=answer,
        bot_yn='Y',
        sources=sources,
        comparison=comparison
    )

    return json_success('Comparison completed successfully.', {
        'chat_id': chat.chat_id,
        'bot_message_id': bot_message.chat_dtl_id,
        'answer': answer,
        'sources': sources,
        'comparison': comparison,
    })