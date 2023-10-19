$(document).ready(function(){
    $(".graph_wrap .graph_box").hide().eq(0).show();
    var menu = $("#menu_index").val();
    var chart= $("#chartData").val();
    chart = chart.replace(/\'/g, "\"");
    if(menu == "companySales"){
        companySales(chart);
    }else if(menu == "defaultSales"){
        defaultSales(chart);
    }else if(menu == "employeeSales"){
        employeeSales(chart);
    }else if(menu == "loginReport"){
        loginReport(chart);
    }else if(menu == "loginTime"){
        loginTime(chart);
    }
});

function loginTime(chart){
    var user = $("#id_user option:selected").text();
    $('.graph_box .graph_title span').text(user);
    $(".graph_wrap .graph_box").hide().eq(0).show();

    $(".has-error").attr('class','form-group has-success');
    $(".help-block").remove();
    
    if(chart!='' && chart!="None"){
        var ctx = document.getElementById("lineChart");
        var chartData = JSON.parse(chart);
        date = new Array;
        sum = new Array;

        var start_date = $("#id_start").val();
        var end_Date = $("#id_end").val();
        var later_Date = $("#id_start").val();
        end_Date = new Date(Date.parse(end_Date) + 1000 * 60 * 60 * 24);
        do{
            var inputDate =moment(later_Date).format('YYYY-MM-DD');
            date.push(inputDate);
            var finalSum = 0;
            for(var i=0; i<chartData.length;i++){
                if(inputDate.toString() == chartData[i].date){
                    finalSum += chartData[i].time;
                }
                if((i+1)==chartData.length){
                    sum.push(finalSum);
                    if(finalSum!=0){
                        var tplHtml = $("#jobTpl").html();
                        tplHtml = tplHtml.replace(/#DATE#/g,(inputDate.toString()||''));
                        tplHtml = tplHtml.replace(/#TIME#/g,(finalSum||''));
                        $('#jobTplList').append(tplHtml);
                    }
                }
            }
            later_Date = new Date(Date.parse(later_Date) + 1000 * 60 * 60 * 24);
        }while(moment(later_Date).format('YYYY-MM-DD')!=moment(end_Date).format('YYYY-MM-DD'))
        lineChartCreate(ctx,"접속시간 통계",date,sum,"time");
    }
}
function loginReport(chart){
    if(chart!='' && chart!="None"){
        var ctx = document.getElementById("lineChart");
        var chartData = JSON.parse(chart);
        date = new Array;
        sum = new Array;

        var start_date = $("#id_start").val();
        var end_Date = $("#id_end").val();
        var later_Date = $("#id_start").val();
        end_Date = new Date(Date.parse(end_Date) + 1000 * 60 * 60 * 24);
        do{
            var inputDate =moment(later_Date).format('YYYY-MM-DD');
            date.push(inputDate);
            var finalSum = 0;
            for(var i=0; i<chartData.length;i++){
                if(inputDate.toString() == chartData[i].loginDate){
                    finalSum += chartData[i].cnt;
                }
                if((i+1)==chartData.length){
                    sum.push(finalSum);
                    if(finalSum!=0){
                        var tplHtml = $("#jobTpl").html();
                        tplHtml = tplHtml.replace(/#DUE_DATE#/g,(inputDate.toString()||''));
                        tplHtml = tplHtml.replace(/#LOGIN_CNT#/g,(finalSum||''));
                        $('#jobTplList').append(tplHtml);
                    }
                }
            }
            later_Date = new Date(Date.parse(later_Date) + 1000 * 60 * 60 * 24);
        }while(moment(later_Date).format('YYYY-MM-DD')!=moment(end_Date).format('YYYY-MM-DD'))
        lineChartCreate(ctx,"로그인 통계",date,sum,"login");
    }
}
function employeeSales(chart){
    if(chart!='' && chart!="None"){
        var ctx = document.getElementById("pieChart");
        var startDate = $("#id_worker_start").val();
        var endDate = $("#id_worker_end").val();
        var chartData = JSON.parse(chart);
        pieCompany = new Array;
        pieSum = new Array;
        etcSum = 0;
        var totalSum = 0;
        for(var i=0; i<chartData.length;i++){
            totalSum+=chartData[i].sum;
            var tplHtml = $("#jobTpl").html();
            tplHtml = tplHtml.replace(/#NAME#/g,(chartData[i].name||''));
            tplHtml = tplHtml.replace(/#STARTDATE#/g,(startDate||''));
            tplHtml = tplHtml.replace(/#PK#/g,(chartData[i].pk||''));
            tplHtml = tplHtml.replace(/#ENDDATE#/g,(endDate||''));
            tplHtml = tplHtml.replace(/#SUM#/g,(chartData[i].sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")||''));
            $('#jobTplList').append(tplHtml);
            if(i<5){
                pieCompany.push(chartData[i].name);
                pieSum.push(chartData[i].sum);
            }else{
                etcSum += chartData[i].sum
            }
        }

        if(chartData.length>5){
            pieCompany.push('기타');
            pieSum.push(etcSum);
        }
        
        $('#totalSum').text(totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        pieChartCreate(ctx,pieCompany,pieSum,"money")
    }
}
function defaultSales(chart){
    if(chart!='' && chart!="None"){
        var ctx = document.getElementById("lineChart");
        var chartData = JSON.parse(chart);
        date = new Array;
        sum = new Array;
        var start_date = $("#id_worker_start").val();
        var end_Date = $("#id_worker_end").val();
        var later_Date = $("#id_worker_start").val();
        end_Date = new Date(Date.parse(end_Date) + 1000 * 60 * 60 * 24);
        var totalSum = 0;
        do{
            var inputDate =moment(later_Date).format('YYYY-MM-DD');
            date.push(inputDate);
            var finalSum = 0;
            var companyCount = 0;
            for(var i=0; i<chartData.length;i++){
                if(inputDate.toString() == chartData[i].due_date){
                    companyCount+=1;
                    finalSum += chartData[i].sum;
                }
                if((i+1)==chartData.length){
                    sum.push(finalSum);
                    totalSum+=finalSum;
                    if(finalSum!=0){
                        var tplHtml = $("#jobTpl").html();
                        tplHtml = tplHtml.replace(/#DUE_DATE#/g,(inputDate||''));
                        tplHtml = tplHtml.replace(/#COUNT#/g,(companyCount||''));
                        tplHtml = tplHtml.replace(/#SUM#/g,(finalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")||''));
                        $('#jobTplList').append(tplHtml);
                    }
                }
            }
            later_Date = new Date(Date.parse(later_Date) + 1000 * 60 * 60 * 24);
        }while(moment(later_Date).format('YYYY-MM-DD')!=moment(end_Date).format('YYYY-MM-DD'))

        $(".graph_title span").text(totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        lineChartCreate(ctx,"매출 금액",date,sum,"money");
    }
}
function companySales(chart){
    if(chart!='' && chart!="None"){
        var ctx = document.getElementById("pieChart");
        var chartData = JSON.parse(chart);
        pieCompany = new Array;
        pieSum = new Array;
        etcSum = 0;
        var totalSum = 0;
        for(var i=0; i<chartData.length;i++){
            totalSum+=chartData[i].sum;
            var tplHtml = $("#jobTpl").html();
            tplHtml = tplHtml.replace(/#COMPANY#/g,(chartData[i].name||''));
            tplHtml = tplHtml.replace(/#COUNT#/g,(chartData[i].proj_cnt||''));
            tplHtml = tplHtml.replace(/#SUM#/g,(chartData[i].sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")||''));
            $('#jobTplList').append(tplHtml);
            if(i<5){
                pieCompany.push(chartData[i].name);
                pieSum.push(chartData[i].sum);
            }else{
                etcSum += chartData[i].sum
            }
        }

        if(chartData.length>5){
            pieCompany.push('기타');
            pieSum.push(etcSum);
        }

        $('#totalSum').text(totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        pieChartCreate(ctx,pieCompany,pieSum,"money")
    }
}