$(function() {
    // 기존 셀렉트 데이터 셋팅
    $(".select_tag").each(function() {
        const before_data = $(this).data("before");

        if(before_data != '-') {
            $(this).val(before_data).trigger("change");
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

    // 자재 및 외주정보 - 금액 계산
    $(document).on("keyup change","#t_material .input_control",function() {
        const $tr = $(this).closest("tr");
        let unit_price;
        let quantity;
        let amount = 0;
        
        unit_price = removeComma($tr.find(`[name='unit_price']`).val() || 0);
        quantity = removeComma($tr.find(`[name='quantity']`).val() || 0);

        amount = unit_price * quantity;

        $tr.find(`[name='amount']`).val(addCommas(amount || ''));

        // 금액 합산
        getTotalPriceCost();
    });

    // 자재 및 외주정보 - 자재 조회
    $(document).on("keyup change","select[name='name']",function() {
        const $tr = $(this).closest("tr");
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

            $tr.find(`[name='unit_price']`).val(addCommas(unit_price)).trigger("keyup");
            $tr.find(`[name='unit']`).val(unit);

        } else {
            $tr.find(`[name='unit_price']`).val("");
            $tr.find(`[name='unit']`).val("");
        }
    });
});

// 총금액
function getTotalPriceCost() {
    let total_price = 0;

    $("#t_material tbody tr").each(function() {
        const amount = removeComma($(this).find(`[name='amount']`).val() || 0);
        total_price += amount;
    });

    $("[name='price']").val(addCommas(total_price || 0)).trigger("change");
}

function addRow() {
    const material_option_data = $(".material_option_data").html();
    let html = '';

    html += `<tr>`;
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
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="unit" class="data-input txt_right material" disabled>`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="quantity" class="data-input txt_right input_control fixed_num material">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="amount" class="data-input txt_right material" disabled>`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <div class="file_box flex-around">`;
    html += `            <input type="text" name="memo" class="data-input material">`;
    html += `        </div>`;
    html += `        <span class="dynamic-btn minus" onclick="deleteRow(this);">-</span>`;
    html += `    </td>`;
    html += `</tr>`;

    $("#t_material tbody").append(html);
}

function deleteRow(self) {
    $(self).closest("tr").remove();
}


function updateData(pk) {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    let IS_DATA = true;
    const material_purchase_list = []

    // 기본 정보
    const company_toggle = $(".edit-form__inner#base [name='toggle']").prop("checked");
    const company_id = $(".edit-form__inner#base [name='company']").val() || null;    
    const name = $(".edit-form__inner#base [name='name']").val();
    const purchase_date = $(".edit-form__inner#base [name='purchase_date']").val() || null;
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

    if(!name) {
        alert("발주건명을 입력해주세요.");
        $("[name='name']").focus();
        return false;
    }

   

    // 자재 정보
    $("#t_material tbody tr").each(function() {
        const material_id = $(this).find("select[name='name']").val() || null;
        const quantity = removeComma($(this).find(`[name='quantity']`).val() || 0);
        const unit_price = removeComma($(this).find(`[name='unit_price']`).val() || 0);
        const unit = $(this).find(`[name='unit']`).val();
        const price = removeComma($(this).find(`[name='amount']`).val() || 0);
        const memo = $(this).find(`[name='memo']`).val();
        const name =$(this).find("select[name='name'] option:selected").text(); 

        /* 필수항목 유효성 검사 */
        if(!material_id) {
            alert("자재를 선택해주세요.");
            $(this).find("select[name='name']").focus();

            IS_DATA = false;
            return false;
        }

        material_purchase_list.push({
            material_id : material_id,
            unit_price : unit_price,
            unit : unit,
            cnt : quantity,
            price : price,
            memo : memo
        });
    });

    
    obj = {
        company_name : company_name,
        name : name,
        purchase_date : purchase_date,
        account_id : account_id,
        special_note : special_note,
        price : price,
        due_date : due_date,
        memo : memo,

        material_purchase_list : material_purchase_list,
    }

    if(IS_DATA) {
     
        $.ajax({
            url: `/material/api/purchase/mod/${pk}`,
            type: 'POST',
            data: JSON.stringify(obj),
            contentType: "application/json",
            beforeSend: function(xhr, settings) {
                if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", token);
                    $(".load_bg").addClass('load_display');
                }
            },
            success:function(data) {
                location.href=`/material/purchase/${pk}/detail`;
            },
            error:function(request, status, error) {
                alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
            }
        })
    }
}