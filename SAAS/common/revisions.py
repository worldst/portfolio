import json
import reversion
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from system.models import Account
from datetime import datetime

def set_revisions(request, app, model_name, pk, data=None):
    if request.method != 'POST':
        return HttpResponseBadRequest("Invalid HTTP method")

    if data is None:
        data = json.loads(request.body.decode('UTF-8'))
    content_type = ContentType.objects.get(app_label=app, model=model_name)
    model = content_type.model_class()
    
    try:
        instance = model.objects.get(pk=pk)
    except :
        return HttpResponseBadRequest("model does not exist")

    '''
    with reversion.create_revision():
        comments = []
        for field, value in data.items():
            if hasattr(instance, field) and str(getattr(instance, field)) != str(value):
                comments.append(f"{instance._meta.get_field(field).verbose_name}을/를 {getattr(instance, field)}에서 {value}로 변경하였습니다.")
                setattr(instance, field, value)

        instance.save()
        reversion.set_user(Account.objects.get(pk=1))
        reversion.set_comment('` '.join(comments))


    with reversion.create_revision():
        comments = []
        for field, value in data.items():
            if hasattr(instance, field):
                old_value = getattr(instance, field)
                if old_value is None and value is not None:
                    comments.append(f"{instance._meta.get_field(field).verbose_name}에 {value}이/가 추가되었습니다.")
                elif str(old_value) != str(value):
                    comments.append(f"{instance._meta.get_field(field).verbose_name}을/를 {old_value}에서 {value}로 변경하였습니다.")
                setattr(instance, field, value)

        instance.save()
        reversion.set_user(Account.objects.get(pk=1))
        reversion.set_comment('` '.join(comments))
    '''


    comments = []
    for field, value in data.items():
        if hasattr(instance, field):
            old_value = getattr(instance, field)
            if old_value is None and value is not None:
                text = str(instance._meta.get_field(field).verbose_name) + '에 ' + str(value) + '이/가 추가되었습니다.'
                comments.append(text)
                # comments.append(f"{instance._meta.get_field(field).verbose_name}에 {value}이/가 추가되었습니다.")
            elif str(old_value) != str(value):
                text = str(instance._meta.get_field(field).verbose_name) + '을/를 ' + str(old_value) + '에서 '+ str(value)+  '로 변경하였습니다.'
                comments.append(text)
                # comments.append(f"{instance._meta.get_field(field).verbose_name}을/를 {old_value}에서 {value}로 변경하였습니다.")
            if (model_name == 'order' or model_name == 'estimate') and value != None and (field == 'registration_date' or field == 'due_date'):            
                setattr(instance, field, datetime.strptime(value, "%Y-%m-%d"))
            elif model_name == 'materialpurchase'  and value != None and (field == 'purchase_date' or field == 'due_date'):            
                setattr(instance, field, datetime.strptime(value, "%Y-%m-%d"))
            else:
                setattr(instance, field, value)

    print(comments)
    if comments:
        with reversion.create_revision():
            instance.save()
            try:
                reversion.set_user(Account.objects.get(username=request.session['username']))
            except:
                pass
            reversion.set_comment('` '.join(comments))

    #return JsonResponse({"message": "success"})


def get_revisions(request, app, model_name, pk):
    content_type = ContentType.objects.get(app_label=app, model=model_name)
    model = content_type.model_class()

    instance = model.objects.get(id=pk)
    versions = reversion.models.Version.objects.get_for_object(instance)

    revisions = []
    for version in versions:
        for comment in version.revision.comment.split('`'):
            revision_info = {
                "version": str(version),
                "date_created": version.revision.date_created,
                # "user": version.revision.user.username if version.revision.user else None,
                "comment": comment.strip(),
            }
            revisions.append(revision_info)
    return revisions
