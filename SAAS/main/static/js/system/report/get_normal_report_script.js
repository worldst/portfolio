$(document).ready(function(){
    var processName = $("#form_process").val();
    if(processName =="ALL"){
        $(".process_name").text('전체');
    }else if(processName =="SHEARING"){
        $(".process_name").text('샤링');
    }else if(processName =="VCUTTING"){
        $(".process_name").text('V컷팅');
    }else if(processName =="BENDING"){
        $(".process_name").text('절곡');
    }else if(processName =="LORING"){
        $(".process_name").text('로링');
    }
    var chart= $("#chartData").val() //꺽은선 그래프 만들기
    if(chart!=''){
        chart = chart.replace(/\'/g, "\"");
        var ctx = document.getElementById("lineChart");
        var chartData = JSON.parse(chart);
        date = new Array;
        count = new Array;

        var start_date = $("#id_worker_start").val();
        var end_Date = $("#id_worker_end").val();
        var later_Date = $("#id_worker_start").val();
        end_Date = new Date(Date.parse(end_Date) + 1000 * 60 * 60 * 24);
        do{
            var inputDate =moment(later_Date).format('YYYY-MM-DD');
            date.push(inputDate);
            for(var i=0; i<chartData.length;i++){
                if(inputDate.toString() == chartData[i].date){
                    count.push(chartData[i].count);
                    break;
                }
                if((i+1)==chartData.length){
                    count.push(0);
                }
            }
            later_Date = new Date(Date.parse(later_Date) + 1000 * 60 * 60 * 24);
        }while(moment(later_Date).format('YYYY-MM-DD')!=moment(end_Date).format('YYYY-MM-DD'))
        lineChartCreate(ctx,"완료 건수",date,count,"count");
    }
    var pieChart= $("#circleData").val() //파이차트 만들기
    if(pieChart!=''){
        pieChart = pieChart.replace(/\'/g, "\"");
        var pieCtx = document.getElementById("pieChart");
        var pieChartData = JSON.parse(pieChart);
        pieCompany = new Array;
        pieCount = new Array;
        etcSum = 0;
        for(var i=0; i<pieChartData.length;i++){
            var tplHtml = $("#companyTpl").html();
            tplHtml = tplHtml.replace(/#COMPANY#/g,(pieChartData[i].company||''));
            tplHtml = tplHtml.replace(/#COUNT#/g,(pieChartData[i].count||''));
            $('#companyTplList').append(tplHtml);
            if(i<5){
                pieCompany.push(pieChartData[i].company);
                pieCount.push(pieChartData[i].count);
            }else{
                etcSum += pieChartData[i].count
            }
        }

        if(pieChartData.length>5){
            pieCompany.push('기타');
            pieCount.push(etcSum);
        }

        pieChartCreate(pieCtx,pieCompany,pieCount,"count")
    }
    $(".has-error").attr('class','form-group has-success');
    $(".help-block").remove();
    GetWorker('ALL');
});

$(function () {
    $(".graph_tab ul li").each(function (i) {
        $(this).click(function (e) {
            $(".graph_tab ul li").removeClass('act');
            $(this).addClass('act');
            if(i==0){
                $('#myTable').css('display','block');
            }else{
                $('#myTable').css('display','none');
            }
            $(".graph_wrap .graph_box").hide().eq(i).show();
        });
    }).eq(0).trigger('click');
    
});

function GetWorker(process) {
    var worker = $("#form_worker").val();
    var target = document.getElementById("id_worker");
    var url = '';

    if ('ALL' == process) {
        url = '/report/worker?process=ALL'
    } else{
        url = '/report/worker?process='+process.value
    }

    $.ajax({
        type: 'GET',
        url : url,
        success:function(data){
            target.options.length = 0;
            
            for(var n in data){
                var opt = document.createElement("option");
                opt.value = data[n]['id']
                opt.innerHTML = data[n]['name']
                target.appendChild(opt);
            }
            if(worker!='None'){
                $("#id_worker").val(worker).prop("selected", true);

            }
        }
    });
}


function closeModal() {
    $('.searchModal').css("visibility","hidden");
};

function modalShow(pk) {
    var pk = pk;
    $("#modal").css("visibility","visible");
    $.ajax({
        type: 'GET',
        url : '/report/job-records?pk='+pk,
        dataType:'json',
        success:function(data){
            $('#jobTplList').empty();
            for(var i=0; i<data.length;i++){
                    var vo = data[i];
                    var tplHtml = $("#jobTpl").html();
                    tplHtml = tplHtml.replace(/#COMPANY#/g,(vo.company||''));
                    tplHtml = tplHtml.replace(/#PROJECT_NAME#/g,(vo.project_name||''));
                    tplHtml = tplHtml.replace(/#PAUSED#/g,(vo.paused||''));
                    tplHtml = tplHtml.replace(/#RESUME#/g,(vo.resume||''));
                    tplHtml = tplHtml.replace(/#WORKER#/g,(vo.worker||''));
                    $('#jobTplList').append(tplHtml);
                }
        }
    });
}