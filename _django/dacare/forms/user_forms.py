import re
from django import forms


class UpdateNicknameForm(forms.Form):
    user_nk = forms.CharField(max_length=50)

    def clean_user_nk(self):
        user_nk = self.cleaned_data['user_nk']

        if not re.match(r'^[A-Za-z0-9]{1,50}$', user_nk):
            raise forms.ValidationError('Nickname must be composed of English letters and numbers, up to 50 characters.')

        return user_nk


class UpdatePasswordForm(forms.Form):
    current_pw = forms.CharField(min_length=8, max_length=16)
    new_pw = forms.CharField(min_length=8, max_length=16)
    new_pw_confirm = forms.CharField(min_length=8, max_length=16)

    def clean_new_pw(self):
        new_pw = self.cleaned_data['new_pw']

        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$', new_pw):
            raise forms.ValidationError('New password must include uppercase letters, numbers, and special characters, between 8 and 16 characters.')

        return new_pw

    def clean(self):
        cleaned_data = super().clean()

        new_pw = cleaned_data.get('new_pw')
        new_pw_confirm = cleaned_data.get('new_pw_confirm')

        if new_pw and new_pw_confirm and new_pw != new_pw_confirm:
            raise forms.ValidationError('New passwords do not match.')

        return cleaned_data