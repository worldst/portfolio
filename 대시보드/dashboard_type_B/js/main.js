
const ALL_ORDER_NUM = 500; // 총 주문수량 기준값
const ALL_PROGRESS_NUM = 200; // 총 처리수량 기준값
const HIDDEN_NUM = 50; // 디폴트 값
const MAX_COUNT = 10; // 클릭카운트 최대값

$(function() {
  
    /* 기간 클릭 시 액션 */
    $(".date-select-box .date").click(function () {
      $(".date-select-box .date").removeClass('act');
      $(this).addClass('act');
    });

    /* 세이프티 발주점검 그래프 수치 */
    $(".safety .inner-table tr").each(function() {
        
        /* 총 수량 적용 */
        $(".allOrderNum").text(ALL_ORDER_NUM);
        $(".allProgressNum").text(ALL_PROGRESS_NUM);

        /* 디폴트 값 배수 적용 */
        $(".hiddenNum_1").text(HIDDEN_NUM);
        $(".hiddenNum_2").text(HIDDEN_NUM * 2);
        $(".hiddenNum_3").text(HIDDEN_NUM * 3);
        $(".hiddenNum_4").text(HIDDEN_NUM * 4);
        $(".hiddenNum_5").text(HIDDEN_NUM * 5);

        var order = $(this).find('p.order'); // 주문수량 비율 위치
        var progress = $(this).find('p.progress'); // 처리수량 비율 위치

        var orderNum = Number($(this).find('span.orderNum').text()); // 주문수량
        var progressNum = Number($(this).find('span.progressNum').text()); // 처리수량
        
        var orderRate = Math.round(Number((orderNum / ALL_ORDER_NUM)) * 100) // 주문수량 비율 반올림 계산
        var progressRate = Math.round(Number((progressNum / ALL_PROGRESS_NUM)) * 100) // 처리수량 비율 반올림 계산

        order.animate({
            "width" : orderRate + '%'
        },1700); // 주문수량 비율 적용
        progress.animate({
            "width" : progressRate + '%'
        },1700); // 처리수량 비율 적용

        /* 주문&처리 MAX 적용 */
        $(this).find('.graphBtn').click(function(e) {
          e.stopPropagation();
          for(i=0; i<MAX_COUNT; i++) {
            $(this).parent().click();
          }
        });
    });

    /* 카운트 업 애니메이션 */
    $(".graphNum").counterUp({
        delay : 10,
        time : 1300
    });

    $(".input-box input").on("keyup", function() {
      $(this).val(addCommas($(this).val().replace(/[^0-9]/g,"")));
    });

});

/* 3자리 단위마다 콤마 생성 */
function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* 콤마 제거 */
function removeComma(str) {
  n = parseInt(str.toString().replace(/,/g,""));
  return n;
}

/* 그래프 수치 합 계산 */
function addNum(obj, num) {
    var count = Number($('#' + obj + 'Count_' + num).text());
    var totalNum = removeComma($("input#" + obj + "TotalNum").val());
    var currentNum = Number($('#' + obj + 'Hidden_' + num).text());

    if (count < MAX_COUNT) {
      count++;
      $('#' + obj + 'Count_' + num).text(count);

      totalNum += currentNum;

      var totalAddComma = addCommas(totalNum);
      if(totalNum >= 10000) {
          return;
      }
      else {
          $("input#" + obj + "TotalNum").val(totalAddComma);
      }      
    }  
    else {
      return;
    }
}

/* 현재 시간 출력 */
function showTimer() {
    var currentDate = new Date();
    
    var hours = currentDate.getHours(); // 시
    var min = currentDate.getMinutes(); // 분
    var sec = currentDate.getSeconds(); // 초
    
    if(hours < 10) {
      hours = "0" + hours;
    }
    if(min < 10) {
      min = "0" + min;
    }
    if(sec < 10) {
      sec = "0" + sec;
    }
    if(sec >= 30) {
      $(".circle-btn-wrap .circle-btn-box .disabled").css("z-index","-1");
    }
    else {
      $(".circle-btn-wrap .circle-btn-box .disabled").css("z-index","1");
    }

    $("#currentHour").text(hours);
    $("#currentMin").text(min);
    $("#currentSec").text(sec);

    setTimeout(showTimer, 1000);
  }