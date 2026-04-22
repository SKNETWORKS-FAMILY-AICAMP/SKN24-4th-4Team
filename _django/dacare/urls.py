from django.urls import path
from . import views

app_name = 'dacare'

urlpatterns = [
    path('', views.index, name='index'),
    path('chat', views.chat, name='chat'),
]