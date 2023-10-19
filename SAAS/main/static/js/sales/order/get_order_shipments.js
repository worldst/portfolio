$(function() {
    // 출고 담당자 셋팅
    const user_id = $("[name='user_id']").val();
    $("#createModal [name='account']").val(user_id).trigger("change");
});

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

        shipment_status : status,
        list_range : MAX_VIEW_COUNT,
        page : pageNum
    }
    
    $.ajax({
        async: false,
        url: '/sales/api/order/shipments/',
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
                        const is_export = value.is_export ? '<div class="is_checked"><i class="fa-solid fa-check"></i></div>' : '-';
                        const is_img = value.img_count > 0 ? '<div class="is_checked"><i class="fa-solid fa-check"></i></div>' : '-';
                        
                        html += `<tr data-id="${value.pk}">`;
                        html += `    <td><input type="checkbox" name="rowCheck" value="${value.pk}"></td>`;
                        html += `    <td><a href="/sales/order/shipment/${value.pk}/detail">${value.num}</a></td>`;
                        html += `    <td>${is_export}</td>`;
                        html += `    <td>${is_img}</td>`;
                        html += `    <td>${value.due_date || '-'}</td>`;
                        html += `    <td class="txt_left">${value.pjt_name}</td>`;
                        html += `    <td class="txt_left">${value.company_name}</td>`;
                        html += `    <td>${value.account__username || '-'}</td>`;
                        html += `    <td class="txt_left">${value.memo || '-'}</td>`;

                        if(value.shipment_status == 'WAIT') {
                            html += `    <td><span class="status wait">출하대기</span></td>`;                    
                        } else if(value.shipment_status == 'START') {
                            html += `    <td><span class="status part">부분출하</span></td>`;
                        } else if(value.shipment_status == 'COMPLT') {
                            html += `    <td><span class="status complt">출하완료</span></td>`;
                        }

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

// 데이터 삭제
function delModalOpen(self) {
    const $table = $(self).closest(".content__inner").find("#list-table");
    const ids = [];
    let checked_count = 0;

    // 체크된 개수 파악
    $table.find("tbody tr").each(function() {
        const $chk = $(this).find("[name='rowCheck']");
        const id = $chk.val();

        if($chk.prop('checked')) {
            ids.push(id);
            checked_count++;
        }
    });
    
    if(checked_count == 0) {
        alert('삭제할 데이터를 선택해주세요.');
    } else {
        // 리스트 내 1개 이상 체크 되어있는 경우
        $(".common-modal.delete [name='ids']").val(ids);
        $(".common-modal.delete").css('display','flex');
    }
}

function deleteData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const ids = ($(".common-modal.delete [name='ids']").val()).split(",");
    const data_list = [];
    let obj;

    ids.forEach(function(v, i) {
        data_list.push({
            id : v
        })
    });

    obj = {
        data_list : data_list
    }

    // console.log(obj);

    $.ajax({
        url: `/sales/api/estimate/del/`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        success:function(data) {
            if(data.result == 'fail') {
                $(".load_bg").removeClass('load_display');
                alert("이미 수주가 완료되었거나\n출하가 진행중인 데이터가 포함되어있습니다.\n\n다시 선택해주세요.");
                $("#delModal").hide();

            } else {
                alert("삭제처리되었습니다.");
                location.reload();
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 부분 출하 & 전체 출하
function createModalOpen(self,status) {
    const title = status == 'START' ? '부분 출하 지시' : '전체 출하 지시';
    const bg_color = status == 'START' ? '#e12ab1' : '#2a8de1';
    const $table = $(self).closest(".content__inner").find("#list-table");
    const ids = [];
    let checked_count = 0;

    // 체크된 개수 파악
    $table.find("tbody tr").each(function() {
        const $chk = $(this).find("[name='rowCheck']");
        const id = $chk.val();

        if($chk.prop('checked')) {
            ids.push(id);        
            checked_count++;
        }
    });
    
    if(checked_count == 0) {
        alert('출하할 데이터를 선택해주세요.');
    } else {
        // 리스트 내 1개 이상 체크 되어있는 경우
        $("#createModal [name='ids']").val(ids);
        $("#createModal [name='status']").val(status);
        $("#createModal .edit-modal__title .title").text(title);
        $("#createModal .edit-modal__title").css('background-color',`${bg_color}`);
        $("#createModal .modalBtn--create").css('background-color',`${bg_color}`);
        $("#createModal").css('display','flex');
    }
}

function createData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const ids = ($("#createModal [name='ids']").val()).split(",");
    const status = $("#createModal [name='status']").val();
    const data_list = [];
    let shipment_data;
    let obj;

    const account_id = $("#createModal [name='account']").val();
    const method = $("#createModal [name='method']").val();
    const memo = $("#createModal [name='memo']").val();
    const name = $("#createModal [name='name']").val();
    const phone_number = $("#createModal [name='phone_number']").val();
    const car_number = $("#createModal [name='car_number']").val();

    /* 필수항목 유효성 검사 */
    const required = ['account'];
    
    for(let i=0; i<required.length; i++) {
        if(!$("#createModal").find(`[name='${required[i]}']`).val()) {
            if(required[i] == 'account') {
                alert("출고담당자를 선택해주세요.");
            }

            $("#createModal").find(`[name='${required[i]}']`).focus();

            return;
        }
    }
    
    ids.forEach(function(v, i) {
        data_list.push({
            id : v
        })
    });

    shipment_data = {
        shipment_status : status,
        account_id : account_id,
        method : method,
        memo : memo,
        name : name,
        phone_number : phone_number,
        car_number : car_number,
    }

    obj = {        
        data_list : data_list,
        shipment_data : shipment_data,
    }

    console.log(obj);
    
    $.ajax({
        url: `/sales/api/order/shipments/status/change`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                // $(".load_bg").addClass('load_display');
            }
        },
        success:function(data) {
            alert("처리되었습니다.");
            location.reload();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

/* Filter */
function resetFilterData() {
    $("#filterSearchModal [name='status']#all").prop("checked", true);
    $("#filterSearchModal [name='date_type']#created_dt").prop("checked", true);
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
        url: '/sales/api/order/shipment/excel/download',
        data: obj,
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".load-screen").addClass('display-block');
        },
        success: function (data) {
            var name = data.name;

            var a = document.createElement('a');
            a.href = '/sales/media/sales/shipment/' + name.toString() + ".xlsx";
            a.download = name.toString() + ".xlsx";
            a.click();
            $(".load-screen").removeClass('display-block');
        }
    });
}