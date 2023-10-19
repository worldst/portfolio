function CheckSubmit() {
    /* 필수항목 유효성 검사 */
    const required = ['name'];
    
    for(let i=0; i<required.length; i++) {
        if(!$(`[name='${required[i]}']`).val()) {
            if(required[i] == 'name') {
                alert("부서명을 입력해주세요.");
            }

            $(`[name='${required[i]}']`).focus();

            return;
        }
    }

    $('form').submit();
}