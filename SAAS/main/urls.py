from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from system.views.account.loginout import Login, logout


urlpatterns = [
    path('admin/', admin.site.urls),

    path('', Login.as_view(), name='login'),
    path('logout/', logout, name='logout'), 

    path('base/', include('base.urls')),
    path('sales/', include('sales.urls')),
    path('system/', include('system.urls')),
    path('material/', include('material.urls')),
    path('work/', include('work.urls')),
    path('report/', include('report.urls')),
]
