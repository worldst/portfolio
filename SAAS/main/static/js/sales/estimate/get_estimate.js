$(function() {
    // 파일 url 정리
    $(".file_url").each(function() {
        const file_url = $(this).val();
        const result_file_url = file_url.split("/").pop();

        $(this).val(result_file_url);
    });

    // 주문 특이사항 데이터 셋팅
    const before_special_note = $("[name='special_note']").data("before");

    if(before_special_note) {
        if(before_special_note.toString().indexOf("Ψ") !== -1) {
            $("[name='special_note']").val(before_special_note.split("Ψ")).trigger("change");
        }else{
            $("[name='special_note']").val(before_special_note).trigger("change");
        }
    }
});

// 데이터 확정
function compltModalOpen(self) {
    const pk = $("[name='object_id']").val();
    const ids = [pk];

    $(".common-modal.complt [name='ids']").val(ids);
    $(".common-modal.complt").css('display','flex');
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

// 데이터 취소
function cancelModalOpen(self) {
    const pk = $("[name='object_id']").val();
    const ids = [pk];

    $(".common-modal.cancel [name='ids']").val(ids);
    $(".common-modal.cancel").css('display','flex');
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