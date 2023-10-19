from django.db import models
from common.choices.common import STATUS
from django.utils import timezone
from django.db.models import Sum, Q, F
from datetime import datetime
from mptt.models import MPTTModel, TreeForeignKey
import reversion

def get_file_path(instance,filename):
    return '/'.join(['sales', '', filename])

class Estimate(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True)
    num = models.CharField(max_length=64, verbose_name='견적번호')
    company = models.ForeignKey('base.Company', verbose_name='업체', on_delete=models.SET_NULL, null=True, blank=True)
    company_name = models.CharField(max_length=64, verbose_name='업체명')
    pjt_name = models.CharField(max_length=64, verbose_name='프로젝트 명')
    registration_date = models.DateField(verbose_name='견적일', blank=True,null=True)
    account = models.ForeignKey('system.Account',null=True,blank=True, on_delete=models.SET_NULL, verbose_name='접수 담당자')
    special_note = models.CharField(max_length=256, verbose_name='주문 특이사항',null=True, blank=True)
    price = models.BigIntegerField(verbose_name='견적금액',null=True,blank=True, default=0)
    due_date = models.DateField(verbose_name='견적 기한', blank=True,null=True)
    memo = models.TextField(verbose_name='메모', null=True, blank=True)
    status = models.CharField(max_length=32, choices=STATUS, default='WAIT', verbose_name='진행상태')
    
    class Meta:
        db_table = 'estimate'
        verbose_name = '견적'
        verbose_name_plural = '견적'

    @property
    def username(self):
        if self.account != None:
            return self.account.username


