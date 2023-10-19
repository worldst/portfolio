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
        url: '/material/api/list/',
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
                $("#list-table tbody").empty().append("<td colspan='7' class='no-data'>현재 등록된 데이터가 없습니다.</td>");

                if(mode === 'search') {
                    $("#list-table tbody").empty().append("<td colspan='7' class='no-data'>조회된 데이터가 없습니다.</td>");
                }
            } else { 
                setTimeout(() => {
                    let html = '';

                    $.each(res, function (key, value) {
                        html += `<tr data-id="${value.pk}">`;
                        html += `    <td><input type="checkbox" name="rowCheck" value="${value.pk}"></td>`;
                        html += `    <td class="txt_left"><span class="name">${value.name}</span></td>`;
                        html += `    <td class="txt_right"><span class="unit_price">${addCommas(value.unit_price || 0)}</span> 원</td>`;
                        html += `    <td><span class="unit">${value.unit || '-'}</span></td>`;
                        html += `    <td><span class="stock">${addCommas(value.stock || 0)}</span></td>`;
                        html += `    <td><span class="safety_stock">${addCommas(value.safety_stock || 0)}</span></td>`;
                        html += `    <td><span class="tdBtn view" onclick="enterRecordModalOpen(this);">보기</span></td>`;
                        html += `    <td><span class="tdBtn view" onclick="usedRecordModalOpen(this);">보기</span></td>`;
                        html += `    <td><span class="tdBtn view" onclick="historyModalOpen(this);">보기</span></td>`;
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
        url: `/material/api/del/`,
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
    const unit_price = removeComma($("#createModal [name='unit_price']").val() || 0);
    const unit = $("#createModal [name='unit']").val();
    const stock = removeComma($("#createModal [name='stock']").val() || 0);
    const safety_stock = removeComma($("#createModal [name='safety_stock']").val() || 0);

    /* 필수항목 유효성 검사 */
    const required = ['name'];
    
    for(let i=0; i<required.length; i++) {
        if(!$("#createModal").find(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("자재명을 입력해주세요.");
            }

            $("#createModal").find(`[name='${required[i]}']`).focus();

            return;
        }
    }

    obj = {
        name : name,
        unit_price : unit_price,
        unit : unit,
        stock : stock,
        safety_stock : safety_stock,
    }

    $.ajax({
        url: `/material/api/create/`,
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
                alert("중복된 자재명이 존재합니다.");
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
    const name = $tr.find(".name").text();
    const unit_price = $tr.find(".unit_price").text() != 0 ? $tr.find(".unit_price").text() : '';
    const unit = $tr.find(".unit").text() != '-' ? $tr.find(".unit").text() : '';
    const stock = $tr.find(".stock").text() != 0 ? $tr.find(".stock").text() : '';
    const safety_stock = $tr.find(".safety_stock").text() != 0 ? $tr.find(".safety_stock").text() : '';

    $("#updateModal").find("[name='pk']").val(pk);
    $("#updateModal").find("[name='name']").val(name);
    $("#updateModal").find("[name='unit_price']").val(unit_price);
    $("#updateModal").find("[name='unit']").val(unit);
    $("#updateModal").find("[name='stock']").val(stock);
    $("#updateModal").find("[name='safety_stock']").val(safety_stock);

    $("#updateModal").css('display','flex');
}

function updateData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("#updateModal").find("[name='pk']").val();
    let obj;

    const name = $("#updateModal [name='name']").val();
    const unit_price = removeComma($("#updateModal [name='unit_price']").val() || 0);
    const unit = $("#updateModal [name='unit']").val();
    const stock = removeComma($("#updateModal [name='stock']").val() || 0);
    const safety_stock = removeComma($("#updateModal [name='safety_stock']").val() || 0);

    /* 필수항목 유효성 검사 */
    const required = ['name'];
    
    for(let i=0; i<required.length; i++) {
        if(!$("#updateModal").find(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("자재명을 입력해주세요.");
            }

            $("#updateModal").find(`[name='${required[i]}']`).focus();

            return;
        }
    }

    obj = {
        name : name,
        unit_price : unit_price,
        unit : unit,
        stock : stock,
        safety_stock : safety_stock,
    }

    $.ajax({
        url: `/material/api/mod/${pk}`,
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
                alert("중복된 자재명이 존재합니다.");
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

// 데이터 업로드
function uploadDataModalOpen() {
    $("#uploadDataModal").css('display','flex');
}

function uploadData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const formData = new FormData();
    const upload_file = $("#uploadDataModal").find("[name='upload_file']")[0].files[0] || ''

    if(!upload_file) {
        alert("업로드 파일을 선택해주세요.");
        return false;
    }

    formData.append("csrfmiddlewaretoken",token);
    formData.append("excel_file", upload_file);
    
    $.ajax({
        url: '/material/api/upload/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function(xhr, settings) {
            $(".load_bg").addClass('load_display');
        },
        success:function(data) {            
            if(data.result == 'fail') {
                alert("올바른 파일의 형식을 등록해주세요.");
                return false;

            } else {
                // alert("처리완료되었습니다.");
                location.reload();
            }
        },
        error:function(request, status, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    })
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
        url: '/material/api/excel/download',
        data: obj,
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".load-screen").addClass('display-block');
        },
        success: function (data) {
            var name = data.name;

            var a = document.createElement('a');
            a.href = '/material/media/material/' + name.toString() + ".xlsx";
            a.download = name.toString() + ".xlsx";
            a.click();
            $(".load-screen").removeClass('display-block');
        }
    });
}

// 입고 내역
function enterRecordModalOpen(self) {
    const $tr = $(self).closest("tr");
    const pk = $tr.data("id");

    $.ajax({
        async: false,
        url: `/material/api/enter/record/${pk}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            const res = data.data_list;
            let html = '';

            if(res.length == 0) {
                html += `<tr><td colspan='5' class='no-data'>현재 등록된 데이터가 없습니다.</td></tr>`;

            } else {
                for(let i=0; i<res.length; i++) {
                    html += `<tr>`;
                    html += `    <td>${i+1}</td>`;
                    html += `    <td class="txt_left">${res[i].material_name}</td>`;
                    html += `    <td>${res[i].account_name}</td>`;
                    html += `    <td>${addCommas(res[i].cnt)}</td>`;
                    html += `    <td>${res[i].enter_date}</td>`;
                    html += `</tr>`;
                }
            }

            $("#enterRecordModal .table tbody").empty().append(html);
            $("#enterRecordModal").css('display','flex');
        }
    });    
}

// 사용 내역
function usedRecordModalOpen(self) {
    const $tr = $(self).closest("tr");
    const pk = $tr.data("id");

    $.ajax({
        async: false,
        url: `/material/api/used/record/${pk}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            const res = data.data_list;
            let html = '';

            if(res.length == 0) {
                html += `<tr><td colspan='5' class='no-data'>현재 등록된 데이터가 없습니다.</td></tr>`;

            } else {
                for(let i=0; i<res.length; i++) {
                    html += `<tr>`;
                    html += `    <td>${i+1}</td>`;
                    html += `    <td class="txt_left">${res[i].material_name}</td>`;
                    html += `    <td>${res[i].num}</td>`;
                    html += `    <td>${addCommas(res[i].cnt)}</td>`;
                    html += `    <td>${res[i].used_date}</td>`;
                    html += `</tr>`;
                }
            }

            $("#usedRecordModal .table tbody").empty().append(html);
            $("#usedRecordModal").css('display','flex');
        }
    });    
}

// 변경 내역
function historyModalOpen(self) {
    const $tr = $(self).closest("tr");
    const pk = $tr.data("id");

    $.ajax({
        async: false,
        url: `/material/api/history/${pk}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            const res = data.data;
            let html = '';

            if(res.length == 0) {
                html += `<tr><td colspan='4' class='no-data'>현재 등록된 데이터가 없습니다.</td></tr>`;

            } else {
                for(let i=0; i<res.length; i++) {
                    const res_update_dt = res[i].date_created;
                    const update_dt = `${res_update_dt.split("T")[0]} ${res_update_dt.split("T")[1].split(".")[0]}`;

                    html += `<tr>`;
                    html += `    <td>${i+1}</td>`;
                    html += `    <td class="txt_left">${res[i].version}</td>`;
                    html += `    <td class="txt_left">${res[i].comment}</td>`;
                    html += `    <td>${update_dt}</td>`;
                    html += `</tr>`;
                }
            }

            $("#historyModal .table tbody").empty().append(html);
            $("#historyModal").css('display','flex');
        }
    });    
}