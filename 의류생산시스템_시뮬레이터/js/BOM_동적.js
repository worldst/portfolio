let success_count = 0;

$(function() {
    // 변경 이력
    $(".fixed_button .icon").mouseenter(function() {
        $(this).next(".title").stop().animate({
            "opacity" : "1",
            "bottom" : "113%"
        }, 150);
    }).mouseleave(function() {
        $(this).next(".title").stop().animate({
            "opacity" : "0",
            "bottom" : "105%"
        }, 150);
    });

    $(".fixed_button .icon").click(function() {
        $(".fixed_button").fadeOut(150, function() {
            $(".record_box").fadeIn(150);
        });
    });

    $(".record_title .record_close").click(function() {
        $(".record_box").fadeOut(150, function() {
            $(".fixed_button").fadeIn(150);
        });
    });
    
    drawingBOM();
});

function drawingBOM() {
    let levels = [];
    let max_level;
    let html = '';
    
    html += `<div class='detail-view'>`;
    html += `   <table>`;
    html += `      <colgroup>`;
    html += `          <col width="10%">`;
    html += `          <col width="20%">`;
    html += `          <col width="30%">`;
    html += `          <col width="40%">`;
    html += `      </colgroup>`;
    html += `      <thead>`;
    html += `          <tr>`;
    html += `              <th>수량</th>`;
    html += `              <th>도면번호</th>`;
    html += `              <th>품명</th>`;
    html += `              <th>규격</th>`;
    html += `          </tr>`;
    html += `      </thead>`;
    html += `      <tbody>`;
    html += `      </tbody>`;
    html += `   </table>`;
    html += `</div>`;

    // max_level 구하기
    $("table.hidden tbody tr").each(function() {
        const $tr = $(this);
        const level = $tr.data('level');
        
        levels.push(level);
    });

    max_level = Math.max.apply('null', levels);

    // max_level 만큼 테이블 그리기
    for(let i=0; i<=max_level; i++) {
        $(".detail-wrap").append(html);
    }

    // 빈 값 설정
    let empty = '';

    empty += `<tr class='tr_empty'>`;
    empty += `  <td colspan='4' class='empty'>empty</td>`;
    empty += `</tr>`;

    // 각 테이블 내 데이터 뿌리기
    let count = 0;

    $("table.hidden tbody tr").each(function() {
        const $tr = $(this);
        const $tr_clone = $tr.clone();                                      // 기존 값이 사라지므로 clone 을 통해 상태 유지
        const level = $tr.data('level');                                    // 해당 도면번호 깊이(단계)
        const $temp = $(".version-2 .detail-wrap .detail-view").eq(level);  // 깊이에 대한 테이블 위치

        $temp.find('tbody').append($tr_clone[0]);

        if($tr.prev().data('level') < level && $tr.next().data('level') <= level) {
            // 현재 노드 = 이전 노드의 첫번째 자식
            count++;
            
            // 첫 행에서만 처리하도록 설계
            if(count == 1) {     
                for(let i=max_level; i>level; i--) {
                    $temp.closest('.detail-wrap').find('.detail-view').eq(i).find('tbody').append(empty);
                }
            } 
            // 첫 행 이후부터는 다음 노드의 값에 따라 처리
            // 현재 노드가 다음 노드보다 크거나 같으면(= 다음노드가 현재 노드의 자식이 아니면) 현재 노드 깊이 + 1 ~ 최대 노드 깊이 까지 empty 
            else {
                if($tr.next().data('level') <= level) {
                    for(let i=max_level; i>level; i--) {
                        $temp.closest('.detail-wrap').find('.detail-view').eq(i).find('tbody').append(empty);
                    }
                }
            }
        }
        if($tr.prev().data('level') == level && $tr.next().data('level') <= level) {
            // 이전 노드와 부모가 같으면서 자식이 없는 경우
            $temp.closest('.detail-wrap').find('.detail-view').not(`:eq(${level})`).find('tbody').append(empty);
        } else if($tr.prev().data('level') == level && $tr.next().data('level') > level) {
            // 이전 노드와 부모가 같으면서 자식이 있는 경우
            for(let i=0; i<level; i++) {
                $temp.closest('.detail-wrap').find('.detail-view').eq(i).find('tbody').append(empty);
            }
        } else if($tr.prev().data('level') > level && $tr.next().data('level') > level) {
            // 이전 노드와 깊이가 달라지면서 자식이 있는 경우
            for(let i=0; i<level; i++) {
                $temp.closest('.detail-wrap').find('.detail-view').eq(i).find('tbody').append(empty);
            }
        } else if($tr.prev().data('level') > level && $tr.next().data('level') <= level) {
            // 이전 노드와 깊이가 달라지면서 자식이 없는 경우
            $temp.closest('.detail-wrap').find('.detail-view').not(`:eq(${level})`).find('tbody').append(empty);
        } else if($tr.prev().data('level') == level) {
            // 마지막 자식 처리를 위함
            $temp.closest('.detail-wrap').find('.detail-view').not(`:eq(${level})`).find('tbody').append(empty);
        }
    });

    /* 상단 스크롤 바 가로 길이 정의 */
    const len_table = $(".detail-wrap .detail-view").length;
    let all_table_width = len_table * 500;
    let table_margin = (len_table - 1) * 10;

    $(".row-scroll.top .scroll").width(all_table_width + table_margin + "px");

    // 스크롤바 제어
    $(".row-scroll.top").scroll(function() {
        $(".row-scroll.bot").scrollLeft($(".row-scroll.top").scrollLeft());
    });

    $(".row-scroll.bot").scroll(function() {
        $(".row-scroll.top").scrollLeft($(".row-scroll.bot").scrollLeft());
    });

    // 접기 / 펼치기
    $(".toggle-box .minus").click(function() {
        $(this).hide();
        $(this).closest('.toggle-box').children('.plus').css('display','inline-block');
        const idx = $(this).parent().parent().index();

        for(let i=(idx + 1); i<len_table; i++) {
            $('.detail-wrap').find('.detail-view').eq(i).css('visibility','hidden');
            $('.detail-wrap').find('.detail-view .plus').eq(i).css('display','none');
            $('.detail-wrap').find('.detail-view .minus').eq(i).css('display','inline-block');
        }
    });

    $(".toggle-box .plus").click(function() {
        $(this).hide();
        $(this).closest('.toggle-box').children('.minus').css('display','inline-block');
        const idx = $(this).parent().parent().index();

        for(let i=(idx + 1); i<len_table; i++) {
            $('.detail-wrap').find('.detail-view').eq(i).css('visibility','visible');
        }
    });

    // Drag & Drop
    $(".detail-view table:not(':eq(0)') tbody tr:not('.tr_empty')").draggable({
        containment : ".row-scroll.bot",
        appendTo : "body",
        cursor : "move",
        helper : "clone",
        revert : "invalid",
        revertDuration : 300,
        // cancel : $(".detail-view:first-child table tbody tr:not('.tr_empty')"),
        start : function(event, ui) {
            $(this).addClass("active");
            $(ui.helper).width($(this).width());
            $(ui.helper).addClass("helper");
        },
        stop : function(event, ui) {
            $(this).removeClass("active");
        }
    });

    $(".detail-view table tbody tr:not('.tr_empty')").droppable({
        accept: "tr",
        hoverClass: "drop-hover",
        tolerance : "pointer",
        drop: function (event, ui) {
            const tr_length = $("table.hidden tbody tr").length;
            const drag_id = $(ui.draggable).data("id");
            const drag_level = $(ui.draggable).data("level");
            const drop_id = $(this).data("id");
            const drop_level = $(this).data("level");

            $("[name='tr_length']").val(tr_length);
            $("[name='drag_id']").val(drag_id);
            $("[name='drag_level']").val(drag_level);
            $("[name='drop_id']").val(drop_id);
            $("[name='drop_level']").val(drop_level);
            
            // 해당 자식노드에게는 이동이 불가하도록 처리
            let pk_list = [];

            $("table.hidden tbody tr").each(function(tr_idx) {
                const object_id = $(this).data("id");

                if(object_id == drag_id) {
                    for(let i=tr_idx; i<tr_length; i++) {
                        const $tr = $("table.hidden tbody tr").eq(i);
                        const level = $tr.data('level');
                        const id = $tr.data('id');

                        if(i > tr_idx) {                            
                            if(level <= $("table.hidden tbody tr").eq(tr_idx).data("level")) {
                                return false;
                            } else {                                
                                pk_list.push(id);
                            }
                        }
                    }
                }
            });

            for(let i=0; i<pk_list.length; i++) {
                if(drop_id == pk_list[i]) {
                    $(".errorModal").show();
                    return false;
                }
            }

            $(".selectedInputModal").show();
        }
    });
}

