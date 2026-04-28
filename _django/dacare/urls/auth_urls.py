from django.urls import path
from dacare.views import auth_views

app_name = 'auth'

urlpatterns = [
    path('login/', auth_views.login, name='login'),
    path('logout/', auth_views.logout, name='logout'),
    path('signup/verify-code/', auth_views.issue_verify_code, name='issue_verify_code'),
    path('signup/', auth_views.signup, name='signup'),
    path('password/temp/', auth_views.issue_temp_password, name='issue_temp_password'),
]