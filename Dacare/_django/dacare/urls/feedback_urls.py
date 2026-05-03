from django.urls import path
from dacare.views import feedback_views

app_name = 'feedback'

urlpatterns = [
    path('create/', feedback_views.create_feedback, name='create_feedback'),
]