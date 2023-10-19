from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from system.models import Account


class LoginForm(forms.Form):
    username = forms.CharField(
        error_messages={
            'required': '아이디를 입력해주세요.'
        },
        max_length=64, label='아이디'
    )
    password = forms.CharField(
        error_messages={
            'required': '비밀번호를 입력해주세요.'
        },
        widget=forms.PasswordInput, label='비밀번호'
    )

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        if username and password:
            try:
                User = get_user_model()
                user = Account.objects.get(username=username)
            except Account.DoesNotExist:
                self.add_error('username', '아이디가 존재하지 않습니다.')
                return  

            if not check_password(password, user.password):
                self.add_error('password', '잘못된 비밀번호입니다.')
            
            if not user.is_active:
                self.add_error('password', '비활성화 계정입니다. 계정을 활성화 해주세요.')

            #if user.is_login_checked == True:
                #self.add_error('username', '로그인 되어있는 계정입니다.')