function changeBOM(tr_length, drag_id, drag_level, drop_id, drop_level, quantity) {
    let html = '';
    let pk_list = [];

    // 선택 품목 자식 파악
    $("table.hidden tbody tr").each(function(tr_idx) {
        const object_id = $(this).data("id");

        if(object_id == drag_id) {
            for(let i=tr_idx; i<tr_length; i++) {
                const $tr = $("table.hidden tbody tr").eq(i);
                const $tr_clone = $tr.clone();
                const level = $tr.data('level');
                const id = $tr.data('id');

                if(i == tr_idx) {                            
                    html += $tr_clone[0].outerHTML;
                    pk_list.push(id);
                } else {
                    if(level <= $("table.hidden tbody tr").eq(tr_idx).data("level")) {
                        return false;
                    } else {                                
                        html += $tr_clone[0].outerHTML;
                        pk_list.push(id);
                    }
                }
            }
        }
    });

    // 파악된 자식을 MPTT 테이블에서 삭제
    $("table.hidden tbody tr").each(function() {
        const object_id = $(this).data("id");

        for(let i=0; i<pk_list.length; i++) {
            if(pk_list[i] == object_id) {
                $(this).remove();
            }
        }
    });

    // MPTT 테이블 갱신
    let resultHTML = '';

    $("table.hidden tbody tr").each(function() {
        const object_id = $(this).data("id");

        if(drop_id == object_id) {
            const parseHTML = $.parseHTML(html);
            const first_obj_level = $(parseHTML[0]).data("level");

            $.each(parseHTML, function(index, value) {
                const level = $(value).data("level");

                $(value).attr("data-level", Number(drop_level) + (Number(level) - first_obj_level) + 1);

                if(index == 0) {
                    $(value).find("td:eq(0)").text(quantity);
                }

                resultHTML += value.outerHTML;
            });

            $(this).after(`${resultHTML}`);
        }
    });
    
    // 서버에 전달할 데이터 포맷 정의
    let obj = {};

    $("table.hidden tbody tr").each(function() {
        const object_id = $(this).data("id");
        const quantity = $(this).find("td:eq(0)").text();
        const drawing_number = $(this).find("td:eq(1)").text();
        const name = $(this).find("td:eq(2)").text();
        const spec = $(this).find("td:eq(3)").text();
        let type;

        if(drag_level == drop_level) {
            type = 'equal';
        } else if(drag_level > drop_level) {
            type = 'childToParent';
        } else {
            type = 'parentToChild';
        }

        if(drag_id == object_id) {
            const from = {
                "id" : drag_id,
                "number" : drawing_number,
                "level" : drag_level,
                "name" : name,
                "spec" : spec
            }

            obj["type"] = type;
            obj["quantity"] = quantity;
            obj["from"] = from;
        }

        if(drop_id == object_id) {
            const to = {
                "id" : drop_id,
                "number" : drawing_number,
                "level" : drop_level,
                "name" : name,
                "spec" : spec
            }

            obj["to"] = to;
        }
    });

    console.log(obj);

    // 변경 내역 데이터 저장
    const current_time = moment().format("YYYY-MM-DD hh:mm:ss");
    let dataHTML = '';

    dataHTML += `<div class="record_list">`;
    dataHTML += `    <p>`;
    dataHTML += `        <span class="strong">${obj.from.number} / ${obj.from.name}<span class="level">[${obj.from.level}]</span></span> 을(를) <span class="strong">${obj.to.number} / ${obj.to.name}<span class="level">[${obj.to.level}]</span></span> 의 하위품목으로 변경하였습니다.`;
    dataHTML += `    </p>`;
    dataHTML += `    <div class="date">${current_time}</div>`;
    dataHTML += `</div>`;

    if($(".record_body .no_data").length > 0) {
        $(".record_body .no_data").remove();
    }

    $(".record_body").prepend(dataHTML);

    // BOM 갱신
    $(".detail-wrap").empty();

    drawingBOM();

    /*
    const token = $("input[name='csrfmiddlewaretoken']").val();

    $.ajax({
        url: "",
        type: 'POST',
        data: {
            csrfmiddlewaretoken: token,
            obj : obj
        },
        success:function(data) {
            // 저장 메시지 안내 창 코드 삽입 위치
        }
    });
    */

    // 저장 이후 변경 메시지 안내 창
    success_count++;

    let successHTML = '';

    successHTML += `<div class="box" id="${success_count}">`;
    successHTML += `    <img src="img/success.png" alt="성공">`;
    successHTML += `    <span class="content">처리가 완료되었습니다.</span>`;
    successHTML += `</div>`;

    $(".success_box").append(successHTML);

    $(`.success_box #${success_count}`).animate({
        "opacity" : 0.9
    }, 300, function() {
        setTimeout(() => {
            $(this).fadeOut(1000, function() {
                $(this).remove();
            });
        }, 500);
    });
}

