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
        url: 'https://my-json-server.typicode.com/worldst/json-server/company',
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