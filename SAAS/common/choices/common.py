'''
    STATUS와 같이 공통적으로 사용 되는 항목을 정의
'''
STATUS = (
    ('WAIT', '대기'),
    ('START', '시작'),
    ('CANCEL', '취소'),
    ('PAUSE', '일시정지'),
    ('PART', '부분완료'),
    ('COMPLT', '완료')
)

TYPE = (
    ('production', '생산'),
    ('purchase', '구매'),
    ('outsourcing', '외주')
)