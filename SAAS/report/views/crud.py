from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from base.models import Code, Company
from system.models import Account
from sales.models import ProcessRecord

@method_decorator(login_required, name='dispatch')
class GetJobReport(ListView):
    template_name = 'get_job_report.html'

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        return context

    def get_queryset(self):
        try:
            qs = ProcessRecord.objects.filter(
                order_process__order__introducing_company_id = self.request.session['introducing_company_id'],
                end_dt__isnull = False
            )
        except:
            qs = []
        return qs
@method_decorator(login_required, name='dispatch')
class GetSalesReport(TemplateView):
    template_name = 'get_sales_report.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        return context
