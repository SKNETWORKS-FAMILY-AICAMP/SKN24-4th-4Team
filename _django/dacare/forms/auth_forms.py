import re
from django import forms


class LoginForm(forms.Form):
    user_email = forms.EmailField()
    user_pw = forms.CharField(min_length=8, max_length=16)


class VerifyEmailForm(forms.Form):
    user_email = forms.EmailField()


class SignupForm(forms.Form):
    user_nk = forms.CharField(max_length=50)
    user_email = forms.EmailField()
    verify_code = forms.CharField(max_length=6)
    user_pw = forms.CharField(min_length=8, max_length=16)
    user_pw_confirm = forms.CharField(min_length=8, max_length=16)
    agree_terms = forms.BooleanField()

    def clean_user_nk(self):
        user_nk = self.cleaned_data['user_nk']

        if not re.match(r'^[A-Za-z0-9]{1,50}$', user_nk):
            raise forms.ValidationError('Nickname must be composed of English letters and numbers, up to 50 characters.')

        return user_nk

    def clean_user_pw(self):
        user_pw = self.cleaned_data['user_pw']

        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$', user_pw):
            raise forms.ValidationError('Password must include uppercase letters, numbers, and special characters, between 8 and 16 characters.')

        return user_pw

    def clean(self):
        cleaned_data = super().clean()

        user_pw = cleaned_data.get('user_pw')
        user_pw_confirm = cleaned_data.get('user_pw_confirm')

        if user_pw and user_pw_confirm and user_pw != user_pw_confirm:
            raise forms.ValidationError('Passwords do not match.')

        return cleaned_data