$(function() {
    // 설비 등록 영업 담당자 셋팅
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

        status : status,
        list_range : MAX_VIEW_COUNT,
        page : pageNum
    }
    
    $.ajax({
        async: false,
        url: '/base/api/equipments',
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
                $("#list-table tbody").empty().append("<td colspan='6' class='no-data'>현재 등록된 데이터가 없습니다.</td>");

                if(mode === 'search') {
                    $("#list-table tbody").empty().append("<td colspan='6' class='no-data'>조회된 데이터가 없습니다.</td>");
                }
            } else { 
                setTimeout(() => {
                    let html = '';

                    $.each(res, function (key, value) {
                        html += `<tr data-id="${value.pk}" data-process="${value.process}" data-account="${value.account__id}">`;
                        html += `    <td><input type="checkbox" name="rowCheck" value="${value.pk}"></td>`;
                        html += `    <td class="txt_left"><span class="name">${value.name}</span></td>`;
                        html += `    <td class="txt_left">`;
                        html += `        <div class="process_box flex">`;
                        (value.process_name).split(",").forEach(function(v, i) {
                            html += `        <span class="process">${v}</span>`;
                        });
                        html += `        </div>`;
                        html += `    </td>`;
                        html += `    <td><span class="account">${value.account__username}</span></td>`;
                        html += `    <td class="txt_left"><span class="memo">${value.memo || '-'}</span></td>`;
                        html += `    <td><span class="tdBtn update" onclick="updateModalOpen(this);">수정</span></td>`;
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
        $("#delModal [name='ids']").val(ids);
        $("#delModal").css('display','flex');
    }
}

function deleteData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const ids = ($("#delModal [name='ids']").val()).split(",");
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
        url: `/base/api/equipment/del/`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        success:function(data) {
            alert("삭제처리되었습니다.");
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

// 데이터 등록
function createModalOpen() {
    $("#createModal").css('display','flex');
}

function createData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    let obj;

    const name = $("#createModal [name='name']").val();
    const account_id = $("#createModal [name='account']").val();
    const memo = $("#createModal [name='memo']").val();
    const process = [];

    /* 필수항목 유효성 검사 */
    const required = ['name','account'];
    
    for(let i=0; i<required.length; i++) {
        if(!$("#createModal").find(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("설비명을 입력해주세요.");
            } else if(required[i] == 'account') {
                alert("설비담당자를 선택해주세요.");
            }

            $("#createModal").find(`[name='${required[i]}']`).focus();

            return;
        }
    }

    $("#createModal .selected_wrap .selected_box").each(function() {
        const $chk = $(this).find("[name='process']");
        const process_id = $chk.val();

        if($chk.prop("checked")) {
            process.push(process_id);
        }
    });

    if(process.length == 0) {
        alert("적어도 하나의 공정을 선택해주세요.");
        return false;
    }

    obj = {
        name : name,
        account_id : account_id,
        memo : memo,
        process : process
    }

    // console.log(obj);
    
    $.ajax({
        url: `/base/api/equipment/create/`,
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
                alert("중복된 설비명이 존재합니다.");
                return false;

            } else {
                alert("등록되었습니다.");
                location.reload();
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 데이터 수정
function updateModalOpen(self) {
    const $tr = $(self).closest("tr");
    const pk = $tr.data("id");
    const process = ($tr.attr("data-process")).split(",");
    const account = $tr.data("account");
    const name = $tr.find(".name").text();
    const memo = $tr.find(".memo").text() != '-' ? $tr.find(".memo").text() : '';

    $("#updateModal").find("[name='pk']").val(pk);
    $("#updateModal").find("[name='name']").val(name);
    $("#updateModal").find("[name='account']").val(account).trigger("change");
    $("#updateModal").find("[name='memo']").val(memo);

    $("#updateModal [name='process']").prop("checked", false);

    $("#updateModal .selected_wrap .selected_box").each(function() {
        const $chk = $(this).find("[name='process']");
        const process_id = $chk.val();

        process.forEach(function(v, i) {
            if(v == process_id) {
                $chk.prop("checked", true);
            }
        });
    });

    $("#updateModal").css('display','flex');
}

function updateData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("#updateModal").find("[name='pk']").val();
    let obj;

    const name = $("#updateModal [name='name']").val();
    const account_id = $("#updateModal [name='account']").val();
    const memo = $("#updateModal [name='memo']").val();
    const process = [];

    /* 필수항목 유효성 검사 */
    const required = ['name','account'];
    
    for(let i=0; i<required.length; i++) {
        if(!$("#updateModal").find(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("설비명을 입력해주세요.");
            } else if(required[i] == 'account') {
                alert("설비담당자를 선택해주세요.");
            }

            $("#updateModal").find(`[name='${required[i]}']`).focus();

            return;
        }
    }

    $("#updateModal .selected_wrap .selected_box").each(function() {
        const $chk = $(this).find("[name='process']");
        const process_id = $chk.val();

        if($chk.prop("checked")) {
            process.push(process_id);
        }
    });

    if(process.length == 0) {
        alert("적어도 하나의 공정을 선택해주세요.");
        return false;
    }

    obj = {
        name : name,
        account_id : account_id,
        memo : memo,
        process : process
    }

    // console.log(obj);

    $.ajax({
        url: `/base/api/equipment/mod/${pk}`,
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
                alert("중복된 설비명이 존재합니다.");
                return false;

            } else {
                alert("수정되었습니다.");
                location.reload();
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}