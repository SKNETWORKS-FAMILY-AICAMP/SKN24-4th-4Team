import json
from django.http import JsonResponse


def get_json_body(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return None


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]

    return request.META.get('REMOTE_ADDR')


def json_success(message, data=None):
    return JsonResponse({
        'success': True,
        'message': message,
        'data': data or {}
    })


def json_error(message, status=400, errors=None):
    return JsonResponse({
        'success': False,
        'message': message,
        'errors': errors
    }, status=status)