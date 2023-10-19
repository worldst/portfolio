/* Progress Type 1 */
function openProgress() {
    var offsetTop = $(window).scrollTop();
    $(".progress-wrap").css("top", offsetTop);

    $(".progress-a").css("display", "flex");
    $("body").css("overflow", "hidden");
    
    pgCountUp();

    setTimeout(() => {
        $(".progress-a").css("display", "none");
        $("body").css("overflow", "auto");
    }, 2500);
    
}

function pgCountUp() {
    /* 카운트 업 애니메이션 */
    $(".pg-count span").counterUp({
        delay : 10,
        time : 2200
    });
}
