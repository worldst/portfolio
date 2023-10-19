from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path
from .views.account.loginout import (
    Login
)

from system.endpoints.account.crud import (
    ProcessEquipmentAPI,
    AccountCreateAPI,
    GetAccountsAPI,
    AccountsDelAPI,
    ModAccountAPI,
    AccountExcelDownloadAPI
)
from system.views.account.crud import (
    AddAccount,
    GetAccounts,
    GetAccount,
    UpdateAccount

)

urlpatterns = [
    # VIEWS
    path('account/add/', AddAccount.as_view(), name='add_account'),
    path('account/list/', GetAccounts.as_view(), name='get_accounts'),
    path('account/<slug:pk>/detail', GetAccount.as_view(), name='get_account'),
    path('account/<slug:pk>/update', UpdateAccount.as_view(), name='update_account'),

    path('api/process/equipment', ProcessEquipmentAPI),
    path('api/account/create/', AccountCreateAPI),
    path('api/accounts/', GetAccountsAPI),
    path('api/account/del/', AccountsDelAPI),
    path('api/account/mod/<slug:pk>', ModAccountAPI),
    path('api/account/excel/download', AccountExcelDownloadAPI),
     re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
