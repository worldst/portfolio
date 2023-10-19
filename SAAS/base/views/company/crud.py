from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from base.models import Code, Company, Excel
from system.models import Account

@method_decorator(login_required, name='dispatch')
class AddCompany(TemplateView):
    template_name = 'company/add_company.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")

        return context
  
@method_decorator(login_required, name='dispatch')
class GetCompanies(ListView):
    #queryset = Company.objects.filter(~Q(name='MASTER')).order_by('-pk')
    template_name = 'company/get_companies.html'

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['sales'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], type__icontains='매출')
        context['purchase'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], type__icontains='매입')
        context['excel'] = Excel.objects.filter(kind="업체")

        return context

    def get_queryset(self):
        try:
            qs = Company.objects.filter(
                introducing_company_id = self.request.session['introducing_company_id']
            )
        except:
            qs = []
        return qs

@method_decorator(login_required, name='dispatch')
class GetCompany(DetailView):
    model = Company
    template_name = 'company/get_company.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

@method_decorator(login_required, name='dispatch')
class UpdateCompany(DetailView):
    model = Company
    template_name = 'company/update_company.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")

        return context