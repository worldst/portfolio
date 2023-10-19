$(document).ready(function(){
    /*if($('#id_worker_start').val()==''){
        var now = moment().format('YYYY-MM-DD');
        var week = new Date(Date.parse(now) - 7 * 1000 * 60 * 60 * 24);
        $('#id_worker_start').val(dateToYYYYMMDD(week));
        $('#id_worker_end').val(now);
        $("#dateForm").submit();
    }*/

    /* 등록된 주문 수 */
    var orderCount = $(".table tbody tr").length;
    $(".orderInfo__count").text(orderCount);
});

function planSearch(obj){
    var now = moment().format('YYYY-MM-DD');
    if(obj ==''){
        var startDate = $('#id_worker_start').val();
        var endDate = $('#id_worker_end').val();
        if(startDate =="" || endDate==''){
            alert('기준날짜를 설정해주세요');
            return
        }
        if(startDate>endDate){
            alert('검색할 날짜를 재설정해주세요.');
            return;
        }
    }else if(obj=='today'){
        $('#id_worker_start').val(now);
        $('#id_worker_end').val(now);
    }else if(obj=='week'){
        var week = new Date(Date.parse(now) - 7 * 1000 * 60 * 60 * 24);
        $('#id_worker_start').val(dateToYYYYMMDD(week));
        $('#id_worker_end').val(now);
    }else if(obj=="month"){
        var month = new Date(Date.parse(now) - 30 * 1000 * 60 * 60 * 24);
        $('#id_worker_start').val(dateToYYYYMMDD(month));
        $('#id_worker_end').val(now);
    }
    $("#dateForm").submit();
}

function dateToYYYYMMDD(date){
    function pad(num) {
        num = num + '';
        return num.length < 2 ? '0' + num : num;
    }
    return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate());
}

function exportTables() {
    new Table2Excel('#myTable, #myTable-sticky', {
        widthRatio : .1,
        plugins: [
            Table2Excel.plugins.alignmentPlugin,
            Table2Excel.plugins.autoWidthPlugin,
            {
                worksheetCompleted({ workbook, tables, worksheet, table }) {
                    worksheet.getRow(2).hidden = true
                }
            }
        ]
    }).export('기간별생산계획','xlsx')
}

