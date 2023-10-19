$(function () {
    // file event
    $(document).on("change",".file_upload",function() {
        const fileURL = $(this).val();
        const fileSplit = fileURL ? fileURL.split("\\") : '';
        const fileName = fileSplit[fileSplit.length - 1];
        const fileExt = fileURL.slice(fileURL.lastIndexOf(".") + 1).toLowerCase();
        const fileAccept = $(this).attr("accept") != undefined ? ($(this).attr("accept")).split(",") : '';
        const IS_DATA = fileAccept != '' ? fileAccept.includes(`.${fileExt}`) : true;
        
        if(fileURL && !IS_DATA) {
            alert(`올바른 파일의 형식을 등록해주세요.\n지원하는 형식 : ${fileAccept}`);
            $(this).val("");
            $(this).next(".file_url").val("");
            $(this).next(".file_url").attr("value","");

            return false;
        }

        if(fileName) {
            $(this).next(".file_url").val(fileName);
            $(this).next(".file_url").attr("value",fileName);
        } else {
            $(this).next(".file_url").val("");
            $(this).next(".file_url").attr("value","");
        }
    });

    // Bootstrap Datetimepicker
    $(document).on("click", ".input-group-addon", function() {
        $(this).prev(".datetimepicker").focus();
        $(this).prev(".datetimepicker_update").focus();
        $(this).prev(".datetimepicker_time").focus();
        $(this).prev(".datetimepicker_month").focus();
    });

    $(document).on('focus', ".datetimepicker_update", function(e) {
        $(this).datetimepicker({
            format: 'YYYY-MM-DD',
            locale: 'ko',
            showClear: true,
            showTodayButton: true,
            showClose: true
        });
    });

    $(document).on('focus', ".datetimepicker_time", function(e) {
        $(this).datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: 'ko',            
            showClear: true,
            showTodayButton: true,
            showClose: true,
            // sideBySide : true,
        });
    });

    $(document).on('focus', ".datetimepicker_month", function(e) {
        $(this).datetimepicker({
            format: 'YYYY-MM',
            locale: 'ko',
            showClear: true,
            showTodayButton: true,
            showClose: true
        });
    });

    // input[type='text'] -> 숫자 및 콤마만 적용
    $(document).on("keyup", "input[type='text'].fixed_num", function(e) {
        $(this).val(addCommas($(this).val().replace(/[^0-9|.|-]/g,"")));
    });
    $(document).on("keyup", "input[type='text'].fixed_float", function(e) {
        $(this).val($(this).val().replace(/[^0-9|.]/g,""));
    });
    $(document).on("keyup","input[type='text'].limit_float", function(e) {
        const input_data = $(this).val().replace(/[^0-9|.]/g,"");
        const DECIMAL_MAX_LEN = $(this).data("digit") || 100;

        if(input_data.indexOf(".") > -1 && (input_data.split(".")[1]).length > 0) {
            const number = input_data.split(".")[0];
            const decimal = (input_data.split(".")[1]).substr(0, DECIMAL_MAX_LEN);

            $(this).val(`${addCommas(number)}.${decimal}`);

        } else {
            $(this).val(addCommas(input_data));
        }
    });

    /* 필수 항목 값 입력 시 에러메세지 숨김 */
    /*
    $(".data-input, .data-select").on('change keyup', function() {
        if($(this).val().length > 0) {
            $(this).next().hide();
        }
    });
    */

    /* 리스트 탭 전환 */
    $(".list-tab .tab").click(function() {
        $(".list-tab .tab").removeClass("act");
        $(this).addClass("act");

        // 조회 조건 초기화
        $("[name='save_search_type']").val("");
        $("[name='save_keyword']").val("");
        $("[name='save_date_type']").val("");
        $("[name='save_search_start_dt']").val("");
        $("[name='save_search_end_dt']").val("");
        $("[name='search-kinds']").val("");
        $(".search-data").val("");

        const status = $(this).data("type");

        getResultData(1,status);

        const dataTotalCount = $(".total-info .total span").text();
        drawPagination(dataTotalCount, MAX_VIEW_COUNT);
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

function loginSystem() {
    sessionStorage.removeItem('timer');

    if(!sessionStorage.getItem("timer")) {
        $("#login_form").submit();
    }
}
function logoutSystem() {
    sessionStorage.removeItem('timer');
    location.href="/logout";
}

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
    const status = $(".list-tab .tab.act").data("type");

    $(".page li").on('click', function() {
        if(!$(this).hasClass('on')) {
            $(".page li").removeAttr("class");
            $(this).addClass("on");

            getResultData($(this).data('page'),status);
        }
    });    
}

/* Modal - 창 닫기 */
function closeModal(self) {
    $(self).closest(".common-modal").hide();
}

/* 필터 모달 창 열기 */
function filterSearchModalOpen() {
    $("#filterSearchModal").css('display','flex');
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

/* 3자리 단위마다 콤마 생성 */
function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* 콤마 제거 */
function removeComma(str) {
    n = parseInt(str.toString().replace(/,/g,""));
    return n;
}

/* 일괄 다운로드 */
function DownloadZipFile(arFileArray, sZipFileName, arPurchaserArray) {
	var Promise = window.Promise;

	if (!Promise) {
		Promise = JSZip.external.Promise;
	}

	function urlToPromise(url) {
		return new Promise(function(resolve, reject) {
			JSZipUtils.getBinaryContent(url, function (err, data) {
				if(err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	if(!JSZip.support.blob) {
		showError("This demo works only with a recent browser !");
		//return;
	}

	var zip = new JSZip();
    
    if(typeof arFileArray == 'string') {
        arFileArray = JSON.parse(arFileArray.replace(/'/g,'"'));
    }

	for(var i = 0; i < arFileArray.length; i++) {			
		var url = arFileArray[i];
		var filename = url.replace(/.*\//g, "");
		
		zip.file(filename, urlToPromise(url), {binary:true});
	}

	zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
	})
	.then(function callback(blob) {
		// see FileSaver.js
		saveAs(blob, sZipFileName);
	}, function (e) {
		showError(e);
	});
}

// 이메일 형식 체크
function email_check(email) {    
    var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return (email != '' && email != 'undefined' && regex.test(email)); 
}

// POST -> json 형식으로 보낼 때 token 여부 체크
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// 파일 객체 불러오기
const convertURLtoFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split(".").pop();
    const filename = url.split("/").pop();
    const metadata = { type: `image/${ext}` };

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File([data], filename, metadata));
    
    return dataTransfer;
}