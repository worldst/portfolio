$(function() {
    // 활성화 토글 처리
    $(document).on("change","[name='is_active']",function() {
        const is_active = $(this).prop("checked");

        if(is_active) {
            $(this).closest(".code_box").addClass("act");
            $(this).next("label").text("ON");
        } else {
            $(this).closest(".code_box").removeClass("act");
            $(this).next("label").text("OFF");
        }
    });

    // 기존 셀렉트 데이터 셋팅
    $(".select_tag").each(function() {
        const before_data = $(this).data("before");

        if(before_data != '-') {
            $(this).val(before_data).trigger("change");
        }
    });

    // 데이터 불러오기
    $.ajax({
        async: false,
        url: '/base/api/codes',
        type: 'GET',
        data: {
            sort : 'delivery'
        },
        success: function(data) {
            // console.log(data);
            
            for(let i=0; i<data.length; i++) {
                let html = '';
                
                html += `<div class="code_box" data-id="${data[i].id}">`;
                html += `    <div class="code_box__body flex-between">`;
                html += `        <div class="form-group" style="width:100%;">`;
                html += `            <div class="form-group__title">`;
                html += `                <div class="title">납품 방법</div>`;
                html += `            </div>`;
                html += `            <input type="text" name="name" class="data-input" placeholder="납품 방법을 입력해주세요." value="${data[i].name}">`;
                html += `        </div>`;
                html += `    </div>`;
                html += `    <div class="code_box__bottom flex-between">`;
                html += `        <div class="toggle_box">`;
                html += `            <input type="checkbox" name="is_active" id="is_active_${i}" class="hidden">`;
                html += `            <label for="is_active_${i}">OFF</label>`;
                html += `        </div>`;
                html += `        <span class="common-btn common-btn--update" onclick="updateData(this);">저장</span>`;
                html += `    </div>`;
                html += `</div>`;

                $(".code_wrap").append(html);

                $(".code_wrap .code_box").eq(i).find("[name='ordering']").val(data[i].ordering);
                $(".code_wrap .code_box").eq(i).find("[name='is_active']").prop("checked",data[i].is_active).trigger("change");
            }

            // 미등록 데이터
            for(let i=10; i>data.length; i--) {
                let html = '';
                
                html += `<div class="code_box">`;
                html += `    <div class="code_box__body flex-between">`;
                html += `        <div class="form-group" style="width:100%;">`;
                html += `            <div class="form-group__title">`;
                html += `                <div class="title">납품 방법</div>`;
                html += `            </div>`;
                html += `            <input type="text" name="name" class="data-input" placeholder="납품 방법을 입력해주세요.">`;
                html += `        </div>`;
                html += `    </div>`;
                html += `    <div class="code_box__bottom flex-between">`;
                html += `        <div class="toggle_box">`;
                html += `            <input type="checkbox" name="is_active" id="is_active_${i}" class="hidden">`;
                html += `            <label for="is_active_${i}">OFF</label>`;
                html += `        </div>`;
                html += `        <span class="common-btn common-btn--update" onclick="createData(this);">저장</span>`;
                html += `    </div>`;
                html += `</div>`;

                $(".code_wrap").append(html);
            }
        }
    });
});

function createData(self) {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    let obj;

    const $code_box = $(self).closest(".code_box");
    const ordering = $code_box.find("[name='ordering']").val();
    const name = $code_box.find("[name='name']").val();
    const is_active = $code_box.find("[name='is_active']").prop("checked");

    /* 필수항목 유효성 검사 */
    const required = ['name'];
    
    for(let i=0; i<required.length; i++) {
        if(!$code_box.find(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("납품방법을 입력해주세요.");
            }

            $code_box.find(`[name='${required[i]}']`).focus();

            return;
        }
    }

    obj = {
        sort : 'delivery',
        ordering : null,
        name : name,
        is_active : is_active,
    }

    // console.log(obj);
    
    $.ajax({
        url: `/base/api/code/create/`,
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
            if(data.result == 'duplicate') {
                alert("중복된 납품방법이 존재합니다.");
                return false;

            } else {
                alert("등록되었습니다.");
                
                // 후처리
                $code_box.attr("data-id",data.pk);
                $(self).attr("onclick","updateData(this);");
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

function updateData(self) {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    let obj;

    const $code_box = $(self).closest(".code_box");
    const pk = $code_box.data("id");
    const ordering = $code_box.find("[name='ordering']").val() || null;
    const name = $code_box.find("[name='name']").val() || '';
    const is_active = $code_box.find("[name='is_active']").prop("checked");
    
    obj = {
        sort : 'delivery',
        ordering : null,
        name : name,
        is_active : is_active,
    }

    // console.log(obj);
    
    $.ajax({
        url: `/base/api/code/mod/${pk}`,
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
            if(data.result == 'duplicate') {
                alert("중복된 납품방법이 존재합니다.");
                return false;

            } else {
                alert("수정되었습니다.");
            }
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}