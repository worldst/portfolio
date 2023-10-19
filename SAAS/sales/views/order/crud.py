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
from material.models import Material
from sales.models import Order, OrderProcess, ShipmentData, ShipmentFile, OrderMaterialOutsourcing, OrderFile
from system.models import Account


@method_decorator(login_required, name='dispatch')
class AddOrder(TemplateView):
    model = Order
    template_name = 'order/add_order.html'
    success_url = reverse_lazy('get_orders')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['company'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['order_process'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], sort="process").order_by("ordering","pk")
        context['material'] = Material.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")

        return context


@method_decorator(login_required, name='dispatch')
class GetOrders(ListView, FormView):
    model = Order
    template_name = 'order/get_orders.html'
    form_class = DateForm

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)

    '''
    def get_queryset(self):
        if self.request.method == 'POST':
            data = Order.objects.filter(
                Q(num__icontains=self.request.POST.get('keyword')) |
                Q(company__name__icontains=self.request.POST.get('keyword')) |
                Q(pjt_name__icontains=self.request.POST.get('keyword')) |
                Q(location__icontains=self.request.POST.get('keyword')) |
                Q(type__icontains=self.request.POST.get('keyword')) |
                Q(kind__icontains=self.request.POST.get('keyword')) | 
                Q(manager__name__icontains=self.request.POST.get('keyword')),
                ~Q(status='COMPLT'),
                stage='ORDER',
                order_type='BASE'
            ).order_by("-pk")
        else:
            data = Order.objects.filter(writer__customer_id=self.request.session.get('customer_id'))
    
        #paginator = Paginator(data, 25)
        
        #page = self.request.GET.get('page')
        #object_list = paginator.get_page(page)
        
        #return object_list
        return data
    '''

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['wait'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='WAIT')
        context['start'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status__in=['START','PAUSE','PART'])
        context['cancel'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='CANCEL')
        context['complt'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], status='COMPLT')

        return context


@method_decorator(login_required, name='dispatch')
class GetOrder(DetailView):
    model = Order
    template_name = 'order/get_order.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['order_process'] = OrderProcess.objects.filter(
            order = context['object']
        ).order_by("ordering")
        context['order_file'] = OrderFile.objects.filter(
            order = context['object']
        ).order_by("pk")
        context['order_material_outsourcing'] = OrderMaterialOutsourcing.objects.filter(
            order = context['object']
        ).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("ordering","pk")
        return context


@method_decorator(login_required, name='dispatch')
class UpdateOrder(DetailView):
    model = Order
    template_name = 'order/update_order.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['company'] = Company.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        context['material'] = Material.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        
        context['order_process'] = OrderProcess.objects.filter(
            order = context['object']
        ).order_by("ordering")
        context['order_file'] = OrderFile.objects.filter(
            order = context['object']
        ).order_by("pk")
        context['order_material_outsourcing'] = OrderMaterialOutsourcing.objects.filter(
            order = context['object']
        ).order_by("pk")

        return context
    

@method_decorator(login_required, name='dispatch')
class GetOrderShipments(ListView, FormView):
    model = Order
    template_name = 'order/get_order_shipments.html'
    form_class = DateForm

    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['wait'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], shipment_status='WAIT')
        context['start'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], shipment_status='START')
        context['complt'] = self.model.objects.filter(introducing_company_id=self.request.session['introducing_company_id'], shipment_status='COMPLT')
        context['delay'] = self.model.objects.filter(~Q(shipment_status='COMPLT'), introducing_company_id=self.request.session['introducing_company_id'], due_date__lt=datetime.now().date())

        return context
    
@method_decorator(login_required, name='dispatch')
class GetOrderShipment(DetailView):
    model = Order
    template_name = 'order/get_order_shipment.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['order_material_outsourcing'] = OrderMaterialOutsourcing.objects.filter(
            order = context['object']
        ).order_by("pk")
        context['order_file'] = OrderFile.objects.filter(
            order=context['object']
        ).order_by("pk")
        context['shipment_img'] = ShipmentFile.objects.filter(
            order=context['object'],
            sort='img'
        ).order_by("pk")
        context['shipment_file'] = ShipmentFile.objects.filter(
            order=context['object'],
            sort='file'
        ).order_by("pk")
        context['shipment_data'] = ShipmentData.objects.filter(
            order = context['object']
        ).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")
        return context
    
@method_decorator(login_required, name='dispatch')
class UpdateOrderShipment(DetailView):
    model = Order
    template_name = 'order/update_order_shipment.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['account'] = Account.objects.filter(~Q(type="DK"), introducing_company_id=self.request.session['introducing_company_id'], is_delete=False).order_by("pk")
        context['code'] = Code.objects.filter(introducing_company_id=self.request.session['introducing_company_id']).order_by("pk")

        context['order_material_outsourcing'] = OrderMaterialOutsourcing.objects.filter(
            order = context['object']
        ).order_by("pk")
        context['shipment_img'] = ShipmentFile.objects.filter(
            order=context['object'],
            sort='img'
        ).order_by("pk")
        context['shipment_file'] = ShipmentFile.objects.filter(
            order=context['object'],
            sort='file'
        ).order_by("pk")
        context['shipment_data'] = ShipmentData.objects.filter(
            order = context['object']
        ).order_by("pk")
        
        return context

@method_decorator(login_required, name='dispatch')
class GetOrderDashboard(ListView):
    model = Order
    template_name = 'order/get_order_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['code'] = Code.objects.filter(
            introducing_company_id=self.request.session['introducing_company_id'],
            sort='process',
            is_active=True
        ).order_by("ordering")
        context['account'] = Account.objects.filter(
            introducing_company_id=self.request.session['introducing_company_id'],
            type="현장",
            is_delete=False
        ).order_by("pk")
        context['total'] = len(Order.objects.filter(
            introducing_company_id = self.request.session['introducing_company_id'],
            status__in = ['WAIT','START']
        ))
        context['wait'] = len(Order.objects.filter(
            introducing_company_id = self.request.session['introducing_company_id'],
            status__in = ['WAIT']
        ))
        context['start'] = len(Order.objects.filter(
            introducing_company_id = self.request.session['introducing_company_id'],
            status__in = ['START']
        ))
        context['delay'] = len(Order.objects.filter(
            introducing_company_id = self.request.session['introducing_company_id'],
            due_date__gt = datetime.now().date(),
            status__in = ['WAIT','START'],
        ))
        context['urgent'] = len(Order.objects.filter(
            introducing_company_id = self.request.session['introducing_company_id'],
            special_note__icontains = '긴급',
            status__in = ['WAIT','START'],
        ))
        total_process = len(OrderProcess.objects.filter(
            order__status__in = ['WAIT','START'],
            is_active = True
        ))
        complt_process = len(OrderProcess.objects.filter(
            status__in = ['COMPLT'],
            order__status__in = ['WAIT','START'],
            is_active = True,
        ))
        if total_process != 0 and complt_process != 0 :
            context['complt_rate'] = int(complt_process / total_process * 100)
        else:
            context['complt_rate'] = 0
        return context