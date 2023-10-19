from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path
from .views.crud import (
    GetJobReport,
    GetSalesReport
)
from report.endpoints.crud import (
    GetJobsReportAPI,
    JobsExcelDownloadAPI,
    GetSalesReportAPI,
    GetSaleCompanysReportAPI
)


urlpatterns = [
    ## VIEWS
    path('job/', GetJobReport.as_view(),name ='get_job_report'),
    path('sales/', GetSalesReport.as_view(),name ='get_sales_report'),

    # API
    path('api/sales', GetSalesReportAPI),
    path('api/sales/company', GetSaleCompanysReportAPI),
    path('api/jobs', GetJobsReportAPI),
    path('api/job/excel/download', JobsExcelDownloadAPI),
    re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
