$(function() {
    // 기존 셀렉트 데이터 셋팅
    $(".select_tag").each(function() {
        const before_data = $(this).data("before");

        if(before_data != '-') {
            $(this).val(before_data).trigger("change");
        }
    });
});


function updateData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();
    let obj;

    // 기본 정보
    const name = $(".edit-form__inner#base [name='name']").val();
    const password = $(".edit-form__inner#base [name='password']").val();
    const password_check = $(".edit-form__inner#base [name='password_check']").val();
    const type = $(".edit-form__inner#base [name='type']").val();
    const email = $(".edit-form__inner#base [name='email']").val();
    const phone_number = $(".edit-form__inner#base [name='phone_number']").val();
    const memo = $(".edit-form__inner#base [name='memo']").val();
    const is_active = $(".edit-form__inner#base [name='is_active']").val();

    /* 필수항목 유효성 검사 */
    const required = ['name','password','password_check','type'];
    
    for(let i=0; i<required.length; i++) {
        if(!$(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("사용자 이름을 입력해주세요.");
            }
            if(required[i] == 'password') {
                alert("비밀번호를 입력해주세요.");
            }
            if(required[i] == 'password_check') {
                alert("비밀번호 확인을 입력해주세요.");
            }
            if(required[i] == 'type') {
                alert("계정 유형을 선택해주세요.");
            }
            $(`[name='${required[i]}']`).focus();

            return;
        }
    }

    if(password != password_check){
        alert('비밀번호를 확인해주세요.');
        return
    }

    if(email && !email_check(email)) {
        alert("올바른 이메일을 형식을 입력해주세요.");
        $("input[name='email']").focus();
        return false;
    }

    obj = {
        name : name,
        password : password,
        type : type,
        email : email,
        phone_number : phone_number,
        is_active : is_active,
        memo : memo
    }


    // console.log(obj);

    $.ajax({
        url: `/system/api/account/mod/${pk}`,
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
            if(data.result == 'fail'){
                alert("중복된 사용자 이름이 존재합니다.");
                $(".load_bg").removeClass('load_display');
                return false;
            }else{
                location.href=`/system/account/${pk}/detail`;
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}


$(function(){
    /* Toggle Check */
    $(".switch").each(function() {
        if($(this).children('input').val()=="True") {
            $(this).children('input').prop('checked', true);
            $(".switch").css("background","linear-gradient(to left, #6bb9fb, #1e80e6)");
            $(".switch .handle").css("left","45px");
        }
        else {
            $(this).children('input').prop('checked', false);
            $(".switch").css("background","linear-gradient(to right, #828282, #313131)");
            $(".switch .handle").css("left","5px");
        }
        $(this).children('input').change(function() {
            if($(this).prop('checked')) {
                $(this).val('True');
                $(".switch").css("background","linear-gradient(to left, #6bb9fb, #1e80e6)");
                $(".switch .handle").animate({
                    left : "45px"
                },200);
            }
            else {
                $(this).val('False');
                $(".switch").css("background","linear-gradient(to right, #828282, #313131)");
                $(".switch .handle").animate({
                    left : "5px"
                },200);
            }
        });
    });
});