from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

from work.endpoints.crud import (
    WorkSearchAPI,
    WorkOrderProcessStartAPI,
    WorkOrderProcessStopAPI,
    WorkOrderProcessFinishAPI
)
from work.views.crud import (
    WorkIndex,
    WorkOrderProcess
)

urlpatterns = [
    path('index/', WorkIndex.as_view(),name ='work_index'),
    path('order/process/<slug:pk>', WorkOrderProcess.as_view(),name ='work_order_process'),
    
    #API
    path('api/search/', WorkSearchAPI),
    path('api/order/process/<slug:pk>/start', WorkOrderProcessStartAPI),
    path('api/order/process/<slug:pk>/stop', WorkOrderProcessStopAPI),
    path('api/order/process/<slug:pk>/finish', WorkOrderProcessFinishAPI),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
