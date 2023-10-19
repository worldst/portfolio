MAX_VIEW_COUNT = 100;
let timer = null;
const status_obj = {
    "WAIT" : {
        "name" : "대기",
        "func" : "setWorkProcessModalOpen(this);"
    },
    "START" : {
        "name" : "시작",
        "func" : "selectedWorkModeModalOpen(this);"
    },
    "PAUSE" : {
        "name" : "정지",
        "func" : "setWorkProcessModalOpen(this);"
    },
    "COMPLT" : {
        "name" : "완료",
        "func" : ""
    },
}

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
        url : '/sales/api/order/dashboard/refresh/',
        data: obj,
        type : 'GET',
        dataType: 'json',
        beforeSend : function() {
            if(!timer) {
                $(".load-screen").addClass('display-block');
            }
        },
        success : function(data) {
            // console.log(data);
            const code_list = data.code_list;
            const data_list = data.data_list;
            let process_data_len = 0;
            let html = '';
            
            $(".total-info .total span").text(data.data_len);
            $(".content.data .data_num .total").text(addCommas(data.total || 0));
            $(".content.data .data_num .wait").text(addCommas(data.wait || 0));
            $(".content.data .data_num .start").text(addCommas(data.start || 0));
            $(".content.data .data_num .delay").text(addCommas(data.delay || 0));
            $(".content.data .data_num .urgent").text(addCommas(data.urgent || 0));
            $(".content.data .data_num .complt_rate").text(addCommas(data.complt_rate || 0));

            if(data_list.length == 0) {
                html += `<table class="table list" id="list-table">`;
                html += `    <colgroup>`;
                html += `        <col width="140px">`;
                html += `        <col width="300px">`;
                html += `        <col width="140px">`;
                html += `        <col width="140px">`;
                html += `    </colgroup>`;
                html += `    <thead>`;
                html += `        <tr>`;
                html += `            <th>납기일</th>`;
                html += `            <th>프로젝트명</th>`;
                html += `            <th>접수자</th>`;
                html += `            <th>작업 완료율</th>`;
                html += `        </tr>`;
                html += `    </thead>`;
                html += `    <tbody>`;
                html += `        <tr>`;
                html += `            <td colspan='4' class='no-data'>현재 등록된 데이터가 없습니다.</td>`;
                html += `        <tr>`;
                html += `    </tbody>`;
                html += `</table>`;

            } else {
                html += `<table class="table list" id="list-table">`;
                html += `    <colgroup>`;
                html += `        <col width="140px">`;
                html += `        <col width="300px">`;
                html += `        <col width="140px">`;
                html += `        <col width="140px">`;
                for(let i=0; i<code_list.length; i++) {
                    html += `        <col width="120px">`;
                }
                html += `    </colgroup>`;
                html += `    <thead>`;
                html += `        <tr>`;
                html += `            <th>납기일</th>`;
                html += `            <th>프로젝트명</th>`;
                html += `            <th>접수자</th>`;
                html += `            <th>작업 완료율</th>`;
                for(let i=0; i<code_list.length; i++) {
                    html += `            <th><span class="head_process" data-id="${code_list[i].id}">${code_list[i].name}</span></th>`;
                }
                html += `        </tr>`;
                html += `    </thead>`;
                html += `    <tbody>`;
                for(let i=0; i<data_list.length; i++) {
                    html += `<tr data-id="${data_list[i].pk}">`;
                    html += `    <td>${data_list[i].due_date}</td>`;
                    html += `    <td class="txt_left"><a href="/sales/order/shipment/${data_list[i].pk}/detail" class="pjt_name">${data_list[i].pjt_name}</a></td>`;
                    html += `    <td>${data_list[i].account || '-'}</td>`;
                    html += `    <td>`;
                    html += `        <div class="progress_bar_bg">`;
                    html += `            <div class="progress_bar" style="width:${Math.round(data_list[i].complt_rate)}%"></div>`;
                    html += `            <div class="progress_num">${Math.round(data_list[i].complt_rate)}%</div>`;
                    html += `        </div>`;
                    html += `    </td>`;
                    for(let j=0; j<data_list[i].process_data.length; j++) {
                        html += `    <td data-id="${data_list[i].process_data[j].pk || ''}" data-name="${data_list[i].process_data[j].name || ''}" data-last_equipment="${data_list[i].process_data[j].last_equipment || ''}" data-worker="${data_list[i].process_data[j].worker_id || ''}">`;
                        html += `        <div class="status_box flex-center ${data_list[i].process_data[j].status}" onclick="${(status_obj[data_list[i].process_data[j].status] || '').func || ''}">`;
                        html += `            <span class="status">${(status_obj[data_list[i].process_data[j].status] || '').name || '-'}</span>`;
                        if(data_list[i].process_data[j].status == 'START') {
                            html += `            <span class="worker">${data_list[i].process_data[j].worker || '-'}</span>`;
                        }
                        html += `        </div>`;
                        html += `    </td>`;

                        if(i == 0) {
                            process_data_len++;
                        }
                    }
                    html += `</tr>`;
                }
                html += `    </tbody>`;
                html += `</table>`;
            }
            
            $(".row_scroll").empty().append(html);

            // 공정 가로값 계산
            const CELL_WIDTH = 720 + (120 * process_data_len);

            $("#list-table").css("width",`${CELL_WIDTH}px`);
            $(".row_scroll").css("max-width",`${CELL_WIDTH}px`);

            // 상태별 색상 적용
            $("#list-table tbody tr .status_box").each(function() {
                if($(this).find(".status").text().indexOf("대기") > -1) {
                    $(this).css("background-color","#737373");
                } else if($(this).find(".status").text().indexOf("시작") > -1) {
                    $(this).css("background-color","#1270b3");
                } else if($(this).find(".status").text().indexOf("정지") > -1) {
                    $(this).css("background-color","#bba60f");
                } else if($(this).find(".status").text().indexOf("완료") > -1) {
                    $(this).css("background-color","#33c359").css("cursor","not-allowed");
                } else {
                    $(this).css("color","#929292").css("cursor","default");
                }
            });
        },
        complete: function() {
            setTimeout(() => {
                handlingEmptyValue();
                $(".load-screen").removeClass('display-block');
                $("[name='save_pageNum']").val(pageNum);
            }, 150);
        },
        error: function (request, status, error) {
            console.log(`Code: ${request.status}, Message: ${request.responseText}, Error: ${error}`);
        }
    });

    // timer = setTimeout(() => {
    //     GetOverallDashboard();
    // }, 10000);
}

