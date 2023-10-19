const PAGES_PER_BLOCK = 5;  // 블록당 페이지 갯수 설정
let MAX_VIEW_COUNT = 20;   // 페이지당 리스트 갯수

/* Pagination Variable */
let current_block_count = 0;    // 현재 블록 번지 수
let next_start_page;            // [다음] 이후 시작 번호
let prev_end_page;              // [다음] 이전 마지막 번호
let prev_start_page;            // [이전] 이후 시작 번호
let next_end_page;              // [이전] 이후 마지막 번호
let remain_page_count;          // 남은 페이지 수
let total_page_count;           // 총 페이지 수


$(function() {
    getResultData(1);
    
    const dataTotalCount = $(".total-info .total span").text();
    drawPagination(dataTotalCount, MAX_VIEW_COUNT);

    // [이전] 버튼 이벤트 처리
    $(".pagination .prev").on("click", function() {
        const status = $(".list-tab .tab.act").data("type");
        // 기존 페이지 번호 지우기
        $(".page").empty();

        current_block_count--; 
        remain_page_count = total_page_count - (current_block_count * PAGES_PER_BLOCK);
        prev_start_page = (current_block_count * PAGES_PER_BLOCK) + 1;
        // next_end_page = (prev_start_page + PAGES_PER_BLOCK) - 1;

        // 해당 블록 페이지 새로 그리기
        for(let i=prev_start_page; i<=total_page_count; i++) {
            $(".page").append(`<li data-page='${i}'>${i}</li>`);
        }
        
        // 나머지 페이지 수가 블록당 페이지 수를 넘을 경우
        if(remain_page_count > PAGES_PER_BLOCK) {
            $(".page li").slice(PAGES_PER_BLOCK).remove();
            $(".pagination .next").css("display","flex");
        }

        // 두번째 블록부터는 [이전] 버튼 활성화
        if(current_block_count > 0) {
            $(".pagination .prev").css("display","flex");
        } else {
            $(".pagination .prev").css("display","none");
        }

        $(".page li:first-child").addClass('on');
        getResultData(prev_start_page,status);
        prev_end_page = $(".page li:last-child").data('page');

        movePage();
    });

    // [다음] 버튼 이벤트 처리
    $(".pagination .next").on("click", function() {
        const status = $(".list-tab .tab.act").data("type");
        // 기존 페이지 번호 지우기
        $(".page").empty();

        current_block_count++; 
        next_start_page = prev_end_page + 1;
        remain_page_count = total_page_count - (current_block_count * PAGES_PER_BLOCK);
        
        // 해당 블록 페이지 새로 그리기
        for(let i=next_start_page; i<=total_page_count; i++) {
            $(".page").append(`<li data-page='${i}'>${i}</li>`);
        }
        
        // 나머지 페이지 수가 블록당 페이지 수를 넘을 경우
        if(remain_page_count > PAGES_PER_BLOCK) {
            $(".page li").slice(PAGES_PER_BLOCK).remove();
            $(".pagination .next").css("display","flex");
        } else {
            $(".pagination .next").css("display","none");
        }

        // 두번째 블록부터는 [이전] 버튼 활성화
        if(current_block_count > 0) {
            $(".pagination .prev").css("display","flex");
        }

        $(".page li:first-child").addClass('on');
        getResultData(next_start_page,status);
        prev_end_page = $(".page li:last-child").data('page');
        
        movePage();
    });
});

function drawPagination(dataTotalCount, MAX_VIEW_COUNT) {
    // 누적 되있던 블록 값 초기화
    current_block_count = 0;

    // 기존 페이지 번호 지우기
    $(".page").empty();
    
    // dataTotalCount : 현재 등록되어 있는 모든 데이터 갯수
    total_page_count = Math.ceil(dataTotalCount / MAX_VIEW_COUNT);

    // 해당 블록 페이지 새로 그리기
    if(total_page_count == 0) {
        $(".page").append(`<li data-page='1'>1</li>`);

    } else {
        for(let i=1; i<=total_page_count; i++) {
            $(".page").append(`<li data-page='${i}'>${i}</li>`);
        }
    }

    // 로드 시 첫번째 페이지 활성화
    $(".page li:first-child").addClass('on');

    // 총 페이지 수가 블록 단위 페이지 수보다 많은 경우
    if(total_page_count > PAGES_PER_BLOCK) {
        // 블록 단위 페이지 수 외 나머지 제거
        $(".page li").slice(PAGES_PER_BLOCK).remove();
        // 다음으로 가는 버튼 생성
        $(".pagination .prev").css("display","none");
        $(".pagination .next").css("display","flex");
    } else {
        $(".pagination .prev").css("display","none");
        $(".pagination .next").css("display","none");
    }

    prev_end_page = $(".page li:last-child").data('page');

    movePage();
}
