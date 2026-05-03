from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from dacare.forms import ChatSendForm, ChatDeleteForm
from dacare.models import TblUserChatHistory
from dacare.decorators import login_required_json
from dacare.services.chat_service import send_chat_message
from dacare.utils.request import get_json_body, json_success, json_error

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
            comparison_criteria=form.cleaned_data['comparison_criteria'],
            insurance_name=form.cleaned_data['insurance_name'],
            chat_id=form.cleaned_data['chat_id'],
            session_id=form.cleaned_data['session_id']
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

@csrf_exempt
@require_POST
@login_required_json
def chat_detail(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    chat_id = data.get('chat_id')
    insurance_name = data.get('insurance_name')

    try:
        history = TblUserChatHistory.objects.get(
            chat_id=chat_id,
            insurance_name=insurance_name,
            user_id=request.session['user_id']
        )
    except TblUserChatHistory.DoesNotExist:
        return json_error('Chat history not found', status=404)

    details = history.details.all().order_by('reg_dt')

    data = {
        'chat_id': history.chat_id,
        'chat_title': history.chat_title,
        'insurance_name': history.insurance_name,
        'session_id': history.session_id,
        'messages': [
            {
                'chat_dtl_id': detail.chat_dtl_id,
                'bot_yn': detail.bot_yn,
                'chat_content': detail.chat_content,
                'chat_content_all': detail.chat_content_all,
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