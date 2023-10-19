$(function() {
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
function enterModalOpen(id) {
    $("#enterModal [name='id']").val(id);
    $("#enterModal").css('display','flex');
}

function enterData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const id = $("#enterModal [name='id']").val()


    $.ajax({
        url: `/material/api/purchase/${id}/status/change`,
        type: 'GET',
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        success:function(data) {
            alert("입고 완료 처리되었습니다.");
            location.href='/material/purchases/'
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

function partEnterData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const id = $("#partEnterModal [name='id']").val()
    const cnt = $("#partEnterModal [name='cnt']").val() || 0;
    obj = {
        cnt : removeComma(cnt)
    }
    $.ajax({
        url: `/material/api/purchase/list/${id}/status/change`,
        type: 'POST',
        data : JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        },
        success:function(data) {
            alert("부분 입고 완료 처리되었습니다.");
            location.reload();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

function partEnterModal(self){
    let remain_cnt = $(self).closest('tr').data('remain_cnt');
    let pk = $(self).closest('tr').data('pk');
    $("#partEnterModal [name=id]").val(pk)
    $("#partEnterModal [name=cnt]").val(remain_cnt)
    $("#partEnterModal").css('display','flex');
}

function workExcel(pk){
    const token = $("input[name='csrfmiddlewaretoken']").val();
    $.ajax({
        async: false,
        url: '/material/api/purchase/work/excel/download',
        data: {
            pk : pk
        },
        type: 'POST',
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load-screen").addClass('display-block');
            }
        },
        success: function (data) {
            var file_name = data.file_name;

            var a = document.createElement('a');
            a.href = '/sales/media/material/work/' + file_name.toString() + ".xlsx";
            a.download = file_name.toString() + ".xlsx";
            a.click();
            $(".load-screen").removeClass('display-block');
        }
    });
}