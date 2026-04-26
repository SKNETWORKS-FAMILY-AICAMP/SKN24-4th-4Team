from django.urls import path
from dacare.views import user_views

app_name = 'user'

urlpatterns = [
    path('nickname/', user_views.update_nickname, name='update_nickname'),
    path('password/', user_views.update_password, name='update_password'),
    path('withdraw/', user_views.withdraw, name='withdraw'),
]