import os
import json
import qrcode
from django.shortcuts import render
from popbill import PopbillException, ContactInfo, CorpInfo, JoinForm, KakaoService, KakaoReceiver, KakaoButton
from datetime import datetime
from django.http import HttpResponse
from system.models import Account


# 링크아이디
LinkID = "DKINNOVATION"

# 발급받은 비밀키, 유출에 주의하시기 바랍니다.
SecretKey = "BzP6NeYrmM4dPdwx1hULql3bK6YlEC1cmTVOu2XdIIc="

# 연동환경 설정값, 개발용(True), 상업용(False)
IsTest = False

# 인증토큰 IP제한기능 사용여부, 권장(True)
IPRestrictOnOff = False

# settings.py 작성한 LinkID, SecretKey를 이용해 TaxinvoiceService 객체 생성
kakaoService = KakaoService(LinkID, SecretKey)

# 연동환경 설정값, 개발용(True), 상업용(False)
kakaoService.IsTest = IsTest

# 인증토큰 IP제한기능 사용여부, 권장(True)
kakaoService.IPRestrictOnOff = IPRestrictOnOff


def sendATS_one(request, pk):
    try:
        guest = Account.objects.get(pk=pk)
        print(guest.ph_num)
        print(guest.username)

        #read_file = './media/' + str(file_name)
        
        path = './media/guest/' + guest.username
        os.makedirs(path, exist_ok=True)

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=100,
            border=0,
        )
        qr.add_data(pk)
        qr.make(fit=True)
        
        img = qr.make_image()
        img.save(path + '/qrcode.jpg')

        # 팝빌회원 사업자번호
        CorpNum = "8994000333"

        # 팝빌회원 아이디
        UserID = "dkinno"

        # 알림톡 템플릿코드
        # 승인된 알림톡 템플릿 코드는 ListATStemplate API, GetATSTemplateMgtURL API, 혹은 팝빌사이트에서 확인이 가능합니다.
        templateCode = "022010000149"

        # 발신번호 (팝빌에 등록된 발신번호만 이용가능)
        snd = "01036954339"

        # 알림톡 내용 (최대 1000자)
        # 사전에 승인된 템플릿의 내용과 알림톡 전송내용(content)이 다를 경우 전송실패 처리됩니다.
        content = "안녕하세요.\n"
        content += str(guest.company.name) + " 방문객 등록이 완료되었습니다.\n"
        content += "유효기간은 " + datetime.now().strftime("%y%m%d") + " 입니다."

        altContent = "알림톡 대체 문자"

        # 대체문자 유형 [공백-미전송, C-알림톡내용, A-대체문자내용]
        altSendType = "A"

        # 예약전송시간, 작성형식:yyyyMMddHHmmss, 공백 기재시 즉시전송
        sndDT = ""

        # 수신번호
        receiver = '01088876675'

        # 수신자 이름
        receiverName = "partner"

        # 전송요청번호
        # 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
        # 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
        requestNum = ""

        # 알림톡 버튼정보를 템플릿 신청시 기재한 버튼정보와 동일하게 전송하는 경우 btns를 빈 배열로 처리.
        btns = []

        test = kakaoService.sendFMS(CorpNum, '@동광사우', snd, content, '', 'C', '', path + '/qrcode.jpg', "http://test.com", guest.ph_num, "YMKIM", btns, AdsYN=False, UserID=None, RequestNum=None)#:

        print(test)

        return HttpResponse(
            json.dumps({
                'result': 'success',
            }), content_type='application/json')
    except PopbillException as PE:
        print(PE)
        return HttpResponse(
            json.dumps({
                'result': 'fail',
                'message': PE.message,
        }), content_type='application/json')
