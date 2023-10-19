$(function() {
    let process_list = $("#process_list").val();
    process_list = JSON.parse(process_list.replace(/'/g,'"'));
    
    let count = 1;
    let html = '';

    for(let p in process_list) {
        html += `<li>`;
        html += `    <label for="id_type_${count}">`;
        html += `        <input type="checkbox" name="type1" value="${process_list[p]}" id="id_type_${count}">`;
        html += `        ${process_list[p]}`;
        html += `    </label>`;
        html += `</li>`;

        count++;
    }

    $("#id_type").append(html);

    const save_process = $("[name='process']").val();

    if(save_process != ''){
        let save_process_split = save_process.split(',');

        for(var i=0; i<save_process_split.length; i++){
            $("input[name=type1][value="+save_process_split[i]+"]").prop("checked",true);
        }
    }

    $("#id_type li label").each(function() {
        /* 첫 로드 시 적용 */
        if($(this).find('input').prop('checked')) {
                $(this).addClass('act');
        }
        else {
            $(this).removeClass('act');
        }

        $(this).click(function() {
            if($(this).find('input').prop('checked')) {
                $(this).addClass('act');
            }
            else {
                $(this).removeClass('act');
            }
        });
    });
    
});


function typeCheck(){
    $("input[name='process']").val('');
    var check = $("input[name='type1']")

    for(var i=0; i<check.length; i++){
        if(check[i].checked){
            var type= $("input[name='process']").val();

            if(type == ''){
                $("input[name='process']").val(check[i].value);
            } else{
                $("input[name='process']").val(type+","+check[i].value);
            }
        }
    }

    if($("input[name='process']").val() == '') {
        alert("적어도 하나의 공정을 선택해주세요.");
        return false;
    }

    $('form').submit();
}