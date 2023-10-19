import uuid
from datetime import datetime, timedelta
from django.db import models
from system.models import Account
from common.choices.base import COMPANY_TYPE
import reversion

def get_company_path(instance, filename):
    return '/'.join(['company', '', filename])


def get_excel_path(instance, filename):
    return '/'.join(['excel', str(instance.pk), filename])


class IntroducingCompany(models.Model):
    name = models.CharField(max_length=32, verbose_name='도입기업명')
    
    class Meta:
        db_table = 'introducing_company'
        verbose_name = '도입기업'
        verbose_name_plural = '도입기업모음'

    def __str__(self):
        return self.name
    
class Company(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=64, verbose_name='업체명')
    type = models.CharField(max_length=64, verbose_name='매입/매출 구분',null=True, blank=True)
    registration_num = models.CharField(max_length=32, verbose_name='사업자등록번호',null=True,blank=True)
    account = models.ForeignKey('system.Account', verbose_name='업체담당자',null=True,blank=True, on_delete=models.SET_NULL)
    address = models.CharField(max_length=256, verbose_name='업체 주소',null=True,blank=True)
    onwer = models.CharField(max_length=64, verbose_name='대표자', null=True, blank=True)
    onwer_phone = models.CharField(max_length=64, verbose_name='대표번호', null=True, blank=True)
    email = models.CharField(max_length=128, verbose_name='이메일 주소(세금계산서)',null=True,blank=True)
    fax = models.CharField(max_length=64, verbose_name='팩스', blank=True,null=True)
    type_of_business = models.CharField(max_length=64, verbose_name='종목', blank=True,null=True)
    line_of_business = models.CharField(max_length=64, verbose_name='업태', blank=True,null=True)
    manager_name = models.CharField(max_length=64, verbose_name='담당자이름', null=True, blank=True)
    manager_phone = models.CharField(max_length=64, verbose_name='담당자연락처', null=True, blank=True)
    memo = models.TextField(verbose_name='메모',null=True,blank=True)

    class Meta:
        db_table = 'company'
        verbose_name = '업체'
        verbose_name_plural = '업체 모음'

    def __str__(self):
        return self.name
  

class Code(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True)
    sort = models.CharField(max_length=32, verbose_name='공정/주문내용/납품방법')
    name = models.CharField(max_length=128, verbose_name='코드명')
    ordering = models.IntegerField(verbose_name='순번', null=True,blank=True)
    is_active = models.BooleanField(verbose_name='활성여부', default=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'code'
        verbose_name = '코드'
        verbose_name_plural = '코드 모음'

class Equipment(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=128, verbose_name='설비명')
    memo = models.TextField(verbose_name='메모', null=True,blank=True)
    account = models.ForeignKey('system.Account', verbose_name='담당자', null=True, blank=True, on_delete=models.SET_NULL, related_name='equipment_account')
    process = models.CharField(max_length=128, verbose_name='공정', null=True, blank=True)
    process_name = models.CharField(max_length=128, verbose_name='공정이름', null=True, blank=True)
    def __str__(self):
        return self.name

    class Meta:
        db_table = 'equipment'
        verbose_name = '설비'
        verbose_name_plural = '설비 모음'

    @property
    def process_list(self):
        data = []
        for row in EquipmentProcess.objects.filter(equipment = self):
            data.append(row.process.pk)
            
class EquipmentProcess(models.Model):
    equipment = models.ForeignKey('base.Equipment', verbose_name='설비', on_delete=models.CASCADE, null=True, blank=True)
    process = models.ForeignKey('base.Code', verbose_name='공정', null=True, blank=True, on_delete=models.CASCADE)

    class Meta:
        db_table = 'equipment_process'
        verbose_name = '설비 공정'
        verbose_name_plural = '설비 공정 모음'


class Excel(models.Model):
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True, blank=True)
    file_name = models.CharField(max_length=128,verbose_name='파일이름',null=True, blank=True)
    excel_file = models.FileField(null=True, blank=True,verbose_name='엑셀파일', upload_to=get_excel_path)
    upload_date = models.DateTimeField(verbose_name="업로드 시간")
    kind = models.CharField(max_length=64, verbose_name='파일종류' , null=True, blank=True)

    class Meta:
        db_table = 'excel'
        verbose_name = '업로드 EXCEL'
        verbose_name_plural = '업로드 EXCEL 관리'

reversion.register(Company)
reversion.register(Code)
reversion.register(Equipment)
reversion.register(EquipmentProcess)