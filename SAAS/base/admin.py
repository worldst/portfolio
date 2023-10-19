from django.contrib import admin
from .models import (
    Company, IntroducingCompany,Code,
    Equipment, EquipmentProcess
)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


admin.site.register(Company, CompanyAdmin)
admin.site.register(IntroducingCompany)
admin.site.register(Code)
admin.site.register(Equipment)
admin.site.register(EquipmentProcess)
