const PAGES_PER_BLOCK = 2;  // 블록당 페이지 갯수 설정
const MAX_VIEW_COUNT = 7;   // 페이지당 리스트 갯수

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
});

// 조회된 리스트 노출
function getResultData(pageNum, mode) {
    const search_key = $("select[name='search-kinds']").val();
    const search_val = $("input.search-data").val();
    let data = {};
    if(search_key !== 'q') {
        data[search_key+'_like'] = search_val;
    } else {
        data[search_key] = search_val;
    }

    let startIdx = (pageNum * MAX_VIEW_COUNT) - MAX_VIEW_COUNT;
    let endIdx = pageNum * MAX_VIEW_COUNT;
    
    $.ajax({
        async: false,
        url: 'https://my-json-server.typicode.com/worldst/json-server/company',
        data: data,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $(".total-info .total span").text(data.length);

            if(data.length == 0) {
                $("tr.no-data").show();
                if(mode === 'search') {
                    $(".table tbody").empty();
                    $(".table tbody").append("<td colspan='8'>조회된 데이터가 없습니다.</td>");
                }
            } else { 
                setTimeout(() => {
                    let html = '';
                    $.each(data.reverse(), function (key, value) {
                        if(key >= startIdx && key < endIdx) {
                            html += `<tr>`;
                            html += `  <td><input type='checkbox' name='companyCheck' value='${value.id}'></td>`;
                            html += `  <td class="txt_left"><a href="view">${value.title}</a></td>`;
                            html += `  <td class="txt_left">${value.address}</td>`;
                            html += `  <td>${value.tel || '-'}</td>`;
                            html += `  <td>${value.uptae || '-'}</td>`;
                            html += `  <td class="txt_left">${value.jong || '-'}</td>`;
                            html += `  <td class="txt_left">${value.email || '-'}</td>`;
                            html += `  <td class="txt_left">${value.memo || '-'}</td>`;
                            html += `</tr>`;  
                        }
                    });
                    $(".table tbody").html(html);    
                }, 100);
            }
            if(mode === 'search') {
                drawPagination(data.length, MAX_VIEW_COUNT);
            }
        },
        beforeSend: function() {
            $(".load-screen").addClass('display-block');
        },
        complete: function() {
            setTimeout(() => {
                handlingEmptyValue();
                $(".load-screen").removeClass('display-block');
            }, 100);
        },
        error: function (request, status, error) {
            $("tr.no-data").show();
            console.log(`Code: ${request.status}, Message: ${request.responseText}, Error: ${error}`);
        }
    });

    setTimeout(() => {
        const data_count = $(".table tbody tr").length;
        let check_count = 0;

        // <tbody> 내 체크박스 체크 갯수 파악
        $(".table tbody tr").each(function() {
            $(this).find(":checkbox").change(function() {
                if(!$(this).prop('checked')) {
                    check_count--;
                    $(".all_chk").prop('checked', false);
                } else {
                    check_count++;

                    // 모두 체크 한 경우 [전체선택] 자동 체크
                    if(check_count == data_count) {
                        $(".all_chk").prop('checked', true);
                    }
                }
            });
        });
    }, 100);
}

