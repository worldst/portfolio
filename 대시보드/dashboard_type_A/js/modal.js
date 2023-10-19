/* Modal Type 1 */
function openModal() {
    var offsetTop = $(window).scrollTop();
    $(".modal-wrap").css("top", offsetTop);
    $(".modal-a").css("display", "flex");
    $(".modal-box").animate({
        marginTop : 0,
        opacity : 1
    },500);
    $("body").css("overflow", "hidden");
}

function closeModal() {
    $(".modal-wrap").css("display", "none");
    $(".modal-box").css({
        marginTop : 20,
        opacity : 0
    });
    $("body").css("overflow", "auto");
}