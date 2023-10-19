let cnt = 1000;

$(function() {
    // 기존 셀렉트 데이터 셋팅
    $(".select_tag").each(function() {
        const before_data = $(this).data("before");

        if(before_data != '-') {
            $(this).val(before_data).trigger("change");
        }
    });

    // 파일 객체 저장
    $(".file_url").each(function() {
        const file_url = $(this).attr("value");

        if(file_url) {
            const fileObject = convertURLtoFile(`/base/media/${file_url}`);
            fileObject.then((res) => $(this).prev(".file_upload")[0].files = res.files)
        }
    });

    // 업체 - 직접입력 전환
    $(document).on("change","[name='toggle']",function() {
        const is_checked = $(this).prop("checked");

        $("#form_company").removeClass("hidden");
        $("#form_company_txt").removeClass("hidden");

        if(is_checked) $("#form_company").addClass("hidden");
        else $("#form_company_txt").addClass("hidden");
    });

    // 업체 - 선택 시 [담당자] [연락처] 출력
    $(document).on("change","[name='company']",function() {
        const company_id = $(this).val();
        let manager_name;
        let manager_phone;

        $(".company_data div").each(function() {
            if($(this).data("id") == company_id) {
                manager_name = $(this).data("manager_name");
                manager_phone = $(this).data("manager_phone");
            }
        });

        $("[name='manager_name']").val(manager_name);
        $("[name='manager_phone']").val(manager_phone);
    });

    // 공정 - 활성화 토글
    $(document).on("change",".edit-form__inner#process [name='process']",function() {
        const is_checked = $(this).prop("checked");

        if(is_checked) {
            $(this).closest(".process_inner").find(".active_mark").removeClass("hidden");
            $(this).closest(".process_inner").find(".data-input").removeAttr("disabled");

        } else {
            $(this).closest(".process_inner").find(".active_mark").addClass("hidden");
            $(this).closest(".process_inner").find(".data-input").attr("disabled","disabled");
        }
    });

    // 자재 및 외주정보 - 타입별 입력란 전환
    $(document).on("change","#t_material [name='type']",function() {
        const $tr = $(this).closest("tr");
        const type = $(this).val();

        if(type == 'material') { // 자재
            $tr.find(".material").removeClass("hidden");
            $tr.find(".out").addClass("hidden");

        } else { // 외주
            $tr.find(".material").addClass("hidden");
            $tr.find(".out").removeClass("hidden");
        }

        $tr.find(".input_control").trigger("change");
    });

    // 자재 및 외주정보 - 금액 계산
    $(document).on("keyup change","#t_material .input_control",function() {
        const $tr = $(this).closest("tr");
        const type = $tr.find("[name='type']").val();
        let unit_price;
        let quantity;
        let amount = 0;
        
        unit_price = removeComma($tr.find(`[name='unit_price'].${type}`).val() || 0);
        quantity = removeComma($tr.find(`[name='quantity'].${type}`).val() || 0);

        amount = unit_price * quantity;

        $tr.find(`[name='amount'].${type}`).val(addCommas(amount || ''));

        // 금액 합산
        getTotalMaterialCost();
    });

    // 자재 및 외주정보 - 자재 조회
    $(document).on("keyup change","select[name='name']",function() {
        const $tr = $(this).closest("tr");
        const type = $tr.find("[name='type']").val();
        const material_id = $(this).val();

        if(material_id) {
            let unit_price;
            let unit;

            $(".material_data div").each(function() {
                if($(this).data("id") == material_id) {
                    unit_price = $(this).data("unit_price");
                    unit = $(this).data("unit");
                }
            });

            $tr.find(`[name='unit_price'].${type}`).val(addCommas(unit_price)).trigger("keyup");
            $tr.find(`[name='unit'].${type}`).val(unit);

        } else {
            $tr.find(`[name='unit_price'].${type}`).val("");
            $tr.find(`[name='unit'].${type}`).val("");
        }
    });

    // 공정 - 기본 설정 (모두 활성화)
    $(".edit-form__inner#process .process_inner").each(function() {
        const $chk = $(this).find("[name='process']");

        if($chk.prop("checked")) $chk.trigger("change");
    });

    // 매출 총액 계산
    $(document).on("keyup change",".control_price",function() {
        const process_price = removeComma($("[name='process_price']").val() || 0);
        const material_price = removeComma($("[name='material_price']").val() || 0);
        const outsourcing_price = removeComma($("[name='outsourcing_price']").val() || 0);
        const etc_price = removeComma($("[name='etc_price']").val() || 0);
        const total_price = process_price + material_price + outsourcing_price + etc_price;

        $("[name='total_price']").val(addCommas(total_price || 0));
    });

    // 원가 총액 계산
    $(document).on("keyup change",".control_cost",function() {
        const process_cost = removeComma($("[name='process_cost']").val() || 0);
        const material_cost = removeComma($("[name='material_cost']").val() || 0);
        const outsourcing_cost = removeComma($("[name='outsourcing_cost']").val() || 0);
        const total_cost = process_cost + material_cost + outsourcing_cost;

        $("[name='total_cost']").val(addCommas(total_cost || 0));
    });

    // 원가 총액 - 가공비 계산
    $(document).on("keyup change",".process_box [name='price']",function() {
        let total_price = 0;

        $(".process_inner").each(function() {
            const is_active = $(this).find("[name='process']").prop("checked");
            const price = removeComma($(this).find("[name='price']").val() || 0);

            if(is_active) total_price += price;
        });

        $("[name='process_cost']").val(addCommas(total_price || 0)).trigger("change");
    });

    $(document).on("change",".process_inner [name='process']",function() {
        $(this).closest(".process_inner").find("[name='price']").trigger("change");
    });
    
});

