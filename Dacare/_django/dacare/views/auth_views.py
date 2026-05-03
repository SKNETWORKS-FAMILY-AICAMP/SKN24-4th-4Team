from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from dacare.forms import LoginForm, SignupForm, VerifyEmailForm
from dacare.models import TblUser, TblVerifyCode
from dacare.utils.generator import generate_temp_password, generate_verify_code
from dacare.utils.request import get_client_ip, get_json_body, json_error, json_success
from dacare.utils.security import hash_password, verify_password

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

VERIFY_CODE_EXPIRE_MINUTES = 3

def get_verify_code_expire_time():
    return timezone.now() - timedelta(minutes=VERIFY_CODE_EXPIRE_MINUTES)

@csrf_exempt
@require_POST
def login(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = LoginForm(data)

    if not form.is_valid():
        if 'user_email' in form.errors:
            return json_error('Please check the email format')
        if 'user_pw' in form.errors:
            return json_error('Please check the password')
        return json_error('Invalid login request.')

    user_email = form.cleaned_data['user_email']
    user_pw = form.cleaned_data['user_pw']

    try:
        user = TblUser.objects.get(user_email=user_email)
    except TblUser.DoesNotExist:
        return json_error('This email is not registered.', status=404)

    if user.pw_wrong_cnt >= 5:
        return json_error(
            'Your account has been locked. Please request a temporary password.',
            status=403
        )

    if not verify_password(user_pw, user.user_pw):
        user.pw_wrong_cnt += 1
        user.save(update_fields=['pw_wrong_cnt'])
        return json_error('Password does not match', status=401)

    user.pw_wrong_cnt = 0
    user.last_login_dt = timezone.now()
    user.save(update_fields=['pw_wrong_cnt', 'last_login_dt'])

    request.session['user_id'] = user.user_id
    request.session['user_email'] = user.user_email
    request.session['user_nk'] = user.user_nk
    request.session['is_temp_pw'] = user.is_temp_pw
    
    # 세션 만료 시간 계산
    expire_at = timezone.now() + timedelta(seconds=settings.SESSION_COOKIE_AGE)
    request.session['session_expire_at'] = expire_at.isoformat()

    request.session.set_expiry(settings.SESSION_COOKIE_AGE)

    return json_success('Login successful.', {
        'user_id': user.user_id,
        'user_email': user.user_email,
        'user_nk': user.user_nk,
        'is_temp_pw': user.is_temp_pw,
        'redirect_type': 'CHANGE_PASSWORD' if user.is_temp_pw == 'Y' else 'CHAT',
    })


@csrf_exempt
@require_POST
def logout(request):
    request.session.flush()
    return json_success('You have been logged out.')


@csrf_exempt
@require_POST
def issue_verify_code(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = VerifyEmailForm(data)

    if not form.is_valid():
        return json_error('Please check the email format')

    user_email = form.cleaned_data['user_email']

    if TblUser.objects.filter(user_email=user_email).exists():
        return json_error('This email is already registered.')

    verify_code = generate_verify_code()

    # 같은 이메일로 이전에 발급된 미사용 인증코드는 제거하고 최신 코드 1개만 유효하게 둠.
    TblVerifyCode.objects.filter(user_email=user_email).delete()

    TblVerifyCode.objects.create(
        user_email=user_email,
        verify_code=verify_code,
        req_ip=get_client_ip(request)
    )

    #이메일 형식 변경
    html_content = render_to_string(
        "email/verification.html",
        {
            "verification_code": verify_code,
            "expire_minutes": VERIFY_CODE_EXPIRE_MINUTES,
        }
    )

    msg = EmailMultiAlternatives(
        subject='Dacare Verification Code',
        body=f'Your verification code is {verify_code}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user_email],
    )
    
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return json_success('Verification code has been sent to your email.')


@csrf_exempt
@require_POST
def signup(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = SignupForm(data)

    if not form.is_valid():
        errors = form.errors

        if 'user_nk' in errors:
            return json_error('Please enter a nickname to continue')

        if 'user_email' in errors:
            return json_error('Please check the email format')

        if 'verify_code' in errors:
            return json_error('Please verify your email address to continue')

        if 'user_pw' in errors:
            return json_error('Please check the password format')

        if 'user_pw_confirm' in errors or '__all__' in errors:
            return json_error('Password does not match')

        if 'agree_terms' in errors:
            return json_error('Please agree to Terms and Conditions')

        return json_error('Invalid signup request.')

    user_nk = form.cleaned_data['user_nk']
    user_email = form.cleaned_data['user_email']
    verify_code = form.cleaned_data['verify_code']
    user_pw = form.cleaned_data['user_pw']
    agree_terms = form.cleaned_data['agree_terms']

    if not user_nk:
        return json_error('Please enter a nickname to continue')

    if not agree_terms:
        return json_error('Please agree to Terms and Conditions')

    if TblUser.objects.filter(user_email=user_email).exists():
        return json_error('This email is already registered.')

    expire_time = get_verify_code_expire_time()

    with transaction.atomic():
        verify_obj = (
            TblVerifyCode.objects
            .select_for_update()
            .filter(
                user_email=user_email,
                verify_code=verify_code,
                reg_dt__gte=expire_time
            )
            .order_by('-reg_dt')
            .first()
        )

        if verify_obj is None:
            return json_error('Verification code is invalid or expired. Please request a new code.')

        user = TblUser.objects.create(
            user_nk=user_nk,
            user_email=user_email,
            user_pw=hash_password(user_pw),
            pw_wrong_cnt=0,
            is_temp_pw='N',
            updt_dt=timezone.now(),
            last_login_dt=timezone.now()
        )

        # 인증 성공 후 같은 이메일의 인증코드는 재사용 불가하도록 삭제.
        TblVerifyCode.objects.filter(user_email=user_email).delete()

    return json_success('Registration completed successfully.', {
        'user_id': user.user_id,
        'user_email': user.user_email,
        'user_nk': user.user_nk,
        'redirect_type': 'CHAT'
    })


@csrf_exempt
@require_POST
def issue_temp_password(request):
    """비밀번호 찾기 모달에서 이메일 입력 후 Send 버튼 클릭 시 호출."""
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = VerifyEmailForm(data)

    if not form.is_valid():
        return json_error('Please check the email format')

    user_email = form.cleaned_data['user_email']

    try:
        user = TblUser.objects.get(user_email=user_email)
    except TblUser.DoesNotExist:
        return json_error('This email is not registered.', status=404)

    temp_password = generate_temp_password()

    user.user_pw = hash_password(temp_password)
    user.pw_wrong_cnt = 0
    user.is_temp_pw = 'Y'
    user.updt_dt = timezone.now()
    user.save(update_fields=['user_pw', 'pw_wrong_cnt', 'is_temp_pw', 'updt_dt'])

    send_mail(
        subject='Dacare Temporary Password',
        message=(
            f'Your temporary password is {temp_password}.\n\n'
            'Please sign in with this temporary password and change your password immediately.'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=False,
    )

    return json_success('A temporary password has been sent to your email.')
