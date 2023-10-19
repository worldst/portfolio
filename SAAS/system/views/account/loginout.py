import json
import logging
from datetime import datetime, timedelta
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password, make_password
from common.mail import send
from common.forms import DateForm
from common.get_random_pwd import get_random_pwd
from system.models import Account
from system.forms import LoginForm


class Login(FormView):
    template_name = 'login.html'
    form_class = LoginForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        if 'username' in self.request.session:
            key_list = list(self.request.session.keys())
            for key in key_list:
                del self.request.session[key]
            self.request.session.modified = True

        return context

    def form_valid(self, form):
        account = Account.objects.get(username=form.data.get('username'))
        if 'username' in self.request.session:
            key_list = list(self.request.session.keys())
            for key in key_list:
                del self.request.session[key]
            self.request.session.modified = True
        try:
            self.request.session['username'] = account.username
            self.request.session['account_id'] = account.id
            self.request.session['account_name'] = account.name
            self.request.session['account_type'] = account.type
            self.request.session['introducing_company_id'] = account.introducing_company.pk
            self.request.session['instruction_process'] = ''
            self.request.session['instruction_equipment'] = ''
        except AttributeError:
            pass
        
        return super().form_valid(form)
    
    def get_success_url(self):
        if self.request.session['account_type'] == '사무': 
            return reverse_lazy('get_orders')
        elif self.request.session['account_type'] == '현장': 
            return reverse_lazy('work_index')
        else: 
            return reverse_lazy('get_sales_report')


def logout(request):
    if 'username' in request.session:
        key_list = list(request.session.keys())
        for key in key_list:
            del request.session[key]
        request.session.modified = True
    return redirect('/')



@csrf_exempt
def FindAccountEndpoint(request):
    """
    사용자 아이디/비밀번호 찾기 API
        
    Parameters
    ----------
    http-request : Object
    
    Returns
    -------
    http-response : Json
    성공 or 실패 상태 반환
    """
    result = 'None'
    if request.POST.get('type') == 'id':
        if Account.objects.filter(email=request.POST.get('email')).exists():
            account_obj = Account.objects.get(email=request.POST.get('email'))

            send(
                '아이디 전송드립니다.',
                '아이디는 ' + account_obj.username  + ' 입니다.',
                account_obj.email
            )
        else:
            print('존재하지 않는 이메일입니다.')
            result = 'A'
    else:
        if Account.objects.filter(username=request.POST.get('id'),email=request.POST.get('email'),is_delete=False).exists():
            new_pwd = get_random_pwd()
            account_obj = Account.objects.get(username=request.POST.get('id'),email=request.POST.get('email'))
            account_obj.password = make_password(new_pwd)
            account_obj.save()

            send(
                '비밀번호 전송드립니다.',
                '임시 비밀번호는 ' + new_pwd  + ' 입니다.',
                account_obj.email
            )
        else:
            print('존재하지 않는 이메일 혹은 아이디입니다.')
            result = 'B'

    return HttpResponse(
        json.dumps({
            'result': result
    }), content_type='application/json')
