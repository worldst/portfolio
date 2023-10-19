// 데이터 검색
function searchData() {
    const status = $(".list-tab .tab.act").data("type");
    const search_type = $("[name='search-kinds']").val() || '';
    const keyword = $(".search-data").val() || '';

    $("[name='save_search_type']").val(search_type);
    $("[name='save_keyword']").val(keyword);
    $("[name='save_date_type']").val("");
    $("[name='save_search_start_dt']").val("");
    $("[name='save_search_end_dt']").val("");

    getResultData(1,status,'search');
}

// 조회된 리스트 노출
function getResultData(pageNum, status='', mode=null) {
    const search_type = $("[name='save_search_type']").val() || '';
    const keyword = $("[name='save_keyword']").val() || '';
    const date_type = $("[name='save_date_type']").val() || '';
    const search_start_dt = $("[name='save_search_start_dt']").val() || '';
    const search_end_dt = $("[name='save_search_end_dt']").val() || '';
    let obj;

    obj = {
        search_type : search_type,
        keyword : keyword,
        date_type : date_type,
        start_date : search_start_dt || '',
        end_date : search_end_dt || '',

        status : status,
        list_range : MAX_VIEW_COUNT,
        page : pageNum
    }
    
    $.ajax({
        async: false,
        url: '/report/api/jobs',
        data: obj,
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".load-screen").addClass('display-block');
        },
        success: function (data) {
            // console.log(data);
            const res = data.data_list;

            $(".total-info .total span").text(data.data_len);
            

            if(res.length == 0) {
                $("#list-table tbody").empty().append("<td colspan='8' class='no-data'>현재 등록된 데이터가 없습니다.</td>");

                if(mode === 'search') {
                    $("#list-table tbody").empty().append("<td colspan='8' class='no-data'>조회된 데이터가 없습니다.</td>");
                }
            } else { 
                setTimeout(() => {
                    let html = '';

                    $.each(res, function (key, value) {
                        html += `<tr data-id="${value.pk}">`;
                        html += `    <td><span class="num">${value.order_process__order__num }</span></td>`;
                        html += `    <td class="txt_left"><span class="company_name">${value.order_process__order__company_name  || '-'}</span></td>`;
                        html += `    <td class="txt_left"><span class="pjt_name">${value.order_process__order__pjt_name  || '-'}</span></td>`;
                        html += `    <td class="txt_left"><span class="equipment_name">${value.equipment_name || '-'}</span></td>`;
                        html += `    <td><span class="worker_name">${value.worker__name || '-'}</span></td>`;
                        html += `    <td><span class="start_dt">${value.start_dt}</span></td>`;
                        html += `    <td><span class="end_dt">${value.end_dt}</span></td>`;
                        html += `    <td><span class="job_dt">${value.job_dt}</span></td>`;
                        html += `</tr>`;
                    });

                    $("#list-table tbody").empty().html(html);
                }, 0);
            }

            if(mode === 'search') {
                drawPagination(data.data_len, MAX_VIEW_COUNT);
            }
        },        
        complete: function() {
            setTimeout(() => {
                handlingEmptyValue();
                $(".load-screen").removeClass('display-block');
            }, 150);
        },
        error: function (request, status, error) {
            console.log(`Code: ${request.status}, Message: ${request.responseText}, Error: ${error}`);
        }
    });

    setTimeout(() => {
        const data_count = $("#list-table tbody tr").length;
        let check_count = 0;

        // <tbody> 내 체크박스 체크 갯수 파악
        $("#list-table tbody tr").each(function() {
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

        // 전체선택 체크박스가 True 인 경우 False 로 초기화
        if($(".all_chk").prop('checked')) {
            $(".all_chk").prop('checked', false);
        }
    }, 0);
}

/* Filter */
function resetFilterData() {
    $("#filterSearchModal [name='status']#all").prop("checked", true);
    $("#filterSearchModal [name='date_type']#create").prop("checked", true);
    $("#filterSearchModal [name='start_date']").val("");
    $("#filterSearchModal [name='end_date']").val("");
    $("#filterSearchModal [name='search_type']").val("");
    $("#filterSearchModal [name='keyword']").val("");
}

function filterData() {
    const status = $("#filterSearchModal [name='status']:checked").data("status");
    const date_type = $("#filterSearchModal [name='date_type']:checked").data("date_type");
    const start_date = $("#filterSearchModal [name='start_date']").val();
    const end_date = $("#filterSearchModal [name='end_date']").val();
    const search_type = $("#filterSearchModal [name='search_type']").val();
    const keyword = $("#filterSearchModal [name='keyword']").val();

    /*
    if(start_date) {
        if(!end_date) {
            alert('종료일자를 설정해주세요.');
            return false;
        }
    }

    if(end_date) {
        if(!start_date) {
            alert('시작일자를 설정해주세요.');
            return false;
        }
    }
    */

    if(start_date && end_date) {
        if(start_date > end_date) {
            alert('검색할 날짜를 재설정해주세요.');
            return false;
        }
    }

    // 상태 값에 맞게 탭 전환
    $(".list-tab .tab").removeClass("act");
    $(".list-tab .tab").each(function() {
        if($(this).data("type") == status) {
            $(this).addClass("act");
        }
    });

    $("[name='save_search_type']").val(search_type);
    $("[name='save_keyword']").val(keyword);
    $("[name='save_date_type']").val(date_type);
    $("[name='save_search_start_dt']").val(start_date);
    $("[name='save_search_end_dt']").val(end_date);
    $("[name='search-kinds']").val("");
    $(".search-data").val("");

    getResultData(1,status,'search');

    $("#filterSearchModal").hide();
}


function exportExcel(){
    const search_type = $("[name='save_search_type']").val() || '';
    const keyword = $("[name='save_keyword']").val() || '';
    const date_type = $("[name='save_date_type']").val() || '';
    const search_start_dt = $("[name='save_search_start_dt']").val() || '';
    const search_end_dt = $("[name='save_search_end_dt']").val() || '';
    let obj;

    obj = {
        search_type : search_type,
        keyword : keyword,
        date_type : date_type,
        start_date : search_start_dt || '',
        end_date : search_end_dt || '',

        status : '',
    }
    
    $.ajax({
        async: false,
        url: '/report/api/job/excel/download',
        data: obj,
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".load-screen").addClass('display-block');
        },
        success: function (data) {
            var name = data.name;

            var a = document.createElement('a');
            a.href = '/report/media/report/' + name.toString() + ".xlsx";
            a.download = name.toString() + ".xlsx";
            a.click();
            $(".load-screen").removeClass('display-block');
        }
    });
}