// 작업 설정
function setWorkProcessModalOpen(self) {
    const process_txt = $(".content.user .info_box.process .info").text();
    const equipment = $("[name='instruction_equipment']").val();

    const process_id = $(self).closest("td").attr("data-id");
    const last_equipment = $(self).closest("td").attr("data-last_equipment") || '';
    const object_process = $(self).closest("td").attr("data-name") || '';
    const object_worker = $(self).closest("td").attr("data-worker") || '';
    
    // 설비 정보 불러오기
    $.ajax({
        async: false,
        url: '/base/api/code/process/worker/equipment',
        type: 'GET',
        data: {
            process: object_process
        },
        success: function (data) {
            // console.log(data);
            const equipment_list = data.equipment_list;
            let html = '';

            html += `<option value="" title="choice">선택</option>`;
            for (let i=0; i<equipment_list.length; i++) {
                html += `<option value="${equipment_list[i].id}">${equipment_list[i].name}</option>`;
            }

            $("#setWorkProcessModal [name='equipment']").empty().append(html);

            if(!last_equipment) {
                if(object_process == process_txt) {
                    $("#setWorkProcessModal [name='equipment']").val(equipment);
                }
            } else {
                $("#setWorkProcessModal [name='equipment']").val(last_equipment);
            }

            $("#setWorkProcessModal [name='worker']").val(object_worker).trigger("change");
        }
    });

    $("#setWorkProcessModal [name='pk']").val(process_id);
    $("#setWorkProcessModal [name='process']").val(object_process);
    $("#setWorkProcessModal").css('display', 'flex');
}

