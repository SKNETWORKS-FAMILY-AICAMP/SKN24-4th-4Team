from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from dacare.decorators import login_required_json
from dacare.utils.request import json_success


@csrf_exempt
@require_POST
@login_required_json
def extend_session(request):
    request.session.set_expiry(60 * 30)

    return json_success('Session extended.')