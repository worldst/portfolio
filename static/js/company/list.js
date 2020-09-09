$(function() {
    $.ajax({
        url: 'http://127.0.0.1:3001/company',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            setTimeout(() => {
                $.each(data.reverse(), function (key, value) {
                    $(".total-info .total span").text(data.length);

                    let html = '';

                    html += `<tr>`;
                    html += `  <td><input type='checkbox' value='${value.id}'></td>`;
                    html += `  <td class="txt_left"><a href="view.html?id=${value.id}">${value.title}</a></td>`;
                    html += `  <td class="txt_left">${value.address}</td>`;
                    html += `  <td>${value.tel || '-'}</td>`;
                    html += `  <td>${value.uptae || '-'}</td>`;
                    html += `  <td class="txt_left">${value.jong || '-'}</td>`;
                    html += `  <td class="txt_left">${value.email || '-'}</td>`;
                    html += `  <td class="txt_left">${value.memo || '-'}</td>`;
                    html += `</tr>`;

                    $(".table tbody").append(html);
                });
            }, 400);
        },
        beforeSend: function() {
            $(".load-screen").addClass('display-block');
        },
        complete: function() {
            setTimeout(() => {
                handlingEmptyValue();
                $(".load-screen").removeClass('display-block');
            }, 400);
        },
        error: function (request, status, error) {
            console.log(`Code: ${request.status}, Message: ${request.responseText}, Error: ${error}`);
        }
    });
});