$(function() {
    // 해당 공정에 대한 설비 초기 셋팅
    const process_txt = $(".content.user .info_box.process .info").text();
    const equipment = $("[name='instruction_equipment']").val();
    
    const last_equipment = $("[name='last_equipment_id']").val();
    const object_process = $("[name='object_process']").val();
    const object_worker = $("[name='object_worker']").val();
    
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

            if(object_worker) {
                $("#setWorkProcessModal [name='worker']").val(object_worker).trigger("change");
            }
        }
    });
});

function movePage(self) {
    const process_id = $(self).data("id");
    
    window.location.href=`/work/order/process/${process_id}`;
}

// 작업 설정
function setWorkProcessModalOpen() {
    $("#setWorkProcessModal").css('display', 'flex');
}

function setWorkProcess() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();
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
            window.location.reload();
        },
        error: function (request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 작업 정지
function pauseWorkProcessModalOpen() {
    $(".pauseWorkProcessModal").css("display","flex");
}

function pauseWorkProcess() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();
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
            window.location.reload();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 작업 완료
function compltWorkProcessModalOpen() {
    $(".compltWorkProcessModal").css("display","flex");
}

function compltWorkProcess() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();

    $.ajax({
        url: `/work/api/order/process/${pk}/finish`,
        type: 'POST',
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load_bg").addClass('load_display');
            }
        },
        success: function (data) {
            window.location.reload();
        },
        error: function (request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}