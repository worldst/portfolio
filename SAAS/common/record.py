from datetime import datetime, timedelta
"""
from material.models import MaterialUsageRecord
from shipment.models import ShipmentRecord


def matl_record(matl, job, log, cnt):
    MaterialUsageRecord.objects.create(
        matl=matl,
        instruction_job=job,
        log=log,
        cnt=cnt        
    )


def matl_shipment_record(matl, shipment, log, cnt):
    MaterialUsageRecord.objects.create(
        matl=matl,
        shipment=shipment,
        log=log,
        cnt=cnt        
    )


def shipment_record(order, cnt):
    obj = ShipmentRecord.objects.create(
        order=order,
        created_dt=datetime.now(),
        cnt=cnt
    )
    return obj
"""