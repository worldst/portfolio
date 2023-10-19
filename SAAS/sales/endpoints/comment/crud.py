import json
from django.db.models import Q, F
from django.http import HttpResponse, JsonResponse
from sales.models import OrderComment


def AddCommentAPI(request, pk):
    json_data = json.loads(request.body.decode('utf-8'))
    # print(json_data)
    json_data['user_id'] = request.session.get('account_id')
    json_data['order_id'] = pk

    if json_data.get('parent_id') == 0:
        parent_id = json_data.pop('parent_id')
        OrderComment.objects.create(**json_data)
    else:
        OrderComment.objects.create(**json_data)
    
    return HttpResponse(
        json.dumps({
        'result': 'success'
    }), content_type='application/json')


def bom_serializable_object(node):
    obj = {
        "content": node.content,
        "id": node.id,
        "user": node.user.name if node.user else '삭제됨',
        "user_id": node.user.id if node.user else '',
        "created_dt": node.created_dt.strftime("%Y-%m-%d %H:%M:%S"),
        "children": [bom_serializable_object(ch) for ch in node.get_children()],
        "level": node.level,
        "is_delete": node.is_delete
    }
    return obj


def GetCommentAPI(request, pk):
    data_list = []
    for row in OrderComment.objects.filter(order_id=pk, parent=None).order_by("-pk"):
        data = bom_serializable_object(row)
        data_list.append(data)
    
    return JsonResponse(data_list, safe=False)


def ModCommentAPI(request, pk):
    json_data = json.loads(request.body.decode('utf-8'))
    
    OrderComment.objects.filter(pk=pk).update(**json_data)
    
    return HttpResponse(
        json.dumps({
        'result': 'success'
    }), content_type='application/json')
