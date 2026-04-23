from django.shortcuts import render
from datetime import datetime

def index(request):
    return render(request, 'app/index.html')

def chat(request):
    return render(request, 'app/chat.html')