from django.urls import path
from dacare.views import session_views

app_name = 'session'

urlpatterns = [
    path('extend/', session_views.extend_session, name='extend_session'),
]