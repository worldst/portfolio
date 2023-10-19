from django import forms
from bootstrap_datepicker_plus.widgets import DatePickerInput, MonthPickerInput


class DateForm(forms.Form):
    start = forms.DateField(
        widget=DatePickerInput(options={'format': 'YYYY-MM-DD',
                                       'locale': 'ko'}),
        label='시작 날짜', required=True
    )

    end = forms.DateField(
        widget=DatePickerInput(
            options={
                'format': 'YYYY-MM-DD',
                'locale': 'ko',
            }
        ),
        label='끝 날짜', required=True
    )


class MonthDateForm(forms.Form):
    by_date = forms.DateField(
        #widget=DatePickerInput(options={'format': 'YYYY-MM',
                                       #'locale': 'ko'}),
        widget=MonthPickerInput(options={'locale': 'ko'}),
        label='월 선택', required=True
    )



class SearchForm(forms.Form):
    search_word = forms.CharField(label='지시 번호 검색')

    def __init__(self, *args, **kwargs):
        super(SearchForm, self).__init__(*args, **kwargs)
        self.fields['search_word'].widget.attrs['style'] = "height:100px; font-size:300%"
