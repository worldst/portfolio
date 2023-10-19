from django import forms
from bootstrap_datepicker_plus.widgets import DatePickerInput
from .models import Company


class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        #fields = ['name', 'representative', 'registration_num', 'email', 'address', 'line_of_business', 'type_of_business', 'rep_number', 'point', 'type', 'restaurant', 'is_active']
        fields = ['name', 'type']

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'type': forms.Select(attrs={'class': 'form-control'}),
        }
