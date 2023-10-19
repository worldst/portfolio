import json
from django.http import HttpResponse, JsonResponse
from system.models import Account
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum, Q
from base.models import Code, IntroducingCompany, Equipment
from system.models import Account
from django.forms.models import model_to_dict
from sales.models import Order, OrderProcess
from common.revisions import set_revisions, get_revisions
@csrf_exempt
def CodeCreateAPI(request):
    json_data = json.loads(request.body.decode('utf-8'))
    try:
        json_data['introducing_company_id'] = request.session['introducing_company_id']
    except:
        return HttpResponse(
            json.dumps({
                'result': 'no_session'
        }), content_type='application/json')
    
    code = Code.objects.filter(
        Q(ordering__isnull = False, ordering = json_data['ordering']) | Q(name = json_data['name']),
        introducing_company_id = json_data['introducing_company_id'],
        sort = json_data['sort'],
    ).last()

    if code != None:
        return HttpResponse(
            json.dumps({
                'result': 'duplicate'
        }), content_type='application/json')
    else:
        code = Code.objects.create(**json_data)

    return HttpResponse(
        json.dumps({
            'result': 'success',
            'pk': code.id
    }), content_type='application/json')

@csrf_exempt
def CodeModAPI(request,pk):
    json_data = json.loads(request.body.decode('utf-8'))

    code = Code.objects.get(pk=pk)
    #생산 공정 중인지 체크(공정)
    if json_data['sort'] == 'process':
        process_check = OrderProcess.objects.filter(
            ~Q(order__status__in = ['CANCEL']),
            ~Q(status__in = ['COMPLT']),
            process = code.name,
            is_active = True
        )

        #생산중
        if len(process_check) != 0 :
            return HttpResponse(
                json.dumps({
                    'result': 'instruction'
            }), content_type='application/json')
    if json_data['name'] != '':
        #중복체크
        code = Code.objects.filter(
            ~Q(pk = code.pk),
            Q(ordering__isnull = False, ordering = json_data['ordering']) | Q(name = json_data['name']),
            introducing_company = code.introducing_company,
            sort = code.sort,
        ).last()

        if code != None:
            #중복
            return HttpResponse(
                json.dumps({
                    'result': 'duplicate'
            }), content_type='application/json')
        else:
            # Code.objects.filter(pk=pk).update(**json_data)
            set_revisions(request, 'base', 'code', pk)
    else:
        code.delete()

    return HttpResponse(
        json.dumps({
            'result': 'success'
    }), content_type='application/json')

@csrf_exempt
def CodeDelAPI(request,pk):

    Code.objects.filter(pk=pk).delete()

    return HttpResponse(
        json.dumps({
            'result': 'success'
    }), content_type='application/json')

@csrf_exempt
def GetCodesAPI(request):
    sort = request.GET.get('sort')
    try:
        introducing_company = IntroducingCompany.objects.get(
            pk = request.session['introducing_company_id']
        )
    except:
        return HttpResponse(
            json.dumps({
                'result': 'no_session'
        }), content_type='application/json')
    
    return JsonResponse(list(Code.objects.filter(introducing_company=introducing_company,sort = sort).order_by("ordering","pk").values()), safe=False)

@csrf_exempt
def GetCodeAPI(request,pk):
    try:
        return JsonResponse(model_to_dict(Code.objects.get(pk=pk)), safe=False)
    except Code.DoesNotExist:
        return HttpResponse(
            json.dumps({
                'result': 'fail'
        }), content_type='application/json')
    
@csrf_exempt
def GetCodeProcessWorkerEquipmentAPI(request):
    # * : 공정 텍스트 형태로
    # TODO : 작업자는 나중에 계정 설정 끝나면 
    process = request.GET.get('process')
    
    try:
        introducing_company = IntroducingCompany.objects.get(
            pk = request.session['introducing_company_id']
        )
    except:
        return HttpResponse(
            json.dumps({
                'result': 'no_session'
        }), content_type='application/json')

    return JsonResponse({
        'account_list':list(Account.objects.filter(introducing_company=introducing_company, is_delete=False).values()),
        'equipment_list':list(Equipment.objects.filter(introducing_company=introducing_company,process_name__icontains = process).values()),
    }, safe=False)