// 원가 총액 - 자재비,외주비 계산
function getTotalMaterialCost() {
    let material_cost = 0;
    let outsourcing_cost = 0;

    $("#t_material tbody tr").each(function() {
        const type = $(this).find("[name='type']").val();
        const amount = removeComma($(this).find(`[name='amount'].${type}`).val() || 0);

        if(type == 'material') material_cost += amount;
        else outsourcing_cost += amount;
    });

    $("[name='material_cost']").val(addCommas(material_cost || 0)).trigger("change");
    $("[name='outsourcing_cost']").val(addCommas(outsourcing_cost || 0)).trigger("change");
}

function addRow() {
    const material_option_data = $(".material_option_data").html();
    let html = '';

    html += `<tr>`;
    html += `    <td>`;
    html += `        <select name="type" class="select2_form">`;
    html += `            <option value="material">자재</option>`;
    html += `            <option value="out">외주</option>`;
    html += `        </select>`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <div class="material">`;
    html += `            <select name="name" class="select2_form">`;
    html +=                 material_option_data
    html += `            </select>`;
    html += `        </div>`;
    html += `        <input type="text" name="name" class="data-input out hidden">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="unit_price" class="data-input txt_right input_control material" disabled>`;
    html += `        <input type="text" name="unit_price" class="data-input txt_right input_control fixed_num out hidden">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="unit" class="data-input txt_right material" disabled>`;
    html += `        <input type="text" name="unit" class="data-input txt_right out hidden">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="quantity" class="data-input txt_right input_control fixed_num material">`;
    html += `        <input type="text" name="quantity" class="data-input txt_right input_control fixed_num out hidden">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="amount" class="data-input txt_right material" disabled>`;
    html += `        <input type="text" name="amount" class="data-input txt_right out hidden" disabled>`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <div class="file_box flex-around">`;
    html += `            <input type="file" id="material_upload_file_${cnt}" class="file_upload etc data" name="material_upload_file">`;
    html += `            <input type="text" class="data-input file_url" disabled>`;
    html += `            <label class="common-btn common-btn--upload" for="material_upload_file_${cnt}">찾기</label>`;
    html += `        </div>`;
    html += `        <span class="dynamic-btn minus" onclick="deleteRow(this);">-</span>`;
    html += `    </td>`;
    html += `</tr>`;

    $("#t_material tbody").append(html);

    cnt++;
}

function deleteRow(self) {
    $(self).closest("tr").remove();
}

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

