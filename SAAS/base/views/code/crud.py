from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from base.models import Code
from system.models import Account

@method_decorator(login_required, name='dispatch')
class CodeProcessManagement(TemplateView):
    template_name = 'code/code_process_management.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            context['code_list'] = Code.objects.filter(
                sort = 'process',
                introducing_company_id = self.request.session['introducing_company_id']
            )
        except:
            context['code_list'] = []
        return context
    
@method_decorator(login_required, name='dispatch')
class CodeSpecialNoteManagement(TemplateView):
    template_name = 'code/code_special_note_management.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            context['code_list'] = Code.objects.filter(
                sort = 'special_note',
                introducing_company_id = self.request.session['introducing_company_id']
            )
        except:
            context['code_list'] = []
        return context
    
@method_decorator(login_required, name='dispatch')
class CodeDeliveryManagement(TemplateView):
    template_name = 'code/code_delivery_management.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            context['code_list'] = Code.objects.filter(
                sort = 'delivery',
                introducing_company_id = self.request.session['introducing_company_id']
            )
        except:
            context['code_list'] = []
        return context