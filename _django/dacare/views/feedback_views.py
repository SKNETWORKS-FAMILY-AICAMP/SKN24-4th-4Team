from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from dacare.decorators import login_required_json
from dacare.forms import FeedbackForm
from dacare.models import TblUser, TblFeedback
from dacare.utils.request import get_json_body, json_success, json_error


@csrf_exempt
@require_POST
@login_required_json
def create_feedback(request):
    data = get_json_body(request)

    if data is None:
        return json_error('Invalid JSON format.')

    form = FeedbackForm(data)

    if not form.is_valid():
        return json_error('Invalid feedback request.', errors=form.errors)

    user = TblUser.objects.get(user_id=request.session['user_id'])

    feedback = TblFeedback.objects.create(
        user=user,
        satisfaction_level=form.cleaned_data['satisfaction_level'],
        feedback_content=form.cleaned_data['feedback_content']
    )

    return json_success('Feedback submitted successfully.', {
        'feedback_id': feedback.feedback_id
    })