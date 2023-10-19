$(function() {
    const CELL_WIDTH = 40;
    let min_date;

    // 캘린더 최소값 정의
    $(".g_calendar .bar").each(function() {
        const start = $(this).data("start");

        if(!min_date) {
            min_date = start;
        }

        if(moment(start).diff(min_date,'days') < 0) {
            min_date = start;
        }
    });

    $(".fullYear .year").text(min_date.split("-")[0]);
    $(".fullYear .month").text(min_date.split("-")[1]);

    // 캘린더 최대값 정의 및 (최소 ~ 최대 날짜 셋팅)
    const MIN_DATE = min_date;
    const MAX_DATE = moment(MIN_DATE).add(6,'month').format("YYYY-MM-DD");
    const dates = [];
    let new_min_date = MIN_DATE;

    while(moment(new_min_date).diff(MAX_DATE,'days') < 0) {
        dates.push(moment(new_min_date).format("YYYY-MM-DD"));
        new_min_date = moment(new_min_date).add(1,'days');
    }

    dates.forEach(function(v, i) {
        const year = v.split("-")[0];
        const month = v.split("-")[1];
        let day = v.split("-")[2];

        if(day < 10) { // '0' 제거
            day = day.slice(1,2);
        }

        let date = `<div class="cell date" data-year="${year}" data-month="${month}">${day}</div>`;

        $('.row.day').append(date);
    });

    // 캘린더 내부 각 날짜 데이터 설정
    $(".g_calendar .bar").each(function() {
        const start = $(this).data("start");
        const end = $(this).data("end");
        
        $(this).css("width", (moment(end).diff(start,'days') + 1) * CELL_WIDTH);
        $(this).css("left", moment(start).diff(MIN_DATE,'days') * CELL_WIDTH);
    });

    // 스크롤 시 캘린더 최상단 날짜 변경
    $(".g_body").scroll(function() {
        const day = parseInt($(this).scrollLeft() / CELL_WIDTH);
        let year = $('.row.day').find(".date").eq(day).data("year");
        let month = $('.row.day').find(".date").eq(day).data("month");

        $(".fullYear .year").text(year);
        $(".fullYear .month").text(month);

        if($(this).scrollLeft() > 0) {
            $(".workList").css("box-shadow","3px 0px 10px #dddddd");
        } else {
            $(".workList").css("box-shadow","none");
        }
    });
});