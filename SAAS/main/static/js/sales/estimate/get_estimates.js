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
        url: '/sales/api/estimates',
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
                        html += `    <td><input type="checkbox" name="rowCheck" value="${value.pk}"></td>`;
                        html += `    <td><a href="/sales/estimate/${value.pk}/detail">${value.num}</a></td>`;
                        html += `    <td>${value.created_dt}</td>`;
                        html += `    <td class="txt_left">${value.pjt_name}</td>`;
                        html += `    <td class="txt_left">${value.company_name}</td>`;
                        html += `    <td>${value.account__username || '-'}</td>`;
                        html += `    <td class="txt_left">${value.memo || '-'}</td>`;

                        if(value.status == 'WAIT') {
                            html += `    <td><span class="status wait">견적대기</span></td>`;                    
                        } else if(value.status == 'CANCEL') {
                            html += `    <td><span class="status cancel">견적취소</span></td>`;
                        } else if(value.status == 'COMPLT') {
                            html += `    <td><span class="status complt">견적확정</span></td>`;
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

// 데이터 취소
function cancelModalOpen(self) {
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
        alert('취소 처리할 데이터를 선택해주세요.');
    } else {
        // 리스트 내 1개 이상 체크 되어있는 경우
        $(".common-modal.cancel [name='ids']").val(ids);
        $(".common-modal.cancel").css('display','flex');
    }
}

function cancelData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const ids = ($(".common-modal.cancel [name='ids']").val()).split(",");
    const data_list = [];
    let obj;

    ids.forEach(function(v, i) {
        data_list.push({
            id : v
        })
    });

    obj = {
        status : 'CANCEL',
        data_list : data_list
    }

    // console.log(obj);

    $.ajax({
        url: `/sales/api/estimate/status/change/`,
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
            if(data.result == 'fail') {
                $(".load_bg").removeClass('load_display');
                alert("이미 수주가 완료되었거나\n출하가 진행중인 데이터가 포함되어있습니다.\n\n다시 선택해주세요.");
                $("#cancelModal").hide();

            } else {
                alert("취소처리되었습니다.");
                location.reload();
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 데이터 확정
function compltModalOpen(self) {
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
        alert('확정 처리할 데이터를 선택해주세요.');
    } else {
        // 리스트 내 1개 이상 체크 되어있는 경우
        $(".common-modal.complt [name='ids']").val(ids);
        $(".common-modal.complt").css('display','flex');
    }
}

function compltData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const ids = ($(".common-modal.complt [name='ids']").val()).split(",");
    const data_list = [];
    let obj;

    ids.forEach(function(v, i) {
        data_list.push({
            id : v
        })
    });

    obj = {
        status : 'COMPLT',
        data_list : data_list
    }

    // console.log(obj);

    $.ajax({
        url: `/sales/api/estimate/status/change/`,
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
            if(data.result == 'fail') {
                $(".load_bg").removeClass('load_display');
                alert("이미 수주가 완료되었거나\n출하가 진행중인 데이터가 포함되어있습니다.\n\n다시 선택해주세요.");
                $("#cancelModal").hide();

            } else {
                alert("확정처리되었습니다.");
                location.reload();
            }
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
        url: '/sales/api/estimate/excel/download',
        data: obj,
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".load-screen").addClass('display-block');
        },
        success: function (data) {
            var name = data.name;

            var a = document.createElement('a');
            a.href = '/sales/media/sales/estimate/' + name.toString() + ".xlsx";
            a.download = name.toString() + ".xlsx";
            a.click();
            $(".load-screen").removeClass('display-block');
        }
    });
}