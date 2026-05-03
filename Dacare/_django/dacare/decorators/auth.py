from functools import wraps
from django.http import JsonResponse

# 로그인 필요 여부를 JSON 응답으로 처리하는 데코레이터
def login_required_json(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.session.get('user_id'):
            return JsonResponse({
                'success': False,
                'message': 'Login is required.'
            }, status=401)

        return view_func(request, *args, **kwargs)

    return wrapper