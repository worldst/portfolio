function formSubmit() {
    const required_items = ["title", "address"];
    const formData = $("form").serialize();

    for(let i=0; i<required_items.length; i++) {
        if(!$(`[name='${required_items[i]}']`).val()) {
            $(`[name='${required_items[i]}']`).next().show();
            $(`[name='${required_items[i]}']`).focus();

            return;
        }
    }
    
    $.ajax({
        url: 'http://127.0.0.1:3001/company',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function (data) {
            location.href = '../../public/company/list.html';
        },
        error: function (request, status, error) {
            console.log(`Code: ${request.status}, Message: ${request.responseText}, Error: ${error}`);
        }
    });
}