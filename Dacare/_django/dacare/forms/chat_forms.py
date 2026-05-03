from django import forms


ALLOWED_INSURERS = [
    'UnitedHealthcare',
    'Cigna',
    'TRICARE',
    'MSH China',
]

class ChatSendForm(forms.Form):
    user_id = forms.IntegerField()
    chat_id = forms.IntegerField(required=False)
    session_id = forms.CharField(max_length=100, required=False)
    message = forms.CharField(max_length=500, required=False)
    insurance_name = forms.CharField(max_length=100)
    comparison_criteria = forms.JSONField(required=False)

    def clean_insurance(self):
        insurance_name = self.cleaned_data['insurance_name']

        if insurance_name not in ALLOWED_INSURERS:
            raise forms.ValidationError('Select insurer first')

        return insurance_name


class ChatDeleteForm(forms.Form):
    chat_id = forms.IntegerField()