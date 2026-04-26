from django.urls import path
from dacare.views import chat_views

app_name = 'chat'

urlpatterns = [
    path('start/', chat_views.start_chat, name='start_chat'),
    path('send/', chat_views.send_chat, name='send_chat'),
    path('list/', chat_views.chat_list, name='chat_list'),
    path('<int:chat_id>/', chat_views.chat_detail, name='chat_detail'),
    path('delete/', chat_views.delete_chat, name='delete_chat'),
    path('compare/', chat_views.compare_insurance, name='compare_insurance'),
]