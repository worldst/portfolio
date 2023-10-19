$(function() {
    $(document).on("keydown", "[name='search_qrcode']", function(key) {
        const search_qrcode = $(this).val();
        const process = $("[name='instruction_process']").val();

        if(key.keyCode == 13) {
            if(!search_qrcode) return false;

            if(search_qrcode) {                
                $.ajax({
                    async: false,
                    url: '/material/api/purchase/search/',
                    type: 'GET',
                    data: {
                        num : search_qrcode,
                    },
                    success: function(data) {
                        // console.log(data);
                        if(data.result == 'no_order') {
                            alert("존재하지 않는 발주번호 입니다.");
                            return false;

                        }else if(data.result == 'cancel') {
                            alert("이미 취소 처리된 발주 입니다.");
                            return false;

                        }else{
                            location.href = `/material/purchase/${data.id}/detail`
                        }
                    }
                });
            }
        }
    });
});