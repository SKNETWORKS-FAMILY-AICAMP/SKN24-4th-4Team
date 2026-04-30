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

    if not verify_password(current_pw, user.user_pw):
        return json_error('Please check the password', status=401)

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

    # [수정] 기존 코드: from = ... → 'from'은 Python 예약어라 변수명 사용 불가 → SyntaxError 발생
    #        이 오류 때문에 user_views 모듈 자체가 로드 안 돼서 서버 전체가 죽어 있었음
    #        → WithdrawForm으로 입력값 검증 후 비밀번호를 꺼내도록 수정
    form = WithdrawForm(data)

    # [추가] 비밀번호를 아예 안 보냈거나 형식이 틀리면 DB 조회도 하지 않고 즉시 거부
    #        프론트에서 막더라도 서버에서도 반드시 검증해야 함
    if not form.is_valid():
        return json_error('Please enter your password.')

    password = form.cleaned_data['current_pw']

    # [수정] 기존 코드: user를 꺼내기 전에 verify_password(password, user.user_pw) 호출
    #        → user가 아직 정의되지 않아서 NameError 발생
    #        → user를 먼저 조회해야 user.user_pw에 접근 가능하므로 순서를 앞으로 이동
    user = TblUser.objects.get(user_id=request.session['user_id'])

    # 입력한 평문 비밀번호와 DB에 해시로 저장된 비밀번호를 비교
    # 일치하지 않으면 401(인증 실패) 반환 → 탈퇴 차단
    if not verify_password(password, user.user_pw):
        return json_error('Incorrect password.', status=401)

    # 비밀번호 검증 통과 → DB에서 유저 레코드 삭제
    user.delete()
    # 서버 측 세션도 즉시 초기화 (로그인 상태 해제, 쿠키 무효화)
    request.session.flush()
    return json_success('Your account has been deleted.')
    