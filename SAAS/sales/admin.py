from django.contrib import admin
from .models import (
    Estimate, EstimateFile,
    Order, OrderProcess, OrderMaterialOutsourcing, OrderFile,
    ShipmentFile, ShipmentData
)
admin.site.register(Estimate)
admin.site.register(EstimateFile)
admin.site.register(Order)
admin.site.register(OrderProcess)
admin.site.register(OrderFile)
admin.site.register(OrderMaterialOutsourcing)
admin.site.register(ShipmentFile)
admin.site.register(ShipmentData)
