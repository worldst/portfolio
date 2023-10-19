$(function() {
    /* 셀렉트 + 검색기능 */
    $("select[name='type']").addClass('js-choice-type');

    const select_box = ["type"];

    for(let i=0; i<select_box.length; i++) {
        const element = document.querySelector(`.js-choice-${select_box[i]}`);
        const choices = new Choices(element, {
            searchResultLimit : 1000,
            searchFields : ['label']
        });

        const $dropdown_list = $(`select[name='${select_box[i]}']`).parent().next();

        $dropdown_list.find(".choices__input").keyup(function() {
            const inputValue = $(this).val().toUpperCase();

            $dropdown_list.find(".choices__item--choice").each(function() {
                const searchValue = $(this).text().toUpperCase();
                
                if(searchValue.indexOf(inputValue) < 0) {
                    $(this).remove();
                }
            });

            if ($.trim($dropdown_list.find(".choices__list").html()) === '') { 
                $dropdown_list.find(".choices__list").html("<div class='choices__item choices__item--choice has-no-results'>No results found</div>");
            }
        });
    }
});