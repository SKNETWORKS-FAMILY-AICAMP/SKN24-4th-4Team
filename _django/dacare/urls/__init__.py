from django.urls import path, include
from dacare import views

urlpatterns = [
    path('', views.index, name='index'),
    path('chat', views.chat, name='chat'),
    path('auth/', include('dacare.urls.auth_urls')),
    path('user/', include('dacare.urls.user_urls')),
    path('chat/', include('dacare.urls.chat_urls')),
    path('feedback/', include('dacare.urls.feedback_urls')),
    path('session/', include('dacare.urls.session_urls')),
]