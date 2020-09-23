$(function () {
    /* 필수 항목 값 입력 시 에러메세지 숨김 */
    $(".data-input, .data-select").on('change keyup', function() {
        if($(this).val().length > 0) {
            $(this).next().hide();
        }
    });

    /* 리스트 내 모두체크 처리 */
    $(".all_chk").change(function() {
        if($(this).prop('checked')) {
            $(".table tbody tr").each(function() {
                // 체크되어있지 않은 체크박스들은 체크
                if(!$(this).find(':checkbox').prop('checked')) {
                    $(this).find(':checkbox').trigger('click');
                }
            });
        } else {
            $(".table tbody tr").each(function() {
                // 체크되어있는 체크박스들은 체크해제
                if($(this).find(':checkbox').prop('checked')) {
                    $(this).find(':checkbox').trigger('click');
                }
            });
        }
    });

    /* 리스트 데이터 검색 시 엔터키 이벤트 */
    $(".search-data").keydown(function(key) {
        if(key.keyCode == 13) {
            $("#table-search-bar").trigger('click');
        }
    });
    
});

/* 데이터 조회 후 리스트 출력 시 빈 값 정렬 처리 */
function handlingEmptyValue() {
    $(".table tbody tr td").each(function() {
        const $td = $(this);

        if($td.text() == "-") {
            $td.removeClass();
        }
    });
}

/* 테이블 각 페이지 번호 이동 처리 */
function movePage() {
    $(".page li").on('click', function() {
        if(!$(this).hasClass('on')) {
            $(".page li").removeAttr("class");
            $(this).addClass("on");

            getResultData($(this).data('page'));
        }
        // 전체선택 체크박스가 True 인 경우 False 로 초기화
        setTimeout(() => {
            if($(".all_chk").prop('checked')) {
                $(".all_chk").prop('checked', false);
            }
        }, 100);
    });
}

/* Modal - 정보 삭제 */
function closeDelModal() {
    $(".delete-modal").hide();
}

function delModalOpen() {
    let checked_count = 0;

    // 체크된 개수 파악
    $(".table tbody tr").each(function() {
        if($(this).find(":checkbox").prop('checked')) {
            checked_count++;
        }
    });

    if(checked_count > 0) {
        // 리스트 내 1개 이상 체크 되어있는 경우
        $(".delete-modal").css('display','flex');
    } else {
        alert('삭제할 데이터를 선택해주세요.')
    }
}

function infoDel(obj) {
    let id;
    
    $(".table tbody tr").each(function() {
        const $this_checkbox = $(this).find(":checkbox");

        if($this_checkbox.prop('checked')) {
            // 추후 array 로 담고 ajax data 요청
            id = $this_checkbox.val();
        }
    });

    $.ajax({
        url: `https://my-json-server.typicode.com/worldst/json-server/${obj}/${id}`,
        type: 'DELETE',
        success: function (data) {
            location.reload();
        },
        error: function (request, status, error) {
            console.log(`Code: ${request.status}, Message: ${request.responseText}, Error: ${error}`);
        }
    });
}


/* 숫자만 기입하도록 제어 */
function PatternInspection(obj){
    var pattern_eng = /[a-zA-Z]/g;	// 영어
    var pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g; //한글
    var pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/g; // 특수문자

    obj = obj.replace(pattern_kor,'');
    obj = obj.replace(pattern_eng,'');
    obj = obj.replace(pattern_spc,'');
    obj = obj.replace(/-/g,'');
    
    return obj
}