function setWorkProcess() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("#setWorkProcessModal [name='pk']").val();
    let obj;

    const equipment_id = $("#setWorkProcessModal [name='equipment']").val() || null;
    const equipment_name = equipment_id == null ? '' : $("#setWorkProcessModal [name='equipment'] option:selected").text();
    const worker_id = $("#setWorkProcessModal [name='worker']").val();

    /*
    if(!equipment_id) {
        alert("설비를 설정해주세요.");
        return false;
    }
    */

    if(!worker_id) {
        alert("작업자를 설정해주세요.");
        return false;
    }

    obj = {
        equipment_id : equipment_id,
        equipment_name : equipment_name,
        worker_id : worker_id,
    }

    $.ajax({
        url: `/work/api/order/process/${pk}/start`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load_bg").addClass('load_display');
            }
        },
        success: function (data) {
            /*
            $("#list-table tbody tr").each(function() {
                $(this).find(".status_box").each(function() {
                    const td_process_id = $(this).closest("td").attr("data-id");
                    
                    if(td_process_id == pk) {

                    }
                });
            });
            */
            
            // clearTimeout(timer);
            // GetOverallDashboard();

            $(".load_bg").removeClass('load_display');
            
            const pageNum = $("[name='save_pageNum']").val();

            getResultData(pageNum);
            $("#setWorkProcessModal").hide();
        },
        error: function (request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 작업 정지 or 완료 선택창
function selectedWorkModeModalOpen(self) {
    const process_id = $(self).closest("td").attr("data-id");

    $(".pauseWorkProcessModal [name='pk']").val(process_id);
    $(".selectedWorkModeModal [name='pk']").val(process_id);
    $(".selectedWorkModeModal #status_1").prop("checked",true);

    $(".selectedWorkModeModal").css('display', 'flex');
}

function selectedWorkMode() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const process_id = $(".selectedWorkModeModal [name='pk']").val();
    const status = $(".selectedWorkModeModal [name='status']:checked").next("label").find("span").text();

    if(status == '일시정지') pauseWorkProcessModalOpen();
    else if(status == '완료') compltWorkProcess(process_id);

    $(".selectedWorkModeModal").hide();
}

// 작업 정지
function pauseWorkProcessModalOpen() {
    $(".pauseWorkProcessModal #reason_1").prop("checked",true);

    $(".pauseWorkProcessModal").css("display","flex");
}

function pauseWorkProcess() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $(".pauseWorkProcessModal [name='pk']").val();
    const reason = $(".pauseWorkProcessModal [name='reason']:checked").next("label").find("span").text();
    let obj;

    obj = {
        reason : reason,
    }

    // console.log(obj);

    $.ajax({
        url: `/work/api/order/process/${pk}/stop`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load_bg").addClass('load_display');
            }
        },
        success:function(data) {
            $(".load_bg").removeClass('load_display');

            const pageNum = $("[name='save_pageNum']").val();

            getResultData(pageNum);
            $(".pauseWorkProcessModal").hide();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 작업 완료
function compltWorkProcess(process_id) {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    // const pk = $("[name='object_id']").val();

    $.ajax({
        url: `/work/api/order/process/${process_id}/finish`,
        type: 'POST',
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load_bg").addClass('load_display');
            }
        },
        success: function (data) {
            $(".load_bg").removeClass('load_display');

            const pageNum = $("[name='save_pageNum']").val();

            getResultData(pageNum);
            $(".pauseWorkProcessModal").hide();
        },
        error: function (request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}