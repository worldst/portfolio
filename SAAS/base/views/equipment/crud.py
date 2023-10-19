from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from base.models import Code, Equipment
from system.models import Account

@method_decorator(login_required, name='dispatch')
class EquipmentManagement(ListView):
    model = Equipment
    template_name = 'equipment/equipment_management.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            context['code_list'] = Code.objects.filter(
                sort = 'process',
                introducing_company_id = self.request.session['introducing_company_id']
            )
            context['account_list'] = Account.objects.filter(
                introducing_company_id = self.request.session['introducing_company_id'],
                is_delete=False
            )
        except:
            context['account_list'] = []
        return context
