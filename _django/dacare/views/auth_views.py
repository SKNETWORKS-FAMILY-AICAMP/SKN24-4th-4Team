from aiohttp import request
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from dacare.models import TblUser, TblVerifyCode
from dacare.forms import LoginForm, SignupForm, VerifyEmailForm
from dacare.utils.request import get_json_body, get_client_ip, json_success, json_error
from dacare.utils.security import hash_password, verify_password
from dacare.utils.generator import generate_verify_code, generate_temp_password

from django.core.mail import send_mail
from django.conf import settings

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
    request.session.set_expiry(60 * 30)

    return json_success('Login successful.', {
        'user_id': user.user_id,
        'user_email': user.user_email,
        'user_nk': user.user_nk,
        'is_temp_pw': user.is_temp_pw,
        'redirect_type': 'CHANGE_PASSWORD' if user.is_temp_pw == 'Y' else 'CHAT'
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

    TblVerifyCode.objects.create(
        user_email=user_email,
        verify_code=verify_code,
        req_ip=get_client_ip(request)
    )

    send_mail(
        subject='Dacare Verification Code',
        message=f'Your Dacare verification code is {verify_code}.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=False,
    )

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

    verify_obj = TblVerifyCode.objects.filter(
        user_email=user_email,
        verify_code=verify_code
    ).order_by('-reg_dt').first()

    if verify_obj is None:
        return json_error('Please verify your email address to continue')

    user = TblUser.objects.create(
        user_nk=user_nk,
        user_email=user_email,
        user_pw=hash_password(user_pw),
        pw_wrong_cnt=0,
        is_temp_pw='N',
        updt_dt=timezone.now(),
        last_login_dt=timezone.now()
    )

    return json_success('Registration completed successfully.', {
        'user_id': user.user_id,
        'user_email': user.user_email,
        'user_nk': user.user_nk,
        'redirect_type': 'CHAT'
    })


@csrf_exempt
@require_POST
def issue_temp_password(request):
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

    return json_success(
        'A temporary password has been sent to an email created by the system'
    )