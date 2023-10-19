$(function() {
    // 파일 url 정리
    $(".file_url").each(function() {
        const file_url = $(this).val();
        const result_file_url = file_url.split("/").pop();

        $(this).val(result_file_url);
    });

    // 주문 특이사항 데이터 셋팅
    const before_special_note = $("[name='special_note']").data("before");

    if(before_special_note) {
        if(before_special_note.toString().indexOf("Ψ") !== -1) {
            $("[name='special_note']").val(before_special_note.split("Ψ")).trigger("change");
        } else {
            $("[name='special_note']").val(before_special_note).trigger("change");
        }
    }

    // 출하 사진 서브 이미지 셋팅
    $(".photo_sub .sub_img").each(function() {
        const file_url = $(this).data("url");
        const file_name = (file_url.split("/").pop()).split(".")[0];
        const file_ext = file_url.slice(file_url.lastIndexOf(".") + 1).toUpperCase();
        
        $(this).find(".info .name").text(file_name);
        $(this).find(".ext").text(file_ext);
    });

    // 출하 사진 이벤트 처리
    $(document).on("click",".photo_sub .sub_img:not('.act')",function() {
        $(".photo_sub .sub_img").removeClass("act");
        $(this).addClass("act");

        const file_url = $(this).data("url");

        $(".file_download_btn").attr("href",`/base/media/${file_url}`);
        $(".main_img").empty().append(`<img alt="메인이미지" src="/base/media/${file_url}">`);
    });

    $(".photo_sub .sub_img").eq(0).trigger("click");

    // 댓글 데이터 셋팅
    getComment();
});

// 출하 완료
function compltModalOpen(self) {
    const pk = $("[name='object_id']").val();
    const ids = [pk];

    $(".common-modal.complt [name='ids']").val(pk);
    $(".common-modal.complt").css('display','flex');
}

