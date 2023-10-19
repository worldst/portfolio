let cnt = 1000;

$(function() {
    // 접수 담당자 - 로그인 계정 셋팅
    const user_id = $("[name='user_id']").val();
    $("[name='account']").val(user_id).trigger("change");

    // 납기 일자 - 당일 + 30일 셋팅
    const today = moment().format("YYYY-MM-DD");
    const due_date = moment(today).add(30,'days').format("YYYY-MM-DD");
    $("[name='due_date']").val(due_date);

    // 업체 - 직접입력 전환
    $(document).on("change","[name='toggle']",function() {
        const is_checked = $(this).prop("checked");

        $("#form_company").removeClass("hidden");
        $("#form_company_txt").removeClass("hidden");

        if(is_checked) $("#form_company").addClass("hidden");
        else $("#form_company_txt").addClass("hidden");
    });

});

function addRowFile() {
    let html = '';

    html += `<div class="data-form">`;
    html += `    <div class="row_title">업로드 파일</div>`;
    html += `    <div class="file_box flex-around">`;
    html += `        <input type="file" id="upload_file_${cnt}" class="file_upload etc data" name="upload_file">`;
    html += `        <input type="text" class="data-input file_url" disabled>`;
    html += `        <label class="common-btn common-btn--upload" for="upload_file_${cnt}">찾기</label>`;
    html += `    </div>`;
    html += `    <span class="dynamic-btn minus" onclick="deleteRowFile(this);">-</span>`;
    html += `</div>`;

    $(".edit-form__inner#file").append(html);

    cnt++;
}

function deleteRowFile(self) {
    $(self).closest(".data-form").remove();
}

function createData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const formData = new FormData();
    let obj;
    let IS_DATA = true;

    // 기본 정보
    const company_toggle = $(".edit-form__inner#base [name='toggle']").prop("checked");
    const company_id = $(".edit-form__inner#base [name='company']").val() || null;
    const pjt_name = $(".edit-form__inner#base [name='pjt_name']").val();
    const registration_date = $(".edit-form__inner#base [name='registration_date']").val() || null;
    const account_id = $(".edit-form__inner#base [name='account']").val() || null;
    const special_note = $(".edit-form__inner#base [name='special_note']").val() || [];
    const price = removeComma($(".edit-form__inner#base [name='price']").val() || 0);
    const due_date = $(".edit-form__inner#base [name='due_date']").val() || null;
    const memo = $(".edit-form__inner#base [name='memo']").val();
    let company_name;

    if(!company_toggle) {
        company_name = $(".edit-form__inner#base [name='company'] option:selected").text();
    } else {
        company_name = $(".edit-form__inner#base [name='company_name']").val();
    }

    /* 필수항목 유효성 검사 */
    if(!company_toggle && !company_id) {
        alert("업체를 선택해주세요.");
        $("[name='company']").focus();
        return false;
    }

    if(company_toggle && !company_name) {
        alert("업체명을 입력해주세요.");
        $("[name='company_name']").focus();
        return false;
    }

    if(!pjt_name) {
        alert("프로젝트명을 입력해주세요.");
        $("[name='pjt_name']").focus();
        return false;
    }

    // 파일
    $(".edit-form__inner#file .data-form").each(function() {
        const upload_file = $(this).find("[name='upload_file']")[0].files[0] || '';
        const is_file = upload_file ? 'Y' : 'N';

        if(is_file == 'Y') formData.append("estimate_file", upload_file);
    });

    obj = {
        company_name : company_name,
        pjt_name : pjt_name,
        registration_date : registration_date,
        account_id : account_id,
        special_note : special_note,
        price : price,
        due_date : due_date,
        memo : memo,
    }
    
    formData.append("csrfmiddlewaretoken",token);
    formData.append("obj", JSON.stringify(obj));    
    
    if(IS_DATA) {
        console.log(obj);

        for(let i of formData.entries()) {
            console.log(i[0]);
            console.log(i[1]);
        }

        $.ajax({
            url: '/sales/api/estimate/create/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function(xhr, settings) {
                $(".load_bg").addClass('load_display');
            },
            success:function(data) {
                location.href='/sales/estimates/';
            },
            error:function(request, status, error) {
                alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
            }
        })
    }
}