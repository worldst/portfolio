$(document).ready(function(){
    $('#id_registration_number').attr('maxlength',10);
    
    $("input[name='tel']").keyup(function(){
        var obj = $(this).val();
        obj = PatternInspection(obj);
        $(this).val(obj);
        if(obj.length==11) {
            var formatText = obj.slice(0, 3) + '-' + obj.slice(3, 7) + '-' + obj.slice(7);
            $(this).val(formatText);
        }
    });

    $("#id_fax_number").keyup(function(){
        var obj = $("#id_fax_number").val();
        obj =  PatternInspection(obj);
        $("#id_fax_number").val(obj);
        if(obj.length==11) {
            var formatText = obj.slice(0, 3) + '-' + obj.slice(3, 7) + '-' + obj.slice(7);
            $('#id_fax_number').val(formatText);
        }
    });

	$("#id_registration_number").keyup(function(){
        var tpl = $("#id_registration_number").parent();
        var obj = $("#id_registration_number").val();
            obj =  PatternInspection(obj);
            $("#id_registration_number").val(obj);
            $('#registerError').remove();

        var number = $('#id_registration_number').val();
        var count= (number.match(/-/g) || []).length;  // - 갯수
        if(number.length==10 && count == 0) {
            var formatText = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.slice(5);
            $('#id_registration_number').val(formatText);
            $('#registerError').remove();
        }else if(number.length!=12|| count>2 ||number.length==11){
            tpl.after("<ul class='errorlist' id='registerError'><li>올바르지 않은 사업자등록번호입니다.</li></ul>");
        }else if(number.length==12){
            if(count!=2||number.indexOf("-")!=3 ||number.indexOf("-",5)!=6){
                tpl.after("<ul class='errorlist' id='registerError'><li>올바르지 않은 사업자등록번호입니다.</li></ul>");
                return
            }
        }
    });
    
    var managerCount = $("#managerCount").val();

    $(".form-group-box .add").click(function () {
         var manager_clone = $(".manager_clone").html();
         manager_clone = manager_clone.replace(/currentBox/g,'currentBox'+managerCount);
         manager_clone = manager_clone.replace(/manager/g,'manager'+managerCount);
         manager_clone = manager_clone.replace(/rowDelete\(/g,'rowDelete('+managerCount);
         $(".form-group-wrap").append(manager_clone);
         managerCount++;
         $("#managerCount").val(managerCount);

         var box_len = $(".form-group-wrap .form-group-box").length;
         if(box_len > 2) {
             $(this).css('visibility','hidden');
         }
    });
});

function rowDelete(obj) {
    $("#currentBox"+obj).remove();

    var box_len = $(".form-group-wrap .form-group-box").length;
    if(box_len < 3) {
        $(".form-group-box .add").css('visibility','visible');
    }
}
function companyAdd(){

    var boxSize = $(".form-group-wrap .form-group-box");
    var manager_group ='';

    for(var i=0; i<boxSize.size();i++){
        if(boxSize.eq(i).find('input').val().length > 0) {
            manager_group +=boxSize.eq(i).find('input').eq(0).val();
            manager_group+='/'+boxSize.eq(i).find('input').eq(1).val()+","
        }
    }
    
    $("#id_manager_number").val(manager_group);
    $('form').submit();
    
}