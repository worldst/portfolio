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
});

function addRow() {
    const account_data = $(".account_data").html();
    let html = '';

    html += `<tr>`;
    html += `    <td>`;
    html += `        <select name="account" class="select2_form">`;
    html +=             account_data
    html += `        </select>`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <select name="method" class="select2_form">`;
    html += `            <option value="" title="choice">선택</option>`;
    html += `            <option value="택배">택배</option>`;
    html += `            <option value="화물">화물</option>`;
    html += `            <option value="픽업">픽업</option>`;
    html += `        </select>`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="memo" class="data-input">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="name" class="data-input">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="phone_number" class="data-input">`;
    html += `    </td>`;
    html += `    <td>`;
    html += `        <input type="text" name="car_number" class="data-input">`;
    html += `        <span class="dynamic-btn minus" onclick="deleteRow(this);">-</span>`;
    html += `    </td>`;
    html += `</tr>`;

    $("#t_shipment tbody").append(html);
}

function deleteRow(self) {
    $(self).closest("tr").remove();
}

function addRowFile(type) {
    let html = '';

    html += `<div class="data-form">`;
    html += `    <div class="row_title">업로드 파일</div>`;
    html += `    <div class="file_box flex-around">`;
    if(type == 'img') {
        html += `        <input type="file" id="upload_${type}_${cnt}" class="file_upload etc data" name="upload_file" accept=".jpg,.jpeg,.png">`;
    } else {
        html += `        <input type="file" id="upload_${type}_${cnt}" class="file_upload etc data" name="upload_file">`;
    }
    html += `        <input type="text" class="data-input file_url" disabled>`;
    html += `        <label class="common-btn common-btn--upload" for="upload_${type}_${cnt}">찾기</label>`;
    html += `    </div>`;
    html += `    <span class="dynamic-btn minus" onclick="deleteRowFile(this);">-</span>`;
    html += `</div>`;

    if(type == 'file') $(".edit-form__inner#file").append(html);
    else $(".edit-form__inner#img").append(html);

    cnt++;
}

function deleteRowFile(self) {
    $(self).closest(".data-form").remove();
}

function updateData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();
    const formData = new FormData();
    const shipment_data = [];
    let obj;
    let IS_DATA = true;

    // 출하 정보
    $("#t_shipment tbody tr").each(function() {
        const account_id = $(this).find("[name='account']").val() || null;
        const method = $(this).find("[name='method']").val() || '';
        const memo = $(this).find("[name='memo']").val() || '';
        const name = $(this).find("[name='name']").val() || '';
        const phone_number = $(this).find("[name='phone_number']").val() || '';
        const car_number = $(this).find("[name='car_number']").val() || '';

        if(account_id || method || memo || name || phone_number || car_number) {
            shipment_data.push({
                account_id : account_id,
                method : method,
                memo : memo,
                name : name,
                phone_number : phone_number,
                car_number : car_number,
            });
        }
    });

    // 파일
    $(".edit-form__inner#file .data-form").each(function() {
        const upload_file = $(this).find("[name='upload_file']")[0].files[0] || '';
        const is_file = upload_file ? 'Y' : 'N';

        if(is_file == 'Y') formData.append("shipment_file", upload_file);
    });

    // 사진
    $(".edit-form__inner#img .data-form").each(function() {
        const upload_file = $(this).find("[name='upload_file']")[0].files[0] || '';
        const is_file = upload_file ? 'Y' : 'N';

        if(is_file == 'Y') formData.append("shipment_img", upload_file);
    });

    obj = {
        shipment_data : shipment_data,
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
            url: `/sales/api/order/shipment/${pk}/mod`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function(xhr, settings) {
                $(".load_bg").addClass('load_display');
            },
            success:function(data) {
                location.href=`/sales/order/shipment/${pk}/detail`;
            },
            error:function(request, status, error) {
                alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
            }
        })
    }
}