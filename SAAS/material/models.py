from django.db import models
import reversion
from common.choices.common import STATUS

class Material(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=128, verbose_name='자재명')
    unit_price = models.IntegerField(verbose_name='단가', default=0)
    unit = models.CharField(verbose_name='단위', null=True, blank=True, max_length=32)
    stock = models.IntegerField(verbose_name='현재고', default=0, null=True, blank=True)
    safety_stock = models.IntegerField(verbose_name='안전재고', default=0, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'material'
        verbose_name = '자재'
        verbose_name_plural = '자재 모음'

reversion.register(Material)

class MaterialUsedRecord(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    material = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name="자재")
    order = models.ForeignKey('sales.Order',on_delete=models.SET_NULL, verbose_name="주문",null=True,blank=True)
    cnt = models.FloatField(default=0, verbose_name='사용수량')

    class Meta:
        db_table = 'material_used_record'
        verbose_name = '자재 차감 기록'
        verbose_name_plural = '자재 차감 기록 모음'

class MaterialPurchase(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True)
    num = models.CharField(max_length=64, verbose_name='발주번호')
    company = models.ForeignKey('base.Company', verbose_name='업체', on_delete=models.SET_NULL, null=True, blank=True)
    company_name = models.CharField(max_length=64, verbose_name='업체명')
    name = models.CharField(max_length=256, verbose_name='발주건명')
    purchase_date = models.DateField(verbose_name='발주 생성일', null=True, blank=True)
    account = models.ForeignKey('system.Account',null=True,blank=True, on_delete=models.SET_NULL, verbose_name='담당자')
    special_note = models.CharField(max_length=256, verbose_name='주문 내용',null=True, blank=True)
    price = models.BigIntegerField(verbose_name='발주금액', null=True, blank=True, default=0)
    due_date = models.DateField(verbose_name='예상 요청일', blank=True,null=True)
    memo = models.TextField(verbose_name='메모', null=True, blank=True)
    status = models.CharField(max_length=32, choices=STATUS, default='WAIT', verbose_name='진행상태')
    start_dt = models.DateTimeField(blank=True, null=True, verbose_name="입고 시작 시간")
    end_dt = models.DateTimeField(blank=True, null=True, verbose_name="입고 종료 시간")
    cancel_memo = models.CharField(max_length=256, verbose_name='취소사유', null=True, blank=True)

    class Meta:
        db_table = 'material_purchase'
        verbose_name = '자재 발주'
        verbose_name_plural = '자재 발주 모음'

    @property
    def username(self):
        if self.account != None:
            return self.account.username

reversion.register(MaterialPurchase)

class MaterialPurchaseList(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    material_purchase = models.ForeignKey(MaterialPurchase, verbose_name='자재발주', on_delete=models.CASCADE)
    material = models.ForeignKey('material.Material', verbose_name='자재', on_delete=models.CASCADE)
    unit_price = models.BigIntegerField(verbose_name='단가', default=0, null=True, blank=True)
    unit = models.CharField(verbose_name='단위', null=True, blank=True, max_length=32)
    cnt = models.IntegerField(verbose_name='발주 수량', default=0, null=True, blank=True)
    price = models.BigIntegerField(verbose_name='금액', default=0, null=True, blank=True)
    memo = models.TextField(verbose_name='메모', null=True, blank=True)
    complt_cnt = models.IntegerField(verbose_name='입고 수량', default=0, null=True, blank=True)
    status = models.CharField(max_length=32, choices=STATUS, default='WAIT', verbose_name='진행상태')
    start_dt = models.DateTimeField(blank=True, null=True, verbose_name="입고 시작 시간")
    end_dt = models.DateTimeField(blank=True, null=True, verbose_name="입고 종료 시간")
    
    class Meta:
        db_table = 'material_purchase_list'
        verbose_name = '자재 발주 리스트'
        verbose_name_plural = '자재 발주 리스트 모음'

    @property
    def remain_cnt(self):
        return self.cnt - self.complt_cnt

class EnterRecord(models.Model):
    created_dt = models.DateTimeField(verbose_name='생성일', auto_now_add=True)
    updated_dt = models.DateTimeField(verbose_name='수정일', auto_now=True)
    material_purchase_list = models.ForeignKey(MaterialPurchaseList, verbose_name='자재발주리스트', on_delete=models.CASCADE)
    cnt = models.IntegerField(verbose_name='입고 수량', default=0, null=True, blank=True)

    class Meta:
        db_table = 'enter_record'
        verbose_name = '입고 기록'
        verbose_name_plural = '입고 기록 모음'