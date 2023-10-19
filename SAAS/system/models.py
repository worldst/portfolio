from django.db import models
from django.contrib.auth.models import AbstractUser
from common.choices.system import USER_TYPE
class Account(AbstractUser):
    name = models.CharField(max_length=32, verbose_name='이름') 
    introducing_company = models.ForeignKey('base.IntroducingCompany', verbose_name='도입업체', on_delete=models.CASCADE, null=True)
    
    #ph_num = models.CharField(max_length=100, verbose_name='휴대폰 번호')
    type = models.CharField(max_length=256, default='DK', choices=USER_TYPE, verbose_name='유형')
    process = models.ForeignKey('base.Code', verbose_name='공정', on_delete=models.SET_NULL, null=True, blank=True)
    equipment = models.ForeignKey('base.Equipment', verbose_name='설비', on_delete=models.SET_NULL, null=True, blank=True, related_name='account_equipment')
    memo = models.TextField(verbose_name='메모',null=True, blank=True)

    email = models.CharField(max_length=128, verbose_name='이메일',null=True,blank=True)
    phone_number = models.CharField(max_length=64, verbose_name='연락처', null=True, blank=True)
    is_delete = models.BooleanField(verbose_name='삭제여부', default=False)
    #is_meal_auth = models.BooleanField(default=False)

    class Meta:
        db_table = 'account'
        verbose_name = '사용자'
