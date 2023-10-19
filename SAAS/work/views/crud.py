from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from base.models import Equipment
from material.models import Material
from system.models import Account
from sales.models import OrderProcess, ProcessRecord, OrderMaterialOutsourcing

@method_decorator(login_required, name='dispatch')
class WorkIndex(TemplateView):
    template_name = 'work_index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

@method_decorator(login_required, name='dispatch')
class WorkOrderProcess(DetailView):
    template_name = 'work_order_process.html'
    model = OrderProcess

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        order = context['object'].order
        context['order'] = order
        context['order_process'] = OrderProcess.objects.filter(
            order = order
        ).order_by("ordering")
        context['order_material_outsourcing'] = OrderMaterialOutsourcing.objects.filter(
            order = order
        ).order_by("pk")
        context['process_record'] = ProcessRecord.objects.filter(
            order_process__order = order
        ).order_by("pk")
        context['account'] = Account.objects.filter(
            introducing_company_id=self.request.session['introducing_company_id'],
            type="현장",
            is_delete=False
        ).order_by("pk")
        return context