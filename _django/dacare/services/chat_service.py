import requests
from django.conf import settings
from django.utils import timezone

import json

from dacare.models import TblUser, TblUserChatHistory, TblUserChatHistDtl

def get_or_create_chat_history(user_id, insurance_name, chat_id=None, session_id=None):
    user = TblUser.objects.get(user_id=user_id)

    if chat_id:
        return TblUserChatHistory.objects.get(
            chat_id=chat_id,
            user_id=user_id
        )

    return TblUserChatHistory.objects.create(
        user=user,
        chat_title=insurance_name.capitalize(),
        insurance_name=insurance_name,
        session_id=session_id or f'session_{user_id}_{int(timezone.now().timestamp())}'
    )


def save_chat_detail(
    chat,
    content,
    bot_yn,
    content_all=None
):
    return TblUserChatHistDtl.objects.create(
        chat=chat,
        bot_yn=bot_yn,
        chat_content=content[:1500],
        chat_content_all=content_all if content_all else None,
    )


def call_fastapi_chat_server(message, user_id, session_id, insurer, comparison_criteria=None):
    payload = {
        'user_id': user_id,
        'session_id': session_id,
        'message': message,
        'insurance_name': insurer,
        'comparison_criteria': comparison_criteria
    }

    # 김수진 여기
    # response = requests.post(
    #     settings.FASTAPI_CHAT_URL + '/chat',
    #     json=payload,
    #     timeout=60
    # )
    # response data 예시
    response = {
        "answer": "답변 내용",
        "sources": [
            {
                "document_name": "cigna_benefit_guide.pdf",
                "page": 12,
                "section": "Outpatient Treatment"
            }
        ],
        "claim_form":[
            {
                "claim_form_path": "/static/forms/cigna_claim_form.pdf",
                "claim_form_name":"cigna_claim_form.pdf",
                "claim_form_ext":"pdf"
            }
        ],

        "compare_table":{
            "header" : ["Comparison Criteria", "UHCG ", "Cigna ", "Tricare ", "MSH China (Standard)"],
            "body" : [
                ["Annual Coverage Limit", "$1,000,000",  "$2,500,000", "Unlimited (Network)", "$1,500,000"],
                ["Cost-Sharing Structure", "$1,000,000",  "$2,500,000", "Unlimited (Network)", "$1,500,000"],
                ["Outpatient Coverage", "$1,000,000",  "$2,500,000", "Unlimited (Network)", "$1,500,000"],
                ["Maternity and Prenatal Coverage", "$1,000,000",  "$2,500,000", "Unlimited (Network)", "$1,500,000"]
            ]
        },
        "related_questions": [
            "What documents are needed for a claim?",
            "Does this benefit require pre-authorization?",
            "What is the annual outpatient limit?"
        ]
    }
    # response.raise_for_status()
    # return response.json()
    # response = json.dumps(response)
    return response


def send_chat_message(user_id, message, insurance_name, chat_id=None, comparison_criteria=None, session_id=None):
    if not insurance_name:
        raise ValueError('Select insurer first')

    if len(message) > 500:
        raise ValueError('Message must be within 500 characters')

    chat = get_or_create_chat_history(
        user_id=user_id,
        insurance_name=insurance_name,
        chat_id=chat_id
    )
    
    if insurance_name == 'compare' and comparison_criteria:
        user_message = save_chat_detail(
            chat=chat,
            content=message + ' | ' + str(comparison_criteria),
            bot_yn='N'
        )
    else:
        user_message = save_chat_detail(
            chat=chat,
            content=message,
            bot_yn='N'
        )

    fastapi_result = call_fastapi_chat_server(
        user_id=user_id,
        session_id=chat.session_id,
        insurer=insurance_name,
        message=message,
        comparison_criteria=comparison_criteria
    )

    ai_answer = fastapi_result.get('answer') or ''
    ai_answer = ai_answer[:1500]

    bot_message = save_chat_detail(
        chat=chat,
        content=ai_answer,
        content_all=fastapi_result,
        bot_yn='Y',
    )

    return {
        'chat_id': chat.chat_id,
        'session_id': chat.session_id,
        'bot_message': fastapi_result
    }