from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

from material.endpoints.material.crud import (
    MaterialCreateAPI,
    MaterialModAPI,
    MaterialDelAPI,
    GetMaterialAPI,
    GetMaterialsAPI,
    MaterialListDelAPI,
    MaterialUploadAPI,
    MaterialExcelDownloadAPI,
    MaterialPurchaseCreateAPI,
    GetMaterialPurchasesAPI,
    GetMaterialPurchaseAPI,
    MaterialPurchaseModAPI,
    MaterialPurchaseDelAPI,
    MaterialPurchaseCancelAPI,
    MaterialPurchaseListDelAPI,
    GetMaterialPurchasesStatusChangeAPI,
    GetMaterialPurchaseStatusChangeAPI,
    GetMaterialPurchaseListStatusChangeAPI,
    MaterialPurchaseExcelDownloadAPI,
    MaterialEnterRecordAPI,
    MaterialUsedRecordAPI,
    MaterialHistoryAPI,
    MaterialPurchaseSearchAPI,
    MaterialPurchasesWorkExcelDownloadAPI,
    MaterialPurchaseWorkExcelDownloadAPI
)
from material.views.material.crud import (
    AddMaterial,
    GetMaterials,
    AddMaterialPurchase,
    GetMaterialPurchase,
    UpdateMaterialPurchase,
    GetMaterialPurchases,
    MaterialPurchaseIndex
)

urlpatterns = [
    path('add/', AddMaterial.as_view(),name ='add_material'),
    path('list/', GetMaterials.as_view(),name ='get_materials'),
    path('purchase/<slug:pk>/detail', GetMaterialPurchase.as_view(), name='get_material_purchase'),
    path('purchase/<slug:pk>/update', UpdateMaterialPurchase.as_view(), name='update_material_purchase'),
    
    path('purchase/add/', AddMaterialPurchase.as_view(),name ='add_material_purchase'),
    path('purchases/', GetMaterialPurchases.as_view(),name ='get_material_purchases'),
    path('purchases/index/', MaterialPurchaseIndex.as_view(),name ='material_purchase_index'),

    # * 자재
    path('api/create/', MaterialCreateAPI),
    path('api/mod/<slug:pk>', MaterialModAPI),
    path('api/del/<slug:pk>', MaterialDelAPI),
    path('api/<slug:pk>', GetMaterialAPI),
    path('api/list/', GetMaterialsAPI),
    path('api/del/', MaterialListDelAPI),
    path('api/upload/', MaterialUploadAPI),
    path('api/excel/download',  MaterialExcelDownloadAPI),
    path('api/enter/record/<slug:pk>',  MaterialEnterRecordAPI),
    path('api/used/record/<slug:pk>',  MaterialUsedRecordAPI),
    path('api/history/<slug:pk>',  MaterialHistoryAPI),

    # * 자재 발주
    path('api/purchase/create/', MaterialPurchaseCreateAPI),
    path('api/purchase/list/', GetMaterialPurchasesAPI),
    path('api/purchase/<slug:pk>', GetMaterialPurchaseAPI),
    path('api/purchase/mod/<slug:pk>', MaterialPurchaseModAPI),
    path('api/purchase/del/<slug:pk>', MaterialPurchaseDelAPI),
    path('api/purchase/cancel/', MaterialPurchaseCancelAPI),
    path('api/purchase/del/', MaterialPurchaseListDelAPI),
    path('api/purchase/status/change', GetMaterialPurchasesStatusChangeAPI),
    path('api/purchase/<slug:pk>/status/change', GetMaterialPurchaseStatusChangeAPI),
    path('api/purchase/list/<slug:pk>/status/change', GetMaterialPurchaseListStatusChangeAPI),
    path('api/purchase/excel/download',  MaterialPurchaseExcelDownloadAPI),
    path('api/purchase/search/',  MaterialPurchaseSearchAPI),
    path('api/purchases/work/excel/download',  MaterialPurchasesWorkExcelDownloadAPI),
    path('api/purchase/work/excel/download',  MaterialPurchaseWorkExcelDownloadAPI),

    re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