class EstimateFile(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    estimate = models.ForeignKey(Estimate,verbose_name='견적', on_delete=models.CASCADE)
    upload_file = models.FileField(null=True, blank=True,verbose_name='업로드 파일', upload_to=get_file_path)
    
    class Meta:
        db_table = 'estimate_file'
        verbose_name = '견적 파일'
        verbose_name_plural = '견적 파일 모음'

class Order(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True)
    num = models.CharField(max_length=64, verbose_name='주문번호')
    company = models.ForeignKey('base.Company', verbose_name='업체', on_delete=models.SET_NULL, null=True, blank=True)
    company_name = models.CharField(max_length=64, verbose_name='업체명')
    pjt_name = models.CharField(max_length=64, verbose_name='프로젝트 명')
    registration_date = models.DateField(verbose_name='수주일', blank=True,null=True)
    account = models.ForeignKey('system.Account',null=True,blank=True, on_delete=models.SET_NULL)
    special_note = models.CharField(max_length=256, verbose_name='주문 특이사항',null=True, blank=True)
    delivery_method = models.CharField(max_length=128, verbose_name='납품 방법',null=True, blank=True)
    due_date = models.DateField(verbose_name='납기 예정 일자', blank=True,null=True)
    memo = models.TextField(verbose_name='메모', null=True, blank=True)
    manager_name = models.CharField(max_length=64, verbose_name='담당자이름', null=True, blank=True)
    manager_phone = models.CharField(max_length=64, verbose_name='담당자연락처', null=True, blank=True)
    process_price = models.BigIntegerField(verbose_name='공정비', null=True, blank=True, default=0)
    material_price = models.BigIntegerField(verbose_name='자재비', null=True, blank=True, default=0)
    outsourcing_price = models.BigIntegerField(verbose_name='외주비', null=True, blank=True, default=0)
    etc_price = models.BigIntegerField(verbose_name='기타비용', null=True, blank=True, default=0)

    status = models.CharField(max_length=32, choices=STATUS, default='WAIT', verbose_name='진행상태')
    start_dt = models.DateTimeField(blank=True, null=True, verbose_name="주문 시작 시간")
    end_dt = models.DateTimeField(blank=True, null=True, verbose_name="주문 종료 시간")
    shipment_status = models.CharField(max_length=32, choices=STATUS, default='WAIT', verbose_name='출하 진행상태')
    shipment_start_dt = models.DateTimeField(blank=True, null=True, verbose_name="출하 시작 시간")
    shipment_end_dt = models.DateTimeField(blank=True, null=True, verbose_name="출하 종료 시간")
    cancel_memo = models.CharField(max_length=256, verbose_name='취소사유', null=True, blank=True)
    is_export = models.BooleanField(default=False, verbose_name="수출여부")

    class Meta:
        db_table = 'order'
        verbose_name = '주문'
        verbose_name_plural = '주문 모음'
    
    @property
    def username(self):
        if self.account != None:
            return self.account.username

    @property
    def total_sales_price(self):
        return (self.process_price or 0) + (self.material_price or 0) + (self.outsourcing_price or 0) + (self.etc_price or 0)
    
    @property
    def process_cost(self):
        return OrderProcess.objects.filter(
            order = self,
            is_active = True,
        ).aggregate(
            cost = Sum('price')
        )['cost'] or 0
    
    @property
    def material_cost(self):
        return OrderMaterialOutsourcing.objects.filter(
            order = self,
            sort = 'material',
        ).aggregate(
            cost = Sum('price')
        )['cost'] or 0
    
    @property
    def outsourcing_cost(self):
        return OrderMaterialOutsourcing.objects.filter(
            order = self,
            sort = 'out',
        ).aggregate(
            cost = Sum('price')
        )['cost'] or 0

    @property
    def total_cost(self):
        return self.process_cost + self.material_cost + self.outsourcing_cost

    @property
    def total_process(self):
        return len(OrderProcess.objects.filter(
            order = self,
            is_active = True
        ))
    @property
    def start_process(self):
        return len(OrderProcess.objects.filter(
            ~Q(status = 'WAIT'),
            order = self,
            is_active = True
        ))
    @property
    def complt_process(self):
        return len(OrderProcess.objects.filter(
            status = 'COMPLT',
            order = self,
            is_active = True
        ))
    @property
    def complt_rate(self):
        if self.total_process != 0 and self.complt_process !=0 :
            return (self.complt_process / self.total_process * 100)
        else:
            return 0
    @property
    def process_text(self):
        text = ''
        process_list = OrderProcess.objects.filter(
            order = self,
            is_active = True
        )
        for data in process_list:
            if text == '':
                text = data.process + '□'
            else:
                text += ' / '+ data.process + '□'
        return text
class OrderProcess(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name="주문")
    process = models.CharField(max_length=32, verbose_name="공정")
    ordering = models.IntegerField(verbose_name='순번', null=True,blank=True)
    is_active = models.BooleanField(verbose_name='활성여부', default=True)
    price = models.BigIntegerField(verbose_name='비용', null=True, blank=True, default=0)
    status = models.CharField(max_length=32, choices=STATUS, default='WAIT', verbose_name='진행상태')
    worker = models.ForeignKey('system.Account', verbose_name='최종 작업자', null=True, blank=True, on_delete=models.SET_NULL)
    
    class Meta:
        db_table = 'order_process'
        verbose_name = '주문 공정'
        verbose_name_plural = '주문 공정 모음'

    @property
    def last_equipment(self):
        data = ProcessRecord.objects.filter(
            order_process = self
        ).order_by('-created_dt')
        if len(data) != 0:
            return data.first().equipment
        return ''

class OrderFile(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    order = models.ForeignKey(Order,verbose_name='order', on_delete=models.CASCADE)
    upload_file = models.FileField(null=True, blank=True,verbose_name='업로드 파일', upload_to=get_file_path)
    
    class Meta:
        db_table = 'order_file'
        verbose_name = '주문 파일'
        verbose_name_plural = '주문 파일 모음'

class OrderMaterialOutsourcing(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    order = models.ForeignKey(Order,verbose_name='order', on_delete=models.CASCADE)
    sort = models.CharField(max_length=32, verbose_name='외주/자재')
    material = models.ForeignKey('material.Material', verbose_name='자재&외주명', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=128, verbose_name='자재&외주명', null=True, blank=True)
    unit_price = models.BigIntegerField(verbose_name='단가', default=0, null=True, blank=True)
    unit = models.CharField(verbose_name='단위', null=True, blank=True, max_length=32)
    cnt = models.IntegerField(verbose_name='수량', default=0, null=True, blank=True)
    price = models.BigIntegerField(verbose_name='금액', default=0, null=True, blank=True)
    upload_file = models.FileField(null=True, blank=True,verbose_name='업로드 파일', upload_to=get_file_path)

    class Meta:
        db_table = 'order_material_outsourcing'
        verbose_name = '주문 자재 및 외주'
        verbose_name_plural = '주문 자재 및 외주 모음'

class ShipmentFile(models.Model):
    sort = models.CharField(max_length=32, verbose_name='사진/파일')
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    order = models.ForeignKey(Order,verbose_name='order', on_delete=models.CASCADE)
    upload_file = models.FileField(null=True, blank=True, verbose_name='업로드 파일', upload_to=get_file_path)
    
    class Meta:
        db_table = 'shipment_file'
        verbose_name = '출하 파일'
        verbose_name_plural = '출하 파일 모음'

class ShipmentData(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    order = models.ForeignKey(Order,verbose_name='order', on_delete=models.CASCADE)
    account = models.ForeignKey('system.Account',null=True,blank=True, on_delete=models.SET_NULL, verbose_name='출고 담당자')
    memo = models.TextField(verbose_name='메모',null=True, blank=True)
    method = models.CharField(max_length=64, null=True, blank=True, verbose_name='방법')
    name = models.CharField(max_length=128, null=True, blank=True, verbose_name='배송 기사 이름')
    phone_number = models.CharField(max_length=128, null=True, blank=True, verbose_name='배송 기사 연락처')
    car_number = models.CharField(max_length=128, null=True, blank=True, verbose_name='배송 차량 번호')
    
    class Meta:
        db_table = 'shipment_data'
        verbose_name = '출하 데이터'
        verbose_name_plural = '출하 데이터 모음'

class ProcessRecord(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    order_process = models.ForeignKey(OrderProcess, verbose_name='공정', null=True, blank=True, on_delete=models.CASCADE)
    worker = models.ForeignKey('system.Account', verbose_name='작업자', null=True, blank=True, on_delete=models.SET_NULL)
    equipment = models.ForeignKey('base.Equipment', verbose_name='설비', null=True, blank=True, on_delete=models.SET_NULL)
    equipment_name = models.CharField(max_length=128, verbose_name="설비이름",null=True,blank=True)
    start_dt = models.DateTimeField(null=True, blank=True, verbose_name='시작시간')
    end_dt = models.DateTimeField(null=True, blank=True, verbose_name='종료시간')
    reason = models.TextField(null=True, blank=True, verbose_name='정지사유')

    class Meta:
        db_table = 'process_record'
        verbose_name = '공정 기록'
        verbose_name_plural = '공정 기록 모음'

    def lead_time(self):
        if self.end_dt != None:
            return str(self.end_dt - self.start_dt).split('.')[0]
        return '-'

class OrderComment(MPTTModel):
    user = models.ForeignKey('system.Account', verbose_name='작성자', null=True, blank=True, on_delete=models.SET_NULL)
    order = models.ForeignKey(Order, verbose_name='수주', null=True, blank=True, on_delete=models.CASCADE)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    content = models.TextField()
    created_dt = models.DateTimeField(auto_now_add=True)
    is_delete = models.BooleanField(default=False, verbose_name='삭제유무')

    class Meta:
        db_table = 'order_comment'
        verbose_name = '코멘트'
        verbose_name_plural = '코멘트 모음'

reversion.register(Estimate)
reversion.register(Order)