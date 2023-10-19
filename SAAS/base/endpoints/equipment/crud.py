import json
from django.http import HttpResponse, JsonResponse
from system.models import Account
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.db.models import Sum, Q, F
from base.models import Company, Code, IntroducingCompany, Equipment, EquipmentProcess
from system.models import Account
from django.db import transaction
from common.revisions import set_revisions, get_revisions
@csrf_exempt
@transaction.atomic
def EquipmentCreateAPI(request):
    json_data = json.loads(request.body.decode('utf-8'))
    try:
        json_data['introducing_company_id'] = request.session['introducing_company_id']
    except:
        return HttpResponse(
            json.dumps({
                'result': 'no_session'
        }), content_type='application/json')
    try:
        Equipment.objects.get(
            introducing_company_id = json_data['introducing_company_id'],
            name = json_data['name'],
        )
        return HttpResponse(
            json.dumps({
                'result': 'fail'
        }), content_type='application/json')
    except Equipment.DoesNotExist:
        process_data = json_data.pop('process')
        equipment = Equipment.objects.create(**json_data)
        process_name = ''
        process_list = ''
        for row in process_data :
            process = Code.objects.get(
                pk = int(row)
            )
            if process_list == '':
                process_list = str(row)
                process_name = process.name
            else: 
                process_list += ',' + str(row)
                process_name += ',' + process.name
            EquipmentProcess.objects.create(
                equipment = equipment,
                process = process
            )
        equipment.process = process_list
        equipment.process_name = process_name
        equipment.save()

    return HttpResponse(
        json.dumps({
            'result': 'success'
    }), content_type='application/json')

@csrf_exempt
def GetEquipmentsAPI(request):
    search_type = request.GET.get('search_type') or ''
    date_type = request.GET.get('date_type') or ''
    keyword = request.GET.get('keyword') or ''
    start_date = request.GET.get('start_date') or ''
    end_date = request.GET.get('end_date') or ''
    #페이지당 데이터 기본 10개
    list_range = request.GET.get('list_range') or 10
    list_range = int(list_range)
    #페이지 기본 1페이지
    page = request.GET.get('page') or 1
    page = int(page)

    try:
        introducing_company = IntroducingCompany.objects.get(
            pk = request.session['introducing_company_id']
        )
    except:
        return HttpResponse(
            json.dumps({
                'result': 'no_session'
        }), content_type='application/json')
    
    data_list = Equipment.objects.filter(introducing_company=introducing_company).order_by('-pk')

    if start_date != '':
        data_list = data_list.filter(
            created_dt__date__gte = start_date
        )

    if end_date != '':
        data_list = data_list.filter(
            created_dt__date__lte = end_date
        )

    if search_type == '':
        data_list = data_list.filter(
            Q(name__icontains = keyword)|
            Q(process_name__icontains = keyword)|
            Q(account__name__icontains = keyword)|
            Q(memo__icontains = keyword)
        )
    else:
        q = Q()
        if search_type == 'name':
            q.add(Q(name__icontains = keyword), q.AND)
        elif search_type == 'process_name':
            q.add(Q(process_name__icontains = keyword), q.AND)
        elif search_type == 'account':
            q.add(Q(account__name__icontains = keyword), q.AND)
        elif search_type == 'memo':
            q.add(Q(memo__icontains=keyword), q.AND)
        data_list = data_list.filter(q)

    data_len = len(data_list)
    data_list = data_list.values(
        'pk','name','memo','account__id','account__username','process','process_name'
    )[(page-1) * list_range :  page * list_range]

    return JsonResponse({
        'data_len': data_len,
        'data_list':list(data_list),
    }, safe=False)

@csrf_exempt
def GetEquipmentAPI(request,pk):
    try:
        return JsonResponse(model_to_dict(Equipment.objects.get(pk=pk)), safe=False)
    except Company.DoesNotExist:
        return HttpResponse(
            json.dumps({
                'result': 'fail'
        }), content_type='application/json')
    

@transaction.atomic
def EquipmentListDelAPI(request):
    json_data = json.loads(request.body.decode('utf-8'))
    data_list = json_data.pop('data_list')
    for data in data_list:
        equipment = Equipment.objects.get(
            id = data['id']
        )
        equipment.delete()
        
    return HttpResponse(
        json.dumps({
            'result': 'success'
    }), content_type='application/json')

@csrf_exempt
def EquipmentDelAPI(request,pk):
    Equipment.objects.filter(pk=pk).delete()

    return HttpResponse(
        json.dumps({
            'result': 'success'
    }), content_type='application/json')


@csrf_exempt
def EquipmentModAPI(request, pk):
    
    json_data = json.loads(request.body.decode('utf-8'))
    try:
        json_data['introducing_company_id'] = request.session['introducing_company_id']
    except:
        return HttpResponse(
            json.dumps({
                'result': 'no_session'
        }), content_type='application/json')
    try:
        Equipment.objects.get(
            ~Q(pk = pk),
            introducing_company_id = json_data['introducing_company_id'],
            name = json_data['name'],
        )
        return HttpResponse(
            json.dumps({
                'result': 'fail'
        }), content_type='application/json')
    except Equipment.DoesNotExist:
        process_data = json_data.pop('process')
        # Equipment.objects.filter(pk=pk).update(**json_data)
        equipment = Equipment.objects.get(
            pk = pk
        )
        process_name = ''
        process_list = ''
        EquipmentProcess.objects.filter(
            equipment = equipment
        ).delete()
        for row in process_data :
            process = Code.objects.get(
                pk = int(row)
            )
            if process_list == '':
                process_list = str(row)
                process_name = process.name
            else: 
                process_list += ',' + str(row)
                process_name += ',' + process.name
            EquipmentProcess.objects.create(
                equipment = equipment,
                process = process
            )
        json_data['process'] = process_list
        json_data['process_name'] = process_name
        set_revisions(request, 'base', 'equipment', pk, json_data)

    return HttpResponse(
        json.dumps({
            'result': 'success'
    }), content_type='application/json')