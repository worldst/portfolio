from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path
from .views.estimate.crud import (
    AddEstimate,
    GetEstimates,
    GetEstimate,
    UpdateEstimate
)
from .views.order.crud import (
    AddOrder,
    GetOrders,
    GetOrderShipments,
    GetOrderShipment,
    UpdateOrderShipment,
    GetOrder,
    UpdateOrder,
    GetOrderDashboard
)
from sales.endpoints.order.crud import (
    OrderCreateAPI,
    GetOrdersAPI,
    GetOrderAPI,
    OrderDelAPI,
    OrderModAPI,
    OrderCancelAPI,
    OrderListDelAPI,
    GetOrderShipmentsAPI,
    GetOrderShipmentsStatusChangeAPI,
    GetOrderShipmentStatusChangeAPI,
    OrderShipmentModAPI,
    GetOrderShipmentAPI,
    OrderDashboardRefreshAPI,
    OrderExcelDownloadAPI,
    OrderShipmentExcelDownloadAPI,
    OrderShipmentPhotoCreateAPI,
    OrderWorkExcelDownloadAPI,
    OrdersWorkExcelDownloadAPI
)
from sales.endpoints.estimate.crud import (
    EstimateCreateAPI,
    EstimateListDelAPI,
    EstimateDelAPI,
    GetEstimateAPI,
    GetEstimatesAPI,
    EstimateModAPI,
    EstimateStatusChangeAPI,
    EstimateExcelDownloadAPI
)
from sales.endpoints.comment.crud import (
    AddCommentAPI,
    ModCommentAPI,
    GetCommentAPI
)

urlpatterns = [
    ## VIEWS
    path('estimate/add/', AddEstimate.as_view(), name='add_estimate'),
    path('estimates/', GetEstimates.as_view(), name='get_estimates'),
    path('estimate/<slug:pk>/detail', GetEstimate.as_view(), name='get_estimate'),
    path('estimate/<slug:pk>/update', UpdateEstimate.as_view(), name='update_estimate'),

    path('order/add/', AddOrder.as_view(), name='add_order'),
    path('orders/', GetOrders.as_view(), name='get_orders'),
    path('order/<slug:pk>/detail', GetOrder.as_view(), name='get_order'),
    path('order/<slug:pk>/update', UpdateOrder.as_view(), name='update_order'),
    path('order/shipments/', GetOrderShipments.as_view(), name='get_order_shipments'),
    path('order/shipment/<slug:pk>/detail', GetOrderShipment.as_view(), name='get_order_shipment'),
    path('order/shipment/<slug:pk>/update', UpdateOrderShipment.as_view(), name='update_order_shipment'),

    path('dashboard/', GetOrderDashboard.as_view(), name='get_order_dashboard'),
    
    #수주
    path('api/order/create/', OrderCreateAPI),
    path('api/orders', GetOrdersAPI),
    path('api/order/<slug:pk>', GetOrderAPI),
    path('api/order/mod/<slug:pk>', OrderModAPI),
    path('api/order/del/<slug:pk>', OrderDelAPI),
    path('api/order/cancel/', OrderCancelAPI),
    path('api/order/del/', OrderListDelAPI),
    path('api/order/dashboard/refresh/', OrderDashboardRefreshAPI),
    path('api/order/excel/download',  OrderExcelDownloadAPI),

    path('api/order/work/excel/download',  OrderWorkExcelDownloadAPI),
    path('api/orders/work/excel/download',  OrdersWorkExcelDownloadAPI),
    
    # 출하
    path('api/order/shipment/<slug:pk>', GetOrderShipmentAPI),
    path('api/order/shipments/', GetOrderShipmentsAPI),
    path('api/order/shipments/status/change', GetOrderShipmentsStatusChangeAPI),
    path('api/order/shipment/<slug:pk>/status/change', GetOrderShipmentStatusChangeAPI),
    path('api/order/shipment/<slug:pk>/mod', OrderShipmentModAPI),
    path('api/order/shipment/excel/download',  OrderShipmentExcelDownloadAPI),
    path('api/order/shipment/<slug:pk>/photo/create/', OrderShipmentPhotoCreateAPI),
    
    #견적 
    path('api/estimate/create/', EstimateCreateAPI),
    path('api/estimates', GetEstimatesAPI),
    path('api/estimate/<slug:pk>', GetEstimateAPI),
    path('api/estimate/del/', EstimateListDelAPI),
    path('api/estimate/mod/<slug:pk>', EstimateModAPI),
    path('api/estimate/del/<slug:pk>', EstimateDelAPI),
    path('api/estimate/status/change/',  EstimateStatusChangeAPI),
    path('api/estimate/excel/download', EstimateExcelDownloadAPI),
    
    # 댓글
    path('api/comment/add/<int:pk>', AddCommentAPI),
    path('api/comment/mod/<int:pk>', ModCommentAPI),
    path('api/comment/<int:pk>', GetCommentAPI),
    re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
