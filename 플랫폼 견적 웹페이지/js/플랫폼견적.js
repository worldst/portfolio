$(function() {
    let total_price = 0;

    $(".selected_box").change(function() {
        const prop = $(this).prop("checked");
        const price = removeComma($(this).closest("label.list__menu").find(".price span").text());

        if(prop) {
            $(this).closest("label.list__menu").css("border","1px solid #b1b1ff");

            total_price += price;
        } else {
            $(this).closest("label.list__menu").css("border","1px solid #d6d5d5");

            total_price -= price;
        }

        /* 카운트 업 애니메이션 */
        $(".fixed_side .total_price span").text(addCommas(total_price)).counterUp({
            delay : 1,
            time : 80
        });
    });

    $(window).scroll(function() {
        if($(window).scrollTop() > 100) {
            $(".header_bot").addClass("top_fixed");
        } else {
            $(".header_bot").removeClass("top_fixed");
        }
    })
});

/* 3자리 단위마다 콤마 생성 */
function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* 콤마 제거 */
function removeComma(str) {
    n = parseInt(str.toString().replace(/,/g, ""));
    return n;
}