function compltData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const ids = $(".common-modal.complt [name='ids']").val();
    const data_list = [];
    let obj;

    /*
    ids.forEach(function(v, i) {
        data_list.push({
            id : v
        })
    });
    */

    obj = {
        shipment_status : 'COMPLT'
    }

    // console.log(obj);

    $.ajax({
        url: `/sales/api/order/shipment/${ids}/status/change`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                // $(".load_bg").addClass('load_display');
            }
        },
        success:function(data) {
            alert("처리되었습니다.");
            location.reload();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 부분 출하
function cancelModalOpen(self) {
    const pk = $("[name='object_id']").val();
    const ids = [pk];

    $(".common-modal.cancel [name='ids']").val(pk);
    $(".common-modal.cancel").css('display','flex');
}

function cancelData() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const ids = $(".common-modal.cancel [name='ids']").val();
    const data_list = [];
    let obj;

    /*
    ids.forEach(function(v, i) {
        data_list.push({
            id : v
        })
    });
    */

    obj = {
        shipment_status : 'START'
    }

    // console.log(obj);

    $.ajax({
        url: `/sales/api/order/shipment/${ids}/status/change`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                // $(".load_bg").addClass('load_display');
            }
        },
        success:function(data) {
            alert("처리되었습니다.");
            location.reload();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

// 코멘트 작성하기
function addComment() {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();
    const content = $("[name='content']").val();
    let obj;

    if(!content) {
        alert("내용을 입력해주세요.");
        $("[name='content']").focus();
        return false;
    }

    obj = {
        parent_id : 0,
        content : content
    }

    $.ajax({
        url: `/sales/api/comment/add/${pk}`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load_bg").addClass('load_display');
            }
        },
        success:function(data) {
            $(".load_bg").removeClass('load_display');
            $("[name='content']").val('');

            getComment();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

function getComment() {
    const user_id = $("[name='user_id']").val();
    const pk = $("[name='object_id']").val();

    $.ajax({
        url: `/sales/api/comment/${pk}`,
        type: 'GET',
        success:function(data) {
            // console.log(data);
            $(".comment_inner").empty();
            
            for(let i=0; i<data.length; i++) {
                let html = '';

                html += `<div class="comment_box" data-id="${data[i].id}">`;
                html += `    <div class="comment_info">`;
                if(data[i].is_delete) {
                    html += `    <div class="left remove">`;
                } else {
                    html += `    <div class="left">`;
                }
                html += `            <span class="user">${data[i].user}</span>`;
                html += `            <span class="space_line"></span>`;
                html += `            <span class="created_dt">${data[i].created_dt}</span>`;
                html += `        </div>`;
                html += `        <div class="right">`;
                if(!data[i].is_delete) {
                    if(data[i].user_id == user_id) {
                        html += `        <span class="right_btn update_btn" onclick="formChange('${data[i].id}', this);">수정 <i class="fa-regular fa-pen-to-square" style="margin-left:4px;"></i></span>`;
                        html += `        <span class="right_btn remove_btn" onclick="removeComment('${data[i].id}', this);">삭제 <i class="fa-solid fa-xmark" style="margin-left:4px;"></i></span>`;
                    }
                    html += `            <span class="right_btn reply_btn" onclick="openWriteReply('${data[i].id}', this);">답글 <i class="fa-regular fa-comment-dots" style="margin-left:4px;"></i></span>`;
                }
                html += `        </div>`;
                html += `    </div>`;
                if(data[i].is_delete) {
                    html += `    <div class="comment remove">삭제된 코멘트입니다.</div>`;
                } else {
                    html += `    <pre class="comment">${data[i].content}</pre>`;
                }
                html += `</div>`;
                
                if(data[i].children.length > 0) {
                    $(".comment_inner").append(html);
                    recursionComment(data[i].children);
                } else {
                    $(".comment_inner").append(html);
                }
            }

            // 전체 댓글 수
            const all_comment_cnt = $(".comment_inner").find(".comment_box").length;

            $("#all_comment_cnt").text(all_comment_cnt);
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

function recursionComment(data) {
    const user_id = $("[name='user_id']").val();
    let res_data = data;

    for(let i=0; i<res_data.length; i++) {
        const PADDING = 25 * res_data[i].level;
        const APPLY_ICON = 25 * (res_data[i].level - 1);
        let res_html = '';

        res_html += `<div class="comment_box" data-id="${res_data[i].id}" data-level="${res_data[i].level}" style="padding-left:${PADDING}px;">`;
        res_html += `    <i class="fa-solid fa-reply" style="left:${APPLY_ICON}px;"></i>`;
        res_html += `    <div class="comment_info">`;
        if(res_data[i].is_delete) {
            res_html += `    <div class="left remove">`;
        } else {
            res_html += `    <div class="left">`;
        }
        res_html += `            <span class="user">${res_data[i].user}</span>`;
        res_html += `            <span class="space_line"></span>`;
        res_html += `            <span class="created_dt">${res_data[i].created_dt}</span>`;
        res_html += `        </div>`;
        res_html += `        <div class="right">`;
        if(!res_data[i].is_delete) {
            if(res_data[i].user_id == user_id) {
                res_html += `        <span class="right_btn update_btn" onclick="formChange('${res_data[i].id}', this);">수정 <i class="fa-regular fa-pen-to-square" style="margin-left:4px;"></i></span>`;
                res_html += `        <span class="right_btn remove_btn" onclick="removeComment('${res_data[i].id}', this);">삭제 <i class="fa-solid fa-xmark" style="margin-left:4px;"></i></span>`;
            }
            res_html += `            <span class="right_btn reply_btn" onclick="openWriteReply('${res_data[i].id}', this);">답글 <i class="fa-regular fa-comment-dots" style="margin-left:4px;"></i></span>`;
        }
        res_html += `        </div>`;
        res_html += `    </div>`;
        if(res_data[i].is_delete) {
            res_html += `    <div class="comment remove">삭제된 코멘트입니다.</div>`;
        } else {
            res_html += `    <pre class="comment">${res_data[i].content}</pre>`;
        }
        res_html += `</div>`;
            
        $(".comment_inner").append(res_html);

        if(res_data[i].children.length > 0) {
            recursionComment(res_data[i].children);
        }
    }
}

function openWriteReply(pk, self) {
    const user = $("[name='user_name']").val();
    let html = '';
    
    html += `<div class="comment_box reply_box" style="padding-left:25px;">`;
    html += `    <i class="fa-solid fa-reply-all" style="left:0; color:#3090b5;"></i>`;
    html += `    <div class="comment_info">`;
    html += `        <div class="left">`;
    html += `            <span class="user">${user}</span>`;
    html += `        </div>`;
    html += `        <div class="right">`;
    html += `            <span onclick="removeReply(this)"><i class="fa-solid fa-circle-xmark"></i></span>`;
    html += `        </div>`;
    html += `    </div>`;
    html += `    <div class="flex-between">`;
    html += `        <textarea name="reply" class="form-control" placeholder="답글을 입력해주세요." style="width:calc(100% - 90px); height:60px;"></textarea>`;
    html += `        <span class="comment_btn" onclick="addReply('${pk}');">등록</span>`;
    html += `    </div>`;
    html += `</div>`;

    $(".reply_box").remove();
    $(self).closest(".comment_box").after(html);
}

function removeReply(self) {
    $(self).closest(".reply_box").remove();
}

function addReply(parent_id) {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const pk = $("[name='object_id']").val();
    const content = $(".reply_box [name='reply']").val();
    let obj;

    if(!content) {
        alert("답글을 입력해주세요.");
        $("[name='reply']").focus();
        return false;
    }

    obj = {
        parent_id : parent_id,
        content : content
    }

    $.ajax({
        url: `/sales/api/comment/add/${pk}`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load_bg").addClass('load_display');
            }
        },
        success:function(data) {
            $(".load_bg").removeClass('load_display');
            $("[name='content']").val('');

            getComment();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}

function removeComment(pk, self) {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    let obj;

    obj = {
        // content : '삭제된 댓글입니다.',
        is_delete : true
    }
    
    if(confirm("코멘트를 삭제하시겠습니까?")) {
        $.ajax({
            url: `/sales/api/comment/mod/${pk}`,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(obj),
            beforeSend: function(xhr, settings) {
                if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", token);
                    $(".load_bg").addClass('load_display');
                }
            },
            success:function(data) {
                $(".load_bg").removeClass('load_display');
                $("[name='content']").val('');

                getComment();
            },
            error:function(request, error) {
                alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
            }
        });
    }
}

function formChange(pk, self) {
    const comment_id = $(self).closest(".comment_box").data("id");
    const comment = $(self).closest(".comment_box").find(".comment").text() || $(self).closest(".comment_box").find("[name='update_content']").val();
    let html = '';

    html += `<div class="flex-between">`;
    html += `    <textarea name="update_content" class="form-control" placeholder="내용을 입력해주세요." style="width:calc(100% - 90px); height:60px;">${comment}</textarea>`;
    html += `    <span class="comment_btn update" onclick="updateComment('${comment_id}', this);">수정</span>`;
    html += `</div>`;

    $(self).closest(".comment_box").find(".flex-between").remove();
    $(self).closest(".comment_box").find(".comment").remove();
    $(self).closest(".comment_box").append(html);
}

function updateComment(pk, self) {
    const token = $("input[name='csrfmiddlewaretoken']").val();
    const comment = $(self).closest(".comment_box").find("[name='update_content']").val();
    let obj;

    if(!comment) {
        alert("내용을 입력해주세요.");
        $(self).closest(".comment_box").find("[name='update_content']").focus();
        return false;
    }

    obj = {
        content : comment
    }

    $.ajax({
        url: `/sales/api/comment/mod/${pk}`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
                $(".load_bg").addClass('load_display');
            }
        },
        success:function(data) {
            $(".load_bg").removeClass('load_display');
            $("[name='content']").val('');

            getComment();
        },
        error:function(request, error) {
            alert("code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        }
    });
}