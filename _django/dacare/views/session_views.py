from datetime import timedelta

from aiohttp import request
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from django.conf import settings
from dacare.decorators import login_required_json
from dacare.utils.request import json_success, json_error

from django.utils.dateparse import parse_datetime
from django.utils import timezone

@csrf_exempt
@require_POST
@login_required_json
def extend_session(request):
    # 세션 만료 시간 다시 계산
    expire_at = timezone.now() + timedelta(seconds=settings.SESSION_COOKIE_AGE)

    request.session['session_expire_at'] = expire_at.isoformat()
    request.session.set_expiry(settings.SESSION_COOKIE_AGE)
    request.session.modified = True

    return json_success('Session extended.', {
        'session_expire_seconds': settings.SESSION_COOKIE_AGE
    })

@csrf_exempt
@require_GET
@login_required_json
def session_info(request):
    expire_at_str = request.session.get('session_expire_at')

    if not expire_at_str:
        return json_error('Session expired. Please log in again.', status=401)

    # 문자열로 저장된 expire_at을 datetime 객체로 변환
    expire_at = parse_datetime(expire_at_str)

    remain_seconds = int((expire_at - timezone.now()).total_seconds())

    # 세션이 이미 만료된 경우
    if remain_seconds <= 0:
        request.session.flush()
        return json_error('Session expired. Please log in again.', status=401)

    return json_success('Session info.', {
        'session_expire_seconds': remain_seconds
    })