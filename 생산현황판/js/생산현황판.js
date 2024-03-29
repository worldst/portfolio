$(function() {
    const response = [
        {
            "order_num" : "C-070510-102211",
            "pjt_name" : "춘천 센트럴타워 푸르지오",
            "num" : "178353L19",
            "type" : "HSVF",
            "due_dt" : "2021-10-10",
            "status" : "대기",
            "process" : {
                "process1" : "대기",
                "process2" : "대기",
                "process3" : "대기",
                "process4" : "대기",
                "process5" : "대기"
            }
        },
        {
            "order_num" : "C-120020-101010",
            "pjt_name" : "춘천 센트럴타워 푸르지오",
            "num" : "178353L19",
            "type" : "HSVF",
            "due_dt" : "2021-10-10",
            "status" : "진행중",
            "process" : {
                "process1" : "완료",
                "process2" : "완료",
                "process3" : "완료",
                "process4" : "진행중",
                "process5" : "대기"
            }
        },
        {
            "order_num" : "C-210813-234123",
            "pjt_name" : "광교 더샵 레이크시티",
            "num" : "184944L27",
            "type" : "WBSS",
            "due_dt" : "2021-09-23",
            "status" : "완료",
            "process" : {
                "process1" : "완료",
                "process2" : "완료",
                "process3" : "완료",
                "process4" : "완료",
                "process5" : "완료"
            }
        },
        {
            "order_num" : "C-210813-234123",
            "pjt_name" : "광교 더샵 레이크시티",
            "num" : "184944L27",
            "type" : "WBSS",
            "due_dt" : "2021-09-23",
            "status" : "정지",
            "process" : {
                "process1" : "완료",
                "process2" : "완료",
                "process3" : "정지",
                "process4" : "대기",
                "process5" : "대기"
            }
        },
        {
            "order_num" : "C-210813-234123",
            "pjt_name" : "광교 더샵 레이크시티",
            "num" : "184944L27",
            "type" : "WBSS",
            "due_dt" : "2021-09-23",
            "status" : "완료",
            "process" : {
                "process1" : "완료",
                "process2" : "완료",
                "process3" : "완료",
                "process4" : "완료",
                "process5" : "완료"
            }
        },
        {
            "order_num" : "C-070510-102211",
            "pjt_name" : "춘천 센트럴타워 푸르지오",
            "num" : "178353L19",
            "type" : "HSVF",
            "due_dt" : "2021-10-10",
            "status" : "진행중",
            "process" : {
                "process1" : "진행중",
                "process2" : "완료",
                "process3" : "완료",
                "process4" : "완료",
                "process5" : "진행중"
            }
        },
        {
            "order_num" : "C-120020-101010",
            "pjt_name" : "춘천 센트럴타워 푸르지오",
            "num" : "178353L19",
            "type" : "HSVF",
            "due_dt" : "2021-10-10",
            "status" : "진행중",
            "process" : {
                "process1" : "완료",
                "process2" : "진행중",
                "process3" : "진행중",
                "process4" : "대기",
                "process5" : "대기"
            }
        },
        {
            "order_num" : "C-070510-102211",
            "pjt_name" : "춘천 센트럴타워 푸르지오",
            "num" : "178353L19",
            "type" : "HSVF",
            "due_dt" : "2021-10-10",
            "status" : "대기",
            "process" : {
                "process1" : "대기",
                "process2" : "대기",
                "process3" : "대기",
                "process4" : "대기",
                "process5" : "대기"
            }
        }
    ]

    let html = '';

    for(data of response) {
        html += `<div class="box">`;
        html += `   <div class="order_num">`;
        html += `       <div class="left">${data.order_num}</div>`;
        html += `       <div class="right">`;
        html += `           <span class="status">${data.status}</span>`;
        html += `       </div>`;
        html += `   </div>`;
        html += `   <div class="inner">`;
        html += `       <div class="tooltip">`
        html += `           <table class="process_list">`
        html += `               <tr>`
        html += `                   <th>레이저</th>`
        html += `                   <th>절곡</th>`
        html += `                   <th>열처리</th>`
        html += `                   <th>조립</th>`
        html += `                   <th>포장</th>`
        html += `               </tr>`
        html += `               <tr>`
        html += `                   <td>${data.process.process1}</td>`
        html += `                   <td>${data.process.process2}</td>`
        html += `                   <td>${data.process.process3}</td>`
        html += `                   <td>${data.process.process4}</td>`
        html += `                   <td>${data.process.process5}</td>`
        html += `               </tr>`
        html += `           </table>`
        html += `       </div>`
        html += `       <div class="order_detail">`;
        html += `           <div class="title">현장명</div>`;
        html += `           <div class="info">${data.pjt_name}</div>`;
        html += `       </div>`;
        html += `       <div class="order_detail">`;
        html += `           <div class="title">호기번호</div>`;
        html += `           <div class="info">${data.num}</div>`;
        html += `       </div>`;
        html += `       <div class="order_detail">`;
        html += `           <div class="title">기종</div>`;
        html += `           <div class="info">${data.type}</div>`;
        html += `       </div>`;
        html += `       <div class="order_detail">`;
        html += `           <div class="title">납품일</div>`;
        html += `           <div class="info">${data.due_dt}</div>`;
        html += `       </div>`;
        html += `   </div>`;
        html += `</div>`;
    }

    $(".body").append(html);

    $(".box").each(function() {
        const $status = $(this).find(".status");
        const $process_list = $(this).find(".process_list");

        if($status.text().indexOf("대기") > -1) {
            $status.addClass("wait");
        } else if($status.text().indexOf("진행") > -1) {
            $status.addClass("start");
            $status.before("<img src='img/gear.gif' alt='진행중' class='load_gif'>");
            $status.closest(".box").css("border","1px solid #d4405b");
        } else if($status.text().indexOf("정지") > -1) {
            $status.addClass("stop");
        } else if($status.text().indexOf("완료") > -1) {
            $status.addClass("end");
        }

        $process_list.find("td").each(function(idx) {
            if($(this).text().indexOf("대기") > -1) {
                $(this).css("color","#777777");
            } else if($(this).text().indexOf("진행") > -1) {
                $(this).css("color","#d4405b");
                
                if($(this).closest("table").find("th").eq(idx).text() == '레이저') {
                    $(this).html("<img src='img/work1.gif' alt='진행중' class='load_gif'>");
                }
                if($(this).closest("table").find("th").eq(idx).text() == '절곡') {
                    $(this).html("<img src='img/work2.gif' alt='진행중' class='load_gif'>");
                }
                if($(this).closest("table").find("th").eq(idx).text() == '열처리') {
                    $(this).html("<img src='img/work3.gif' alt='진행중' class='load_gif'>");
                }
                if($(this).closest("table").find("th").eq(idx).text() == '조립') {
                    $(this).html("<img src='img/work4.gif' alt='진행중' class='load_gif'>");
                }
                if($(this).closest("table").find("th").eq(idx).text() == '포장') {
                    $(this).html("<img src='img/work5.gif' alt='진행중' class='load_gif'>");
                }
            } else if($(this).text().indexOf("정지") > -1) {
                $(this).css("color","#c3b134");
            } else if($(this).text().indexOf("완료") > -1) {
                $(this).css("color","#34c388");
            }
        });
    });

    $(".status").mouseover(function() {
        $(this).closest(".box").find(".tooltip").css({
            "z-index" : "999",
            "opacity" : "1"
        });
    }).mouseout(function() {
        $(this).closest(".box").find(".tooltip").css({
            "z-index" : "-1",
            "opacity" : "0"
        });
    });

});