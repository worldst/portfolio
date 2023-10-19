from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

from base.endpoints.code.crud import (
    CodeCreateAPI,
    CodeModAPI,
    CodeDelAPI,
    GetCodesAPI,
    GetCodeAPI,
    GetCodeProcessWorkerEquipmentAPI
)
from base.endpoints.company.crud import (
    CompanyCreateAPI,
    CompanyModAPI,
    CompanyDelAPI,
    GetCompaniesAPI,
    GetCompanyAPI,
    CompanyListDelAPI,
    CompanyUploadAPI,
    CompanyExcelDownloadAPI
)
from base.endpoints.equipment.crud import (
    GetEquipmentsAPI,
    EquipmentCreateAPI,
    GetEquipmentAPI,
    EquipmentListDelAPI,
    EquipmentDelAPI,
    EquipmentModAPI
)
from base.views.code.crud import (
    CodeProcessManagement,
    CodeSpecialNoteManagement,
    CodeDeliveryManagement
)
from base.views.company.crud import (
    AddCompany,
    GetCompanies,
    GetCompany,
    UpdateCompany
)
from base.views.equipment.crud import (
    EquipmentManagement,
)
urlpatterns = [
    path('code/process/management/', CodeProcessManagement.as_view(),name ='code_process_management'),
    path('code/special/note/management/', CodeSpecialNoteManagement.as_view(),name ='code_special_note_management'),
    path('code/delivery/management/', CodeDeliveryManagement.as_view(),name ='code_delivery_management'),
    
    #설비
    path('equipment/management/', EquipmentManagement.as_view(),name ='equipment_management'),

    path('company/add/', AddCompany.as_view(),name ='add_company'),
    path('company/list/', GetCompanies.as_view(), name='get_companies'),
    path('company/<slug:pk>/detail', GetCompany.as_view(), name='get_company'),
    path('company/<slug:pk>/update', UpdateCompany.as_view(), name='update_company'),

    # 기준정보 코드
    path('api/code/<slug:pk>', GetCodeAPI),
    path('api/codes', GetCodesAPI),
    path('api/code/create/', CodeCreateAPI),
    path('api/code/mod/<slug:pk>', CodeModAPI),
    path('api/code/del/<slug:pk>', CodeDelAPI),
    
    #주문종합현황판(공정별,작업자,설비호출) 
    path('api/code/process/worker/equipment', GetCodeProcessWorkerEquipmentAPI),

    #거래처 코드
    path('api/company/<slug:pk>', GetCompanyAPI),
    path('api/companies', GetCompaniesAPI),
    path('api/company/create/', CompanyCreateAPI),
    path('api/company/mod/<slug:pk>', CompanyModAPI),
    path('api/company/del/<slug:pk>', CompanyDelAPI),
    path('api/company/del/', CompanyListDelAPI),
    path('api/company/upload/', CompanyUploadAPI),
    path('api/company/excel/download',  CompanyExcelDownloadAPI),

    #설비
    path('api/equipments', GetEquipmentsAPI),
    path('api/equipment/create/', EquipmentCreateAPI),
    path('api/equipment/<slug:pk>', GetEquipmentAPI),
    path('api/equipment/del/', EquipmentListDelAPI),
    path('api/equipment/del/<slug:pk>', EquipmentDelAPI),
    path('api/equipment/mod/<slug:pk>', EquipmentModAPI),
    re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
