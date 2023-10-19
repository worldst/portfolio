import json
from django.http import HttpResponse, JsonResponse
from system.models import Account
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum, Q
from base.models import IntroducingCompany
from system.models import Account
from material.models import Material
from django.forms.models import model_to_dict
from django.db import transaction
from common.revisions import set_revisions, get_revisions
from sales.models import Order, OrderProcess, ProcessRecord, OrderMaterialOutsourcing
from datetime import datetime
from material.models import MaterialUsedRecord
@csrf_exempt
def WorkSearchAPI(request):
    # ! 주문번호로 작업검색(공정은 텍스트로)
    process = request.GET.get('process')
    num = request.GET.get('num')
    try:
        introducing_company = IntroducingCompany.objects.get(
            pk = request.session['introducing_company_id']
        )
    except:
        return HttpResponse(
            json.dumps({
                'result': 'no_session'
        }), content_type='application/json')

    if not process:
        try:
            order = Order.objects.get(
                introducing_company = introducing_company,
                num = num
            )
            
            if order.status == 'CANCEL':
                return HttpResponse(
                    json.dumps({
                        'result': 'cancel',
                }), content_type='application/json')
            else:
                return HttpResponse(
                    json.dumps({
                        'result': 'success',
                }), content_type='application/json')
        except Order.DoesNotExist:
            # * 해당하는 주문이 존재 하지 않습니다.
            return HttpResponse(
                json.dumps({
                    'result': 'no_order'
            }), content_type='application/json')
    else:
        try:
            order_process = OrderProcess.objects.get(
                order__introducing_company = introducing_company,
                order__num = num,
                process = process,
                is_active = True
            )
            # * ex) location.href = /work/order/process/<slug:pk>
            return HttpResponse(
                json.dumps({
                    'result': 'success',
                    'order_process_id' : order_process.pk
            }), content_type='application/json')            
        except OrderProcess.DoesNotExist:
            # * 해당하는 주문 및 공정이 존재 하지 않습니다.
            return HttpResponse(
                json.dumps({
                    'result': 'fail'
            }), content_type='application/json')

@csrf_exempt
def WorkOrderProcessStartAPI(request,pk):
    json_data = json.loads(request.body.decode('utf-8'))
    order_process = OrderProcess.objects.get(
        pk = pk
    )
    json_data['order_process_id'] = order_process.pk
    json_data['start_dt'] = datetime.now()
    if order_process.status == 'WAIT' or order_process.status == 'PAUSE':
        data = ProcessRecord.objects.create(**json_data)
        order_process.worker = data.worker
        order_process.status = 'START'
        order_process.save()
        order = order_process.order
        if order.status == 'WAIT':
            order.start_dt = datetime.now()
        order.status = 'START'
        order.save()
    return HttpResponse(
        json.dumps({
            'result': 'success',
        }), content_type='application/json')

@csrf_exempt
def WorkOrderProcessStopAPI(request,pk):
    json_data = json.loads(request.body.decode('utf-8'))
    order_process = OrderProcess.objects.get(
        pk = pk
    )
    if order_process.status == 'START':
        reason = json_data['reason']
        data = ProcessRecord.objects.get(
            order_process = order_process,
            end_dt__isnull = True
        )
        data.end_dt = datetime.now()
        data.reason = reason
        data.save()
        order_process.status = 'PAUSE'
        order_process.save()
    return HttpResponse(
        json.dumps({
            'result': 'success',
        }), content_type='application/json')

@csrf_exempt
def WorkOrderProcessFinishAPI(request,pk):
    order_process = OrderProcess.objects.get(
        pk = pk
    )
    if order_process.status == 'START':
        data = ProcessRecord.objects.get(
            order_process = order_process,
            end_dt__isnull = True
        )
        data.end_dt = datetime.now()
        data.save()
        order_process.status = 'COMPLT'
        order_process.save()

        # * 공정이 모두 끝났는지 체크
        order = order_process.order
        check = OrderProcess.objects.filter(
            ~Q(status = 'COMPLT'),
            is_active=True,
            order = order
        )
        # * 공정이 모두 끝났다면 주문 COMPLT 완료 처리후 자재차감
        if len(check) == 0 :
            order.status = 'COMPLT'
            order.end_dt = datetime.now()
            order.save()
            order_material_outsourcing = OrderMaterialOutsourcing.objects.filter(
                order = order,
                sort = 'material',
                material__isnull = False,
            )
            for data in order_material_outsourcing:
                material = data.material
                material.stock -= data.cnt
                material.save()
                MaterialUsedRecord.objects.create(
                    material = material,
                    cnt = data.cnt,
                    order = order
                )
    return HttpResponse(
        json.dumps({
            'result': 'success',
        }), content_type='application/json')