from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from dacare.models import TblUser
from dacare.forms import UpdateNicknameForm, UpdatePasswordForm, WithdrawForm
from dacare.decorators import login_required_json
from dacare.utils.request import get_json_body, json_success, json_error
from dacare.utils.security import hash_password, verify_password


@csrf_exempt
@require_POST
@login_required_json
def update_nickname(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = UpdateNicknameForm(data)

    if not form.is_valid():
        return json_error('Please enter a nickname to continue', errors=form.errors)

    user = TblUser.objects.get(user_id=request.session['user_id'])
    user.user_nk = form.cleaned_data['user_nk']
    user.updt_dt = timezone.now()
    user.save(update_fields=['user_nk', 'updt_dt'])

    request.session['user_nk'] = user.user_nk

    return json_success('Nickname updated successfully.', {
        'user_nk': user.user_nk
    })


@csrf_exempt
@require_POST
@login_required_json
def update_password(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = UpdatePasswordForm(data)

    if not form.is_valid():
        errors = form.errors

        if 'current_pw' in errors:
            return json_error('Please check the password', errors=errors)

        if 'new_pw' in errors:
            return json_error('Please check the new password', errors=errors)

        if 'new_pw_confirm' in errors or '__all__' in errors:
            return json_error('Please check the new password', errors=errors)

        return json_error('Invalid password request.', errors=errors)

    user = TblUser.objects.get(user_id=request.session['user_id'])

    current_pw = form.cleaned_data['current_pw']
    new_pw = form.cleaned_data['new_pw']

    # 비밀번호 재확인 안내 문구 변경
    if not verify_password(current_pw, user.user_pw):
        return json_error('Password does not match', status=401)

    user.user_pw = hash_password(new_pw)
    user.is_temp_pw = 'N'
    user.updt_dt = timezone.now()
    user.save(update_fields=['user_pw', 'is_temp_pw', 'updt_dt'])

    # 세션도 같이 갱신해야 새로고침해도 모달 안 뜸
    request.session['is_temp_pw'] = 'N'
    request.session.modified = True

    return json_success('Password updated successfully.')


@csrf_exempt
@require_POST
@login_required_json
def withdraw(request):
    # 요청 본문을 JSON으로 파싱 (형식이 잘못됐으면 None 반환)
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = WithdrawForm(data)

    if not form.is_valid():
        return json_error('Please enter your password.')

    password = form.cleaned_data['current_pw']

    user = TblUser.objects.get(user_id=request.session['user_id'])

    if not verify_password(password, user.user_pw):
        return json_error('Incorrect password.', status=401)

    user.delete()
    request.session.flush()
    return json_success('Your account has been deleted.')
    