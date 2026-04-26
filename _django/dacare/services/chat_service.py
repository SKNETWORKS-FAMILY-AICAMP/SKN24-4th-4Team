import requests
from django.conf import settings
from django.utils import timezone

from dacare.models import TblUser, TblUserChatHistory, TblUserChatHistDtl


DEFAULT_SUGGESTIONS = [
    'Pre authorization Requirement for Hospitalization',
    'Cost-Sharing Structure',
    'Mental Health Coverage',
    'Annual Coverage Limit',
]


RECOMMENDATION_BLOCK_MESSAGE = (
    'I cannot recommend a specific insurance product or make a final legal or medical judgment. '
    'Please compare the official policy terms and consult the insurer or an official support channel.'
)


def is_recommendation_request(message):
    keywords = [
        'recommend',
        'best insurance',
        'which insurance should I choose',
        'choose for me',
        '상품 추천',
        '보험 추천',
        '뭐가 좋아',
        '어떤 보험이 좋아',
    ]

    lowered = message.lower()

    return any(keyword.lower() in lowered for keyword in keywords)


def get_or_create_chat_history(user_id, insurance_name, chat_id=None, title=None):
    user = TblUser.objects.get(user_id=user_id)

    if chat_id:
        return TblUserChatHistory.objects.get(
            chat_id=chat_id,
            user_id=user_id
        )

    return TblUserChatHistory.objects.create(
        user=user,
        chat_title=title or insurance_name,
        insurance_name=insurance_name,
        session_id=f'session_{user_id}_{int(timezone.now().timestamp())}'
    )


def save_chat_detail(
    chat,
    content,
    bot_yn,
    sources=None,
    suggestions=None,
    files=None,
    comparison=None
):
    return TblUserChatHistDtl.objects.create(
        chat=chat,
        bot_yn=bot_yn,
        chat_content=content[:1500],
        sources=sources,
        suggestions=suggestions,
        files=files,
        comparison=comparison
    )


def call_fastapi_chat_server(message, user_id, chat_id, insurance_name):
    payload = {
        'user_id': user_id,
        'chat_id': chat_id,
        'message': message,
        'insurance_name': insurance_name
    }

    response = requests.post(
        settings.FASTAPI_CHAT_URL,
        json=payload,
        timeout=60
    )

    response.raise_for_status()
    return response.json()


def send_chat_message(user_id, message, insurance_name, chat_id=None):
    if not insurance_name:
        raise ValueError('Select insurer first')

    if len(message) > 500:
        raise ValueError('Message must be within 500 characters')

    chat = get_or_create_chat_history(
        user_id=user_id,
        insurance_name=insurance_name,
        chat_id=chat_id,
        title=insurance_name
    )

    user_message = save_chat_detail(
        chat=chat,
        content=message,
        bot_yn='N'
    )

    if is_recommendation_request(message):
        bot_message = save_chat_detail(
            chat=chat,
            content=RECOMMENDATION_BLOCK_MESSAGE,
            bot_yn='Y',
            suggestions=DEFAULT_SUGGESTIONS
        )

        return {
            'chat_id': chat.chat_id,
            'insurance_name': chat.insurance_name,
            'user_message_id': user_message.chat_dtl_id,
            'bot_message_id': bot_message.chat_dtl_id,
            'user_message': message,
            'bot_message': RECOMMENDATION_BLOCK_MESSAGE,
            'sources': [],
            'suggestions': DEFAULT_SUGGESTIONS,
            'files': [],
            'comparison': None,
        }

    fastapi_result = call_fastapi_chat_server(
        message=message,
        user_id=user_id,
        chat_id=chat.chat_id,
        insurance_name=insurance_name
    )

    ai_answer = fastapi_result.get('answer') or ''
    ai_answer = ai_answer[:1500]

    sources = fastapi_result.get('sources') or []
    suggestions = fastapi_result.get('suggestions') or DEFAULT_SUGGESTIONS[:3]
    files = fastapi_result.get('files') or []
    comparison = fastapi_result.get('comparison')

    bot_message = save_chat_detail(
        chat=chat,
        content=ai_answer,
        bot_yn='Y',
        sources=sources,
        suggestions=suggestions,
        files=files,
        comparison=comparison
    )

    return {
        'chat_id': chat.chat_id,
        'insurance_name': chat.insurance_name,
        'user_message_id': user_message.chat_dtl_id,
        'bot_message_id': bot_message.chat_dtl_id,
        'user_message': message,
        'bot_message': ai_answer,
        'sources': sources,
        'suggestions': suggestions,
        'files': files,
        'comparison': comparison,
    }


def start_new_chat(user_id, insurance_name):
    if not insurance_name:
        raise ValueError('Select insurer first')

    chat = get_or_create_chat_history(
        user_id=user_id,
        insurance_name=insurance_name,
        title=insurance_name
    )

    return {
        'chat_id': chat.chat_id,
        'insurance_name': chat.insurance_name,
        'chat_title': chat.chat_title,
        'suggestions': DEFAULT_SUGGESTIONS,
    }


def call_fastapi_compare_server(user_id, message, insurance_names, selected_topics):
    payload = {
        'user_id': user_id,
        'message': message,
        'insurance_names': insurance_names,
        'selected_topics': selected_topics
    }

    response = requests.post(
        settings.FASTAPI_COMPARE_URL,
        json=payload,
        timeout=60
    )

    response.raise_for_status()
    return response.json()