function updateData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();
    const status = $("[name='object_status']").val();
    const formData = new FormData();
    const order_process = [];
    const order_material_outsourcing = [];
    let obj;
    let IS_DATA = true;

    // 기본 정보
    const is_export = $("[name='is_export']:checked").val();
    const company_toggle = $(".edit-form__inner#base [name='toggle']").prop("checked");
    const company_id = $(".edit-form__inner#base [name='company']").val() || null;    
    const pjt_name = $(".edit-form__inner#base [name='pjt_name']").val();
    const registration_date = $(".edit-form__inner#base [name='registration_date']").val() || null;
    const account_id = $(".edit-form__inner#base [name='account']").val() || null;
    const special_note = $(".edit-form__inner#base [name='special_note']").val() || [];
    const delivery_method = $(".edit-form__inner#base [name='delivery_method']").val();
    const due_date = $(".edit-form__inner#base [name='due_date']").val() || null;
    const memo = $(".edit-form__inner#base [name='memo']").val();
    const manager_name = $(".edit-form__inner#base [name='manager_name']").val();
    const manager_phone = $(".edit-form__inner#base [name='manager_phone']").val();
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

    // 비용
    const process_price = removeComma($(".edit-form__inner#cost [name='process_price']").val() || 0);
    const material_price = removeComma($(".edit-form__inner#cost [name='material_price']").val() || 0);
    const outsourcing_price = removeComma($(".edit-form__inner#cost [name='outsourcing_price']").val() || 0);
    const etc_price = removeComma($(".edit-form__inner#cost [name='etc_price']").val() || 0);

    // 공정
    $(".process_wrap .process_inner:not('.notExist')").each(function() {
        const pk = $(this).data("id");
        const process = $(this).find(".process").text();
        const ordering = $(this).data("ordering");
        const is_active = $(this).find("[name='process']").prop("checked");
        let price = removeComma($(this).find("[name='price']").val() || 0);

        if(!is_active) price = 0;

        order_process.push({
            pk : pk,
            process : process,
            ordering : ordering,
            is_active : is_active,
            price : price,
        });
    });

    /* 필수항목 유효성 검사 */
    if($(".process_inner [name='process']:checked").length == 0) {
        alert("적어도 하나의 공정을 선택해주세요.");
        return false;
    }

    // 자재 및 외주 정보
    $("#t_material tbody tr").each(function() {
        const material_id = $(this).find("select[name='name']").val() || null;
        const type = $(this).find("[name='type']").val();
        const quantity = removeComma($(this).find(`[name='quantity'].${type}`).val() || 0);
        const unit_price = removeComma($(this).find(`[name='unit_price'].${type}`).val() || 0);
        const unit = $(this).find(`[name='unit'].${type}`).val();
        const price = removeComma($(this).find(`[name='amount'].${type}`).val() || 0);
        const upload_file = $(this).find("[name='material_upload_file']")[0].files[0] || '';
        const is_file = upload_file ? 'Y' : 'N';
        let name;
        
        if(type == 'material') {
            name = $(this).find("select[name='name'] option:selected").text();            
        } else {
            name = $(this).find("input[name='name']").val();
        }

        /* 필수항목 유효성 검사 */
        /*
        if(type == 'material' && !material_id) {
            alert("자재를 선택해주세요.");
            $(this).find("select[name='name']").focus();

            IS_DATA = false;
            return false;
        }

        if(type == 'out' && !name) {
            alert("외주명을 입력해주세요.");
            $(this).find("input[name='name']").focus();

            IS_DATA = false;
            return false;
        }
        */

        if((type == 'material' && material_id) || (type == 'out' && name)) {
            order_material_outsourcing.push({
                material_id : material_id,
                sort : type,
                name : name,
                unit_price : unit_price,
                unit : unit,
                cnt : quantity,
                price : price,
                is_file : is_file
            });
        }

        if(is_file == 'Y') formData.append("upload_file", upload_file);
    });

    // 파일
    $(".edit-form__inner#file .data-form").each(function() {
        const upload_file = $(this).find("[name='upload_file']")[0].files[0] || '';
        const is_file = upload_file ? 'Y' : 'N';

        if(is_file == 'Y') formData.append("order_file", upload_file);
    });

    obj = {
        is_export : is_export,
        company_name : company_name,
        pjt_name : pjt_name,
        registration_date : registration_date,
        account_id : account_id,
        special_note : special_note,
        delivery_method : delivery_method,
        due_date : due_date,
        memo : memo,

        process_price : process_price,
        material_price : material_price,
        outsourcing_price : outsourcing_price,
        etc_price : etc_price,

        order_process : order_process,
        // order_material_outsourcing : order_material_outsourcing,
    }

    if(status != 'COMPLT') obj['order_material_outsourcing'] = order_material_outsourcing

    if(company_toggle) {
        obj['manager_name'] = ''
        obj['manager_phone'] = ''

    } else {
        // obj['company_id'] = company_id
        obj['manager_name'] = manager_name
        obj['manager_phone'] = manager_phone
    }
    
    formData.append("csrfmiddlewaretoken",token);
    formData.append("obj", JSON.stringify(obj));    
    
    if(IS_DATA) {
        // console.log(obj);

        // for(let i of formData.entries()) {
        //     console.log(i[0]);
        //     console.log(i[1]);
        // }

        $.ajax({
            url: `/sales/api/order/mod/${pk}`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function(xhr, settings) {
                $(".load_bg").addClass('load_display');
            },
            success:function(data) {
                location.href=`/sales/order/${pk}/detail`;
            },
            error:function(request, status, error) {
                alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
            }
        })
    }
}