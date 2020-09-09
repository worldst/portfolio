$(function () {
    /* 필수 항목 값 입력 시 에러메세지 숨김 */
    $(".data-input, .data-select").on('change keyup', function() {
        if($(this).val().length > 0) {
            $(this).next().hide();
        }
    });
});


/* 데이터 조회 후 리스트 출력 시 빈 값 정렬 처리 */
function handlingEmptyValue() {
    $(".table tbody tr td").each(function() {
        const $td = $(this);

        if($td.text() == "-") {
            $td.removeClass();
        }
    });
}