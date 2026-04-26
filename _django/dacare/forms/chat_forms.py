from django import forms


ALLOWED_INSURERS = [
    'UnitedHealthcare',
    'Cigna',
    'TRICARE',
    'MSH China',
]


class ChatSendForm(forms.Form):
    chat_id = forms.IntegerField(required=False)
    message = forms.CharField(max_length=500)
    insurance_name = forms.CharField(max_length=100)

    def clean_insurance_name(self):
        insurance_name = self.cleaned_data['insurance_name']

        if insurance_name not in ALLOWED_INSURERS:
            raise forms.ValidationError('Select insurer first')

        return insurance_name


class ChatDeleteForm(forms.Form):
    chat_id = forms.IntegerField()


class ChatStartForm(forms.Form):
    insurance_name = forms.CharField(max_length=100)

    def clean_insurance_name(self):
        insurance_name = self.cleaned_data['insurance_name']

        if insurance_name not in ALLOWED_INSURERS:
            raise forms.ValidationError('Select insurer first')

        return insurance_name


class CompareInsuranceForm(forms.Form):
    message = forms.CharField(max_length=500, required=False)
    insurance_names = forms.JSONField()
    selected_topics = forms.JSONField()

    def clean_insurance_names(self):
        insurance_names = self.cleaned_data['insurance_names']

        if not isinstance(insurance_names, list) or len(insurance_names) == 0:
            raise forms.ValidationError('Select insurer first')

        if len(insurance_names) > 5:
            raise forms.ValidationError('You can compare up to 5 insurers.')

        for name in insurance_names:
            if name not in ALLOWED_INSURERS:
                raise forms.ValidationError('Select insurer first')

        return insurance_names

    def clean_selected_topics(self):
        selected_topics = self.cleaned_data['selected_topics']

        if not isinstance(selected_topics, list) or len(selected_topics) == 0:
            raise forms.ValidationError('Please select comparison topics.')

        if len(selected_topics) > 5:
            raise forms.ValidationError('You can select up to 5 topics.')

        return selected_topics