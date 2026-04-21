from django.shortcuts import render
from datetime import datetime

# context = {
#     'name': 'Squirrel',
#     'addr': '도토리숲',
#     'age': 1,
#     'num': 1,
#     'hobby': ['coding', 'reading', 'traveling'],
#     'today': datetime.now(),
#     'is_authenticated': True,
#     'fruits': ['apple', 'banana', 'cherry'],
#     'users': [
#         {'id': 1234, 'name': 'Alice', 'age': 24, 'married': True},
#         {'id': 2345, 'name': 'Bob', 'age': 31, 'married': False},
#         {'id': 3456, 'name': 'Charlie', 'age': 27, 'married': True},
#     ],
#     'users': []
# }

def index(request):
    return render(request, 'app/index.html')

def chat(request):
    return render(request, 'app/chat.html')

# def _02_tags(request):
#     return render(request, 'app/02_tags.html', context)

# def _03_layout(request):
#     return render(request, 'app/03_layout.html')

# def _04_static_files(request):
#     return render(request, 'app/04_static_files.html')

# def _05_urls(request):
#     return render(request, 'app/05_urls.html')

# def articles_detail(request, id):
#     print('---------- articles_detail ----------')
#     print(f'{id = }')
#     return render(request, 'app/05_urls.html')

# def articles_category(request, id, category):
#     print('---------- articles with category ----------')
#     print(f'{id = }')
#     print(f'{category = }')
#     return render(request, 'app/05_urls.html')

# def search(request):
#     print('---------- search ----------')
#     print(request.GET)    
#     q = request.GET.getlist('q', ['없음'])
#     lang = request.GET.get('lang', '없음')
#     return render(request, 'app/05_urls.html', {'q': q, 'lang': lang})
