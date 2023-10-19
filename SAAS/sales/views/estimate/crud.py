from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import CreateView, FormView, UpdateView
from django.core.paginator import Paginator
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from common.forms import DateForm
from base.models import Company, Code
from sales.models import Estimate, EstimateFile
from system.models import Account


@method_decorator(login_required, name='dispatch')
class AddEstimate(TemplateView):
    model = Estimate
    template_name = 'estimate/add_estimate.html'
    success_url = reverse_lazy('get_estimates')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['company'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")

        return context


@method_decorator(login_required, name='dispatch')
class GetEstimates(ListView, FormView):
    model = Estimate
    template_name = 'estimate/get_estimates.html'
    form_class = DateForm

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['wait'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='WAIT')
        context['cancel'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='CANCEL')
        context['complt'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='COMPLT')

        return context


@method_decorator(login_required, name='dispatch')
class GetEstimate(DetailView):
    model = Estimate
    template_name = 'estimate/get_estimate.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['estimate_file'] = EstimateFile.objects.filter(
            estimate = context['object']
        ).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        
        return context


@method_decorator(login_required, name='dispatch')
class UpdateEstimate(DetailView):
    model = Estimate
    template_name = 'estimate/update_estimate.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['company'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")

        context['estimate_file'] = EstimateFile.objects.filter(
            estimate = context['object']
        ).order_by("pk")

        return context
