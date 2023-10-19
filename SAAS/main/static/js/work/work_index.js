$(function() {
    $(document).on("keydown", "[name='search_qrcode']", function(key) {
        const search_qrcode = $(this).val();
        const process = $("[name='instruction_process']").val();

        if(key.keyCode == 13) {
            if(!search_qrcode) return false;

            if(search_qrcode) {                
                $.ajax({
                    async: false,
                    url: '/work/api/search/',
                    type: 'GET',
                    data: {
                        num : search_qrcode,
                        process : ''
                    },
                    success: function(data) {
                        // console.log(data);
                        if(data.result == 'no_order') {
                            alert("존재하지 않는 수주번호 입니다.");
                            return false;

                        } else if(data.result == 'cancel') {
                            alert("이미 취소 처리된 수주 입니다.");
                            return false;

                        } else {
                            if(process) {
                                setWorkProcess();
                            } else {
                                setWorkProcessModalOpen();
                            }
                        }
                    }
                });
            }
        }
    });

    // 작업설정 -> 공정 선택 시 설비 데이터 불러오기
    $(document).on("change","#setWorkProcessModal [name='instruction_process']",function() {
        const process_id = $(this).val();
        const process = process_id ? $(this).find("option:selected").text() : '';
        const instruction_equipment = $("[name='instruction_equipment']").val();
                            
        $.ajax({
            async: false,
            url: '/base/api/code/process/worker/equipment',
            type: 'GET',
            data: {
                process: process
            },
            success: function (data) {
                // console.log(data);
                const equipment_list = data.equipment_list;
                let html = '';

                html += `<option value="" title="choice">선택</option>`;

                if(process) {
                    for (let i=0; i<equipment_list.length; i++) {
                        html += `<option value="${equipment_list[i].id}">${equipment_list[i].name}</option>`;
                    }
                }

                $("#setWorkProcessModal [name='instruction_equipment']").empty().append(html);

                if(instruction_equipment) {
                    const before_process_id = $("[name='instruction_process']").val();

                    if(before_process_id == process_id) {
                        $("#setWorkProcessModal [name='instruction_equipment']").val(instruction_equipment).trigger("change");
                    }
                }
            }
        });
    });
});

// 작업 설정 모달창
function setWorkProcessModalOpen() {
    const instruction_process = $("[name='instruction_process']").val();                
    
    $.ajax({
        async: false,
        url: '/base/api/codes',
        type: 'GET',
        data: {
            sort: 'process'
        },
        success: function (data) {
            // console.log(data);
            let html = '';

            html += `<option value="" title="choice">선택</option>`;
            for(let i=0; i<data.length; i++) {
                html += `<option value="${data[i].id}">${data[i].name}</option>`;
            }

            $("#setWorkProcessModal [name='instruction_process']").empty().append(html);
            $("#setWorkProcessModal").css('display', 'flex');

            if(instruction_process) {
                $("#setWorkProcessModal [name='instruction_process']").val(instruction_process).trigger("change");
            } else {
                $("#setWorkProcessModal [name='instruction_equipment']").append(`<option value="" title="choice">선택</option>`);
            }
        }
    });
}

// 작업 설정
function setWorkProcess() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const num = $("[name='search_qrcode']").val();
    let process_id = $("[name='instruction_process']").val();
    let equipment_id;
    let process;
    let obj;

    if(process_id) {
        process = $(".content.user .info_box.process .info").text();
        equipment_id = $("[name='instruction_equipment']").val();

    } else {
        process = $("#setWorkProcessModal [name='instruction_process'] option:selected").text();
        process_id = $("#setWorkProcessModal [name='instruction_process']").val();
        equipment_id = $("#setWorkProcessModal [name='instruction_equipment']").val();

        if(!process_id) {
            alert("공정을 선택해주세요.");
            return false;
        }
    }
    
    $.ajax({
        async: false,
        url: '/work/api/search/',
        type: 'GET',
        data: {
            num : num,
            process : process
        },
        success: function(data) {
            // console.log(data);
            const order_process_id = data.order_process_id;

            if(data.result == 'fail') {
                alert("해당 수주에서 비활성화 처리되었거나 존재하지 않는 공정입니다.\n공정을 다시 설정해주세요.");
                return false;

            } else {
                // 기준 공정 및 설비 재설정
                obj = {
                    process : process_id,
                    equipment : equipment_id,
                }                
                
                $.ajax({
                    url: `/system/api/process/equipment`,
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
                        window.location.href=`/work/order/process/${order_process_id}`;
                    },
                    error: function (request, error) {
                        alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
                    }
                });
            }
        }
    });
}