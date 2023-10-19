$(function() {
    setTimeout(() => {
        if($("#id_start").length!=0){
            var date = $("#id_start").val();
            if(date !=''){
                var oldDate = new Date(Date.parse(date) + 30 * 1000 * 60 * 60 * 24);
                $('#id_end').data("DateTimePicker").minDate(date);
                $('#id_end').data("DateTimePicker").maxDate(oldDate);
            }
        }
        $("#id_start").on('dp.change', function () {
            var date = $("#id_start").val();
            var oldDate = new Date(Date.parse(date) + 30 * 1000 * 60 * 60 * 24);
            $('#id_end').data("DateTimePicker").minDate(date);
            $('#id_end').data("DateTimePicker").maxDate(oldDate);
        });
    },0);
});