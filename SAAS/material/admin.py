from django.contrib import admin
from .models import Material, MaterialPurchase, MaterialPurchaseList, EnterRecord
admin.site.register(Material)
admin.site.register(MaterialPurchase)
admin.site.register(MaterialPurchaseList)
admin.site.register(EnterRecord)