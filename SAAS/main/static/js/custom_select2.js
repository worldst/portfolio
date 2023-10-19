let g_observer;

$(function() {
    // Mutation Observer
    // 감시 대상 node 선택
    let target = document.getElementsByTagName("body")[0];

    // 감시자 인스턴스 만들기
    g_observer = new MutationObserver((mutations) => {
        // 노드가 변경 됐을 때의 작업
        mutations.forEach(function(mutation, idx) {
            if(mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(element, index) {
                    if($(element).prop("tagName") == 'TR') {
                        $(element).find("td").each(function() {
                            if($(this).find("select").hasClass("select2_form")) {
                                ApplySearchSelectForm("select2_form");
                            }
                        });

                    } else {
                        if($(element).hasClass("select2_form")) {
                            ApplySearchSelectForm("select2_form");
                        }
                    }
                });
            }
        });
    })

    // 감시자의 설정
    const option = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree : true
    };

    // 대상 노드에 감시자 전달
    if(target) g_observer.observe(target, option);

    ApplySearchSelectForm("select2_form");
});

function ApplySearchSelectForm(select) {
    $(`.${select}`).select2({
        width: "100%",
        matcher: function(params, data) {
            const term = params.term != undefined ? params.term.toLowerCase() : ''
            const original = data.text != undefined ? data.text.toLowerCase() : ''

            if($.trim(params.term) == '') {
                return data;
            }

            if(data.id && original.indexOf(term) > -1) {
                return data;
            }

            return null;
        },
        sorter: function(data) {
            return data.sort(function(a,b) {
                if(a && b) {
                    if(a.title != 'choice' && b.title != 'choice') {
                        return a.text.localeCompare(b.text)
                    }
                }
            })
        },
    });
}