$(function () {

    /* GNB 마우스 오버 & 다운 시 */
    $("ul.gnb > li").mouseover(function () {
        $(this).find('.gnb_depth').css("display", "block");
        $(this).children('.menu_title').css("color", "#ff4f4f");
    }).mouseleave(function () {
        $(this).find('.gnb_depth').css("display", "none");
        $(this).children('.menu_title').css("color", "black");
    });

    /* 모바일 메뉴 */
    $(".m_menu_btn").click(function () {
        $(".m_bg").css("display", "block")
            .find('.m_wrap').animate({
                left: "0"
            }, 300);
        $("body").css("overflow", "hidden");
    });

    $(".m_close > img").click(function () {
        $(".m_bg").css("display", "none")
            .find('.m_wrap').animate({
                left: "-260px"
            }, 300);
        $("body").css("overflow", "auto");
    });

    $(".m_gnb > li > span").append("<img class='down-arrow' src='img/down_arrow3.png' alt='화살표'>");
    
    $(".m_gnb > li > span").click(function() {
        $(this).next('ul.m_gnb_depth').slideToggle(400);
        $(this).parent().toggleClass('act');
        $(this).find('.down-arrow').toggleClass('rotate');
    });
});
