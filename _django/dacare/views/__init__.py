from django.shortcuts import redirect, render

def index(request):
    return render(request, 'app/index.html')

def chat(request):
    user_id = request.session.get('user_id')

    if not user_id:
        return redirect('/dacare/')

    user_info = {
        'user_id': request.session.get('user_id'),
        'user_email': request.session.get('user_email'),
        'user_nk': request.session.get('user_nk'),
        'is_temp_pw': request.session.get('is_temp_pw', 'N'),
    }

    return render(request, 'app/chat.html', {
        'user_info': user_info
    })

def custom_404(request, exception):
    return render(request, '404.html', status=404)