// 수량 알림 모달
function selectedInput(type) {
    const tr_length = $("[name='tr_length']").val();
    const drag_id = $("[name='drag_id']").val();
    const drag_level = $("[name='drag_level']").val();
    const drop_id = $("[name='drop_id']").val();
    const drop_level = $("[name='drop_level']").val();

    if(type == 'cancel') {
        changeBOM(tr_length, drag_id, drag_level, drop_id, drop_level);
        $(".selectedInputModal").hide();
        $(".inputQuantityModal").hide();

    } else {
        $("table.hidden tbody tr").each(function() {
            const object_id = $(this).data("id");
            let quantity;
            let drawing_number;
            let name;
            let spec;

            if(object_id == drag_id) {
                quantity = $(this).find("td:eq(0)").text();
                drawing_number = $(this).find("td:eq(1)").text();
                name = $(this).find("td:eq(2)").text();
                spec = $(this).find("td:eq(3)").text();
                
                let html = '';

                html += `<tr>`;
                html += `    <td><input type="text" name="quantity" class="form-control alignRight fixed_num" value="${quantity}"></td>`;
                html += `    <td>${drawing_number}</td>`;
                html += `    <td class="alignLeft">${name}</td>`;
                html += `    <td class="alignLeft">${spec}</td>`;
                html += `</tr>`;

                $(".inputQuantityModal .modal_table tbody").empty();
                $(".inputQuantityModal .modal_table tbody").append(html);
            }
        });

        $(".selectedInputModal").hide();
        $(".inputQuantityModal").show();
    }
}

// 수량 입력 모달
function inputQuantity() {
    const tr_length = $("[name='tr_length']").val();
    const drag_id = $("[name='drag_id']").val();
    const drag_level = $("[name='drag_level']").val();
    const drop_id = $("[name='drop_id']").val();
    const drop_level = $("[name='drop_level']").val();

    const quantity = $(".inputQuantityModal .modal_table tbody tr").find("[name='quantity']").val();

    if(quantity == '' || quantity == 0) {
        alert("올바른 수량을 입력해주세요.");
        return false;
    }

    changeBOM(tr_length, drag_id, drag_level, drop_id, drop_level, quantity);
    $(".inputQuantityModal").hide();
}

// 모달 닫기
function closeModal() {
    $(".errorModal").hide();
}