from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from base.models import Excel, Company, Code
from system.models import Account
from common.forms import DateForm

@method_decorator(login_required, name='dispatch')
class AddAccount(TemplateView):
    template_name = 'account/add_account.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
    

@method_decorator(login_required, name='dispatch')
class GetAccounts(ListView):
    template_name = 'account/get_accounts.html'

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)

    def get_queryset(self):
        try:
            qs = Account.objects.filter(
                ~Q(type="DK"),
                introducing_company_id = self.request.session['introducing_company_id'],
                is_delete = False
            )
        except:
            qs = []
        return qs

@method_decorator(login_required, name='dispatch')
class GetAccount(DetailView):
    model = Account
    template_name = 'account/get_account.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

@method_decorator(login_required, name='dispatch')
class UpdateAccount(DetailView):
    model = Account
    template_name = 'account/update_account.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context