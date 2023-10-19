$(function() {
    // 접수 담당자 - 로그인 계정 셋팅
    const user_id = $("[name='user_id']").val();
    $("[name='account']").val(user_id).trigger("change");
});

function createData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    let obj;

    // 기본 정보
    const name = $(".edit-form__inner#base [name='name']").val();
    const type = $(".edit-form__inner#base [name='type']").val();
    const account_id = $(".edit-form__inner#base [name='account']").val() || null;
    const address = $(".edit-form__inner#base [name='address']").val();
    const line_of_business = $(".edit-form__inner#base [name='line_of_business']").val();
    const type_of_business = $(".edit-form__inner#base [name='type_of_business']").val();
    const email = $(".edit-form__inner#base [name='email']").val();
    const onwer = $(".edit-form__inner#base [name='onwer']").val();
    const onwer_phone = $(".edit-form__inner#base [name='onwer_phone']").val();
    const fax = $(".edit-form__inner#base [name='fax']").val();
    const registration_num = $(".edit-form__inner#base [name='registration_num']").val();
    const manager_name = $(".edit-form__inner#base [name='manager_name']").val();
    const manager_phone = $(".edit-form__inner#base [name='manager_phone']").val();
    const memo = $(".edit-form__inner#base [name='memo']").val();

    /* 필수항목 유효성 검사 */
    const required = ['name'];
    
    for(let i=0; i<required.length; i++) {
        if(!$(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("업체명을 입력해주세요.");
            }

            $(`[name='${required[i]}']`).focus();

            return;
        }
    }

    if(email && !email_check(email)) {
        alert("올바른 이메일을 형식을 입력해주세요.");
        $("input[name='email']").focus();
        return false;
    }

    obj = {
        name : name,
        type : type,
        account_id : account_id,
        address : address,
        line_of_business : line_of_business,
        type_of_business : type_of_business,
        email : email,
        onwer : onwer,
        onwer_phone : onwer_phone,
        fax : fax,
        registration_num : registration_num,
        manager_name : manager_name,
        manager_phone : manager_phone,
        memo : memo
    }

    // console.log(obj);

    $.ajax({
        url: `/base/api/company/create/`,
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
            if(data.result == 'fail') {
                alert("중복된 업체명이 존재합니다.");
                $(".load_bg").removeClass('load_display');
                return false;

            } else {                
                location.href='/base/company/list/';
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}