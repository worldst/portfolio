$(function() {
    /* 리스트 탭 전환 */
    $(".list-tab .tab").off("click");

    $(".list-tab .tab").click(function() {
        $(".list-tab .tab").removeClass("act");
        $(this).addClass("act");

        const status = $(this).data("type");

        getSalesReport(status);
    }).eq(0).trigger("click");
});

function getSalesReport(status) {
    const search_month = $("[name='save_search_month']").val() || moment().format("YYYY-MM");
    const start_month = $("[name='save_start_month']").val() || moment().format("YYYY-MM");
    const end_month = $("[name='save_end_month']").val() || moment().format("YYYY-MM");
    const url = status == 'sales' ? '/report/api/sales' : '/report/api/sales/company';
    let date_html = '';
    let obj;

    $(".tab_data_wrap").addClass("hidden");
    $(`.tab_data_wrap.${status}`).removeClass("hidden");

    if(status == 'sales') {
        date_html += `<div class="search_date_box flex">`;
        date_html += `    <span class="title">기간 검색</span>`;
        date_html += `    <div class="input-group">`;
        date_html += `        <input type="text" name="search_month" class="data-input datetimepicker_month" placeholder="날짜를 선택해주세요." value="${search_month}">`;
        date_html += `        <div class="input-group-addon input-group-append">`;
        date_html += `            <div class="input-group-text"><i class="glyphicon glyphicon-calendar"></i></div>`;
        date_html += `        </div>`;
        date_html += `    </div>`;
        date_html += `    <button id="table-search-bar" class="search-bar" onclick="searchData('sales');">조회</button>`;
        date_html += `</div>`;

        obj = {
            date_type : 'create',
            search_month : search_month
        }

    } else {
        date_html += `<div class="search_date_box flex">`;
        date_html += `    <span class="title">기간 검색</span>`;
        date_html += `    <div class="input-group">`;
        date_html += `        <input type="text" name="start_month" class="data-input datetimepicker_month" placeholder="시작년월을 선택해주세요." value="${start_month}">`;
        date_html += `        <div class="input-group-addon input-group-append">`;
        date_html += `            <div class="input-group-text"><i class="glyphicon glyphicon-calendar"></i></div>`;
        date_html += `        </div>`;
        date_html += `    </div>`;
        date_html += `    <span class="space">~</span>`;
        date_html += `    <div class="input-group">`;
        date_html += `        <input type="text" name="end_month" class="data-input datetimepicker_month" placeholder="종료년월을 선택해주세요." value="${end_month}">`;
        date_html += `        <div class="input-group-addon input-group-append">`;
        date_html += `            <div class="input-group-text"><i class="glyphicon glyphicon-calendar"></i></div>`;
        date_html += `        </div>`;
        date_html += `    </div>`;
        date_html += `    <button id="table-search-bar" class="search-bar" onclick="searchData('company');">조회</button>`;
        date_html += `</div>`;

        obj = {
            date_type : 'create',
            start_month : start_month,
            end_month : end_month,
        }
    }

    $(".list-func").empty().append(date_html);

    $.ajax({
        async: false,
        url: url,
        data: obj,
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $(".load-screen").addClass('load_display');
        },
        success: function (data) {
            setTimeout(() => {
                console.log(data);
                $(".load-screen").removeClass('load_display');
                                
                if(status == 'sales') {
                    // 상단 데이터 표출
                    $(".tab_data_wrap.sales .data_num .all_sales_price").text(addCommas(data.all_sales_price || 0));
                    $(".tab_data_wrap.sales .data_num .all_total_cost").text(addCommas(data.all_total_cost || 0));
                    $(".tab_data_wrap.sales .data_num .all_profit_loss").text(addCommas(data.all_profit_loss || 0));
                    $(".tab_data_wrap.sales .data_num .ex_month_rate").text(addCommas(parseFloat((data.ex_month_rate || 0).toFixed(2))));
                    // $(".tab_data_wrap.sales .data_num .ex_year_rate").text(addCommas(parseFloat((data.ex_year_rate || 0).toFixed(2))));

                    $(".tab_data_wrap.sales .data_num .all_process_price").text(addCommas(data.all_process_price || 0));
                    $(".tab_data_wrap.sales .data_num .all_material_price").text(addCommas(data.all_material_price || 0));
                    $(".tab_data_wrap.sales .data_num .all_outsourcing_price").text(addCommas(data.all_outsourcing_price || 0));
                    $(".tab_data_wrap.sales .data_num .all_etc_price").text(addCommas(data.all_etc_price || 0));

                    $(".tab_data_wrap.sales .data_num .all_process_cost").text(addCommas(data.all_process_cost || 0));
                    $(".tab_data_wrap.sales .data_num .all_material_cost").text(addCommas(data.all_material_cost || 0));
                    $(".tab_data_wrap.sales .data_num .all_outsourcing_cost").text(addCommas(data.all_outsourcing_cost || 0));
                    $(".tab_data_wrap.sales .data_num .total").text(addCommas(data.data_len || 0));

                    if(data.ex_month_rate > 0) {
                        $(".tab_data_wrap.sales .data_num .ex_month_rate").empty().append(`+${parseFloat((data.ex_month_rate || 0).toFixed(2))}`);
                        $(".tab_data_wrap.sales .data_num .ex_month_rate").closest(".data_num").removeClass("decrease").addClass("increase");
                    } if(data.ex_month_rate < 0) {
                        $(".tab_data_wrap.sales .data_num .ex_month_rate").closest(".data_num").removeClass("increase").addClass("decrease");
                    }

                    if(data.ex_year_rate > 0) {
                        $(".tab_data_wrap.sales .data_num .ex_year_rate").empty().append(`+${parseFloat((data.ex_year_rate || 0).toFixed(2))}`);
                        $(".tab_data_wrap.sales .data_num .ex_year_rate").closest(".data_num").removeClass("decrease").addClass("increase");
                    } if(data.ex_year_rate < 0) {
                        $(".tab_data_wrap.sales .data_num .ex_year_rate").closest(".data_num").removeClass("increase").addClass("decrease");
                    }

                    // 매출 그래프
                    const sales_list = data.sales_list;
                    const graph_labels = [];
                    const graph_data = [];

                    for(let i=0; i<sales_list.length; i++) {
                        graph_labels.push(sales_list[i].date);
                        graph_data.push(sales_list[i].sales_price);
                    }

                    const ctx_sales = document.getElementById('ctx_sales');
                    const config_sales = {
                        type: 'line',
                        data: {
                            labels: graph_labels,
                            datasets: [
                                {
                                    label: '매출 금액',
                                    data: graph_data,
                                    fill: false,
                                    backgroundColor: 'rgb(77, 148, 255)',
                                    borderColor: 'rgb(77, 148, 255)'
                                },
                                /*
                                {
                                    // label: '매출 금액',
                                    data: graph_data,
                                    fill: false,
                                    backgroundColor: 'rgb(255, 103, 152)',
                                    borderColor: 'rgb(255, 103, 152)',
                                    type: 'bar'
                                }
                                */
                            ]
                        },
                        options: {
                            maintainAspectRatio: false,
                            legend: {
                                display: false,
                                labels: {
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    fontFamily: 'SUIT Variable'
                                }
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        // max: 100,
                                        // beginAtZero: true,
                                        // stepSize: 20,
                                        fontSize: 11,
                                        fontStyle: 'bold',
                                        fontFamily: 'SUIT Variable'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: '매출 금액(원)',
                                        fontColor: '#ff6798',
                                        fontStyle: 'bold',
                                        fontSize: 13,
                                        fontFamily: 'SUIT Variable',
                                        // padding: 10
                                    }
                                }],
                                xAxes: [{
                                    ticks: {
                                        fontSize: 11,
                                        fontStyle: 'bold',
                                        fontFamily: 'SUIT Variable'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: '월 날짜',
                                        fontColor: '#ff6798',
                                        fontStyle: 'bold',
                                        fontSize: 13,
                                        fontFamily: 'SUIT Variable'
                                    }
                                }]
                            },
                            plugins: {
                                datalabels: {
                                    color: '#111',
                                    align: 'right',
                                    anchor: 'top',
                                    font: {
                                        lineHeight: 1.6
                                    },
                                    formatter: function (value, ctx) {
                                        return '';
                                    }
                                }
                            }
                        }
                    }

                    if(window.myLineChartSales != null) {
                        window.myLineChartSales.destroy();
                    }
                    window.myLineChartSales = new Chart(ctx_sales, config_sales);
                    window.myLineChartSales.data.labels = graph_labels;
                    window.myLineChartSales.data.datasets[0].data = graph_data;
                    window.myLineChartSales.update();

                    // 테이블 데이터
                    const res = data.object_list;
                    let html = '';

                    if(res.length == 0) {
                        html += `<tr><td colspan='7' class='no-data'>조회된 데이터가 없습니다.</td></tr>`;

                    } else {
                        for(let i=0; i<res.length; i++) {
                            html += `<tr>`;
                            html += `    <td>${res[i].num}</td>`;
                            html += `    <td>${res[i].created_dt}</td>`;
                            html += `    <td class="txt_left">${res[i].pjt_name}</td>`;
                            html += `    <td class="txt_left">${res[i].company_name}</td>`;
                            html += `    <td>${res[i].account}</td>`;
                            html += `    <td class="txt_right">${addCommas(res[i].sales_price)} 원</td>`;
                            html += `    <td class="txt_right">${addCommas(res[i].profit_loss)} 원</td>`;
                            html += `</tr>`;
                        }
                    }

                    $("#list-table-sales tbody").empty().append(html);

                } else {
                    const company_list_by_rate = data.company_list_by_rate;
                    const company_list_by_profit = data.company_list_by_profit;

                    // 업체별 매출 비율
                    const arr_bg_color = ["#f04545","#f9823a","#e9d119","#19e95b","#194ee9","#8819e9","#e919ba","#1fadbd","#059f52","#9f7f05"];
                    const labels_by_cnt = [];
                    const data_by_cnt = [];
                    const bgColor_by_cnt = [];
                    let bg_idx = 0;

                    for(let i=0; i<company_list_by_rate.length; i++) {
                        labels_by_cnt.push(company_list_by_rate[i].company_name);
                        data_by_cnt.push(company_list_by_rate[i].rate);
                        bgColor_by_cnt.push(arr_bg_color[bg_idx]);
                        
                        bg_idx++;

                        if(i == 9) bg_idx = 1;
                    }

                    const ctx_company_by_cnt = document.getElementById('ctx_company_by_cnt');
                    const config_company_by_cnt = {
                        type: 'doughnut',
                        data: {
                            labels: labels_by_cnt,
                            datasets: [
                                {
                                    label: '비율',
                                    data: data_by_cnt,
                                    fill: false,
                                    backgroundColor: bgColor_by_cnt,
                                    // borderColor: 'rgb(77, 148, 255)'
                                },
                            ]
                        },
                        options: {
                            maintainAspectRatio: false,
                            legend: {
                                display: true,
                                labels: {
                                    fontSize: 13,
                                    fontStyle: 'bold',
                                    fontFamily: 'SUIT Variable'
                                }
                            },
                            /*
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        // max: 100,
                                        // beginAtZero: true,
                                        // stepSize: 20,
                                        fontSize: 11,
                                        fontStyle: 'bold',
                                        fontFamily: 'SUIT Variable'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: '매출 금액(원)',
                                        fontColor: '#ff6798',
                                        fontStyle: 'bold',
                                        fontSize: 13,
                                        fontFamily: 'SUIT Variable',
                                        // padding: 10
                                    }
                                }],
                                xAxes: [{
                                    ticks: {
                                        fontSize: 13,
                                        fontStyle: 'bold',
                                        fontFamily: 'SUIT Variable'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: '업체',
                                        fontColor: '#ff6798',
                                        fontStyle: 'bold',
                                        fontSize: 13,
                                        fontFamily: 'SUIT Variable'
                                    }
                                }]
                            },
                            */
                            plugins: {
                                datalabels: {
                                    color: '#fff',
                                    // align: 'right',
                                    anchor: 'top',
                                    font: {                                        
                                        lineHeight: 1.6,
                                        family: 'SUIT Variable',
                                        size: 13,
                                    },
                                    formatter: function (value, ctx) {
                                        // return ctx.chart.data.labels[ctx.dataIndex];
                                        if(value > 5) return `${value}%`;
                                        else return ''
                                    }
                                }
                            }
                        }
                    }

                    if(window.myBarChartCompanyByCnt != null) {
                        window.myBarChartCompanyByCnt.destroy();
                    }
                    window.myBarChartCompanyByCnt = new Chart(ctx_company_by_cnt, config_company_by_cnt);
                    window.myBarChartCompanyByCnt.data.labels = labels_by_cnt;
                    window.myBarChartCompanyByCnt.data.datasets[0].data = data_by_cnt;
                    window.myBarChartCompanyByCnt.update();

                    // 테이블 데이터
                    let html = '';

                    if(company_list_by_rate.length == 0) {
                        html += `<tr><td colspan='4' class='no-data'>조회된 데이터가 없습니다.</td></tr>`;

                    } else {
                        for(let i=0; i<company_list_by_rate.length; i++) {
                            html += `<tr>`;
                            html += `    <td>${company_list_by_rate[i].company_name}</td>`;
                            html += `    <td class="txt_right">${addCommas(company_list_by_rate[i].cnt)} 건</td>`;
                            html += `    <td class="txt_right">${addCommas(company_list_by_rate[i].sales_price)} 원</td>`;
                            html += `    <td class="txt_right">${addCommas(company_list_by_rate[i].profit_loss)} 원</td>`;
                            html += `</tr>`;
                        }
                    }

                    $("#list-table-company tbody").empty().append(html);

                    // 업체별 손익금액                    
                    const labels_by_price = [];
                    const data_by_price = [];

                    for(let i=0; i<company_list_by_profit.length; i++) {
                        labels_by_price.push(company_list_by_profit[i].company_name);
                        data_by_price.push(company_list_by_profit[i].profit_loss);
                    }
                    
                    const ctx_company_by_price = document.getElementById('ctx_company_by_price');
                    const config_company_by_price = {
                        type: 'bar',
                        data: {
                            labels: labels_by_price,
                            datasets: [
                                // {
                                //     label: '손익 금액',
                                //     data: data_by_price,
                                //     fill: false,
                                //     backgroundColor: 'rgb(255, 103, 152)',
                                //     borderColor: 'rgb(255, 103, 152)',
                                //     type: 'line'
                                // },
                                {
                                    label: '손익 금액',
                                    data: data_by_price,
                                    fill: false,
                                    backgroundColor: 'rgb(255, 103, 152)',
                                    borderColor: 'rgb(255, 103, 152)'
                                },
                            ]
                        },
                        options: {
                            maintainAspectRatio: false,
                            legend: {
                                display: false,
                                labels: {
                                    fontSize: 14,
                                    fontStyle: 'bold',
                                    fontFamily: 'SUIT Variable'
                                }
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        // max: 100,
                                        // beginAtZero: true,
                                        // stepSize: 20,
                                        fontSize: 11,
                                        fontStyle: 'bold',
                                        fontFamily: 'SUIT Variable'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: '손익 금액(원)',
                                        fontColor: '#ff6798',
                                        fontStyle: 'bold',
                                        fontSize: 13,
                                        fontFamily: 'SUIT Variable',
                                        // padding: 10
                                    }
                                }],
                                xAxes: [{
                                    // barThickness : 80,
                                    maxBarThickness : 80,
                                    barPercentage : 0.4,
                                    ticks: {
                                        fontSize: 13,
                                        fontStyle: 'bold',
                                        fontFamily: 'SUIT Variable'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: '업체',
                                        fontColor: '#ff6798',
                                        fontStyle: 'bold',
                                        fontSize: 13,
                                        fontFamily: 'SUIT Variable'
                                    }
                                }]
                            },
                            plugins: {
                                datalabels: {
                                    color: '#111',
                                    align: 'right',
                                    anchor: 'top',
                                    font: {
                                        lineHeight: 1.6
                                    },
                                    formatter: function (value, ctx) {
                                        return '';
                                    }
                                }
                            }
                        }
                    }

                    if(window.myBarChartCompanyByPrice != null) {
                        window.myBarChartCompanyByPrice.destroy();
                    }
                    window.myBarChartCompanyByPrice = new Chart(ctx_company_by_price, config_company_by_price);
                    window.myBarChartCompanyByPrice.data.labels = labels_by_price;
                    window.myBarChartCompanyByPrice.data.datasets[0].data = data_by_price;
                    window.myBarChartCompanyByPrice.update();
                }
            }, 150)
        }
    });
}

// 기간 검색
function searchData(type) {
    const search_month = $("[name='search_month']").val();
    const start_month = $("[name='start_month']").val();
    const end_month = $("[name='end_month']").val();

    if(type == 'sales') {
        if(!search_month) {
            alert("날짜를 선택해주세요.");
            return false;
        }

        $("[name='save_search_month']").val(search_month);

    } else {
        if(start_month) {
            if(!end_month) {
                alert('종료년월을 설정해주세요.');
                return false;
            }
        }

        if(end_month) {
            if(!start_month) {
                alert('시작년월을 설정해주세요.');
                return false;
            }
        }

        if(start_month && end_month) {
            if(start_month > end_month) {
                alert('검색할 날짜를 재설정해주세요.');
                return false;
            }
        }

        $("[name='save_start_month']").val(start_month);
        $("[name='save_end_month']").val(end_month);
    }

    getSalesReport(type);
}