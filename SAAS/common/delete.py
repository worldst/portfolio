from datetime import datetime
import json
from django.http import HttpResponse
from sales.models import Order
from .get_literal_eval import get_literal_eval
from django.apps import apps
from django.shortcuts import redirect
from django.db.models import Q, ProtectedError


def delete_exec(model, check_list, request):
    # delete_exec 변경 : 조건이 필요한 삭제의 경우 url을 전달받아서 다른 곳에서 처리하도록 하면 좋지않을까요?
    print(model)
    status = 'success'
    redirect_url = ''
    detail = ''
    # delete_exec 방식 dictonry 로 변경
    model_obj = ''

    for app in apps.get_app_configs():
        for model_candidate in app.get_models():
            if model_candidate._meta.db_table == model:
                model_obj = model_candidate

    filter_condition = {}

    for obj in get_literal_eval(check_list):
        filter_condition['pk'] = int(obj['id'])
        try:
            # 참조값 삭제 불가에 따른 ProtectedError 체크
            model_obj.objects.filter(**filter_condition).delete()
        except ProtectedError as protect:
            status = 'fail'
            # print('reference model list')
            # print(model_obj._meta.related_objects)
            detail = {'reference': protect.args[1][0]._meta.verbose_name,} # 참조값 넣으면 됩니다.

    return status, detail, redirect_url

def select(request):
    status, detail,redirect_url = delete_exec(
        request.POST.get('tableIndex'),
        request.POST.getlist('checkList'),
        request
    )

    print(status)

    return HttpResponse(
        json.dumps({
            'result': status,
            'detail': detail,
            'redirect_url' : redirect_url
        }), content_type='application/json')
