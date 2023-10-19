from datetime import datetime
from django.db.models import Q
from django.shortcuts import redirect
from django.views.generic import ListView, TemplateView, DetailView
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from common.decorators import login_required
from base.models import Excel, Company, Code
from material.models import Material, MaterialPurchase, MaterialPurchaseList
from system.models import Account
from common.forms import DateForm

@method_decorator(login_required, name='dispatch')
class AddMaterial(TemplateView):
    template_name = 'material/add_material.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
  
@method_decorator(login_required, name='dispatch')
class GetMaterials(ListView):
    #queryset = Company.objects.filter(~Q(name='MASTER')).order_by('-pk')
    template_name = 'material/get_materials.html'

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['excel'] = Excel.objects.filter(kind="자재")

        return context

    def get_queryset(self):
        try:
            qs = Material.objects.filter(
                introducing_company_id = self.request.session['introducing_company_id']
            )
        except:
            qs = []
        return qs

@method_decorator(login_required, name='dispatch')
class AddMaterialPurchase(TemplateView):
    template_name = 'material/add_material_purchase.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['company'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['material'] = Material.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")

        return context
    

@method_decorator(login_required, name='dispatch')
class GetMaterialPurchase(DetailView):
    model = MaterialPurchase
    template_name = 'material/get_material_purchase.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['material_purchase_list'] = MaterialPurchaseList.objects.filter(
            material_purchase = context['object']
        ).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        return context


@method_decorator(login_required, name='dispatch')
class UpdateMaterialPurchase(DetailView):
    model = MaterialPurchase
    template_name = 'material/update_material_purchase.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['company'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['material'] = Material.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['material_purchase_list'] = MaterialPurchaseList.objects.filter(
            material_purchase = context['object']
        ).order_by("pk")
            
        return context
    
    


@method_decorator(login_required, name='dispatch')
class GetMaterialPurchases(ListView, FormView):
    model = MaterialPurchase
    template_name = 'material/get_material_purchases.html'
    form_class = DateForm

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['wait'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='WAIT')
        context['start'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status__in=['START','PAUSE','PART'])
        context['cancel'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='CANCEL')
        context['complt'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='COMPLT')

        return context

@method_decorator(login_required, name='dispatch')
class MaterialPurchaseIndex(TemplateView):
    template_name = 'material/material_purchase_index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

