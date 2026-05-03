from django import forms


class FeedbackForm(forms.Form):
    satisfaction_level = forms.IntegerField(min_value=1, max_value=5)
    feedback_content = forms.CharField(max_length=1000)