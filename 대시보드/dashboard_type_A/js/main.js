$(function() {
  
    /* 기간 클릭 시 액션 */
    $(".date-select-box .date").click(function () {
        $(".date-select-box .date").removeClass('act');
        $(this).addClass('act');
    });

    var totalOrderNumTemp = 0; // 그래프 수치 주문 합 저장
    var totalProgressNumTemp = 0; // 그래프 수치 처리 합 저장

    var totalOrderNum = $("#orderTotalNum"); // 그래프 수치 주문 합 실제 값
    var totalProgressNum = $("#progressTotalNum"); // 그래프 수치 처리 합 실제 값

    /* 세이프티 발주점검 그래프 수치 */
    $(".safety .inner-table tr").each(function() {
        const ALL_ORDER_NUM = 300; // 총 주문수량 기준값
        const ALL_PROGRESS_NUM = 200; // 총 처리수량 기준값

        var order = $(this).find('p.order'); // 주문수량 비율 위치
        var progress = $(this).find('p.progress'); // 처리수량 비율 위치

        var orderNum = Number($(this).find('span.orderNum').text()); // 주문수량
        var progressNum = Number($(this).find('span.progressNum').text()); // 처리수량
        
        var orderRate = Math.round(Number((orderNum / ALL_ORDER_NUM)) * 100) // 주문수량 비율 반올림 계산
        var progressRate = Math.round(Number((progressNum / ALL_PROGRESS_NUM)) * 100) // 처리수량 비율 반올림 계산

        order.animate({
            "width" : orderRate + '%'
        },1700); // 주문수량 비율 적용

        progress.animate({
            "width" : progressRate + '%'
        },1700); // 처리수량 비율 적용

        totalOrderNumTemp += orderNum; // 그래프 수치 주문 합 계산
        totalProgressNumTemp += progressNum; // 그래프 수치 처리 합 계산
    });

    totalOrderNum.val(addCommas(totalOrderNumTemp)); // 주문 합 적용
    totalProgressNum.val(addCommas(totalProgressNumTemp)); // 처리 합 적용

    /* 카운트 업 애니메이션 */
    $(".graphNum").counterUp({
        delay : 10,
        time : 1300
    });

    $(".input-box input").on("keyup", function() {
      $(this).val(addCommas($(this).val().replace(/[^0-9]/g,"")));
    });

    /* chartist.js */
    var data = {
      title: "title",
      labels: ['2020-05-18', '2020-05-19', '2020-05-20', '2020-05-21', '2020-05-22'],
      series: [
        {
          name : "작업지시",
          data : [100, 100, 100, 100, 100]
        },
        {
          name : "작업완료",
          data : [10, 50, 20, 40, 70]
        }
      ]
    };
    
    var options = {
      seriesBarDistance: 50, // bar 간격
      low : 0, // y축 최소값
      high : 100, // y축 최대값
      chartPadding : {
        top : 15,
        left : 0,
        right : 0,
        bottom : 5
      },
      axisY: {
        type: Chartist.FixedScaleAxis,
        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // y축 step 설정
      },
      plugins: [
        Chartist.plugins.legend()
      ]
    };
    
    var responsiveOptions = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 30
      }],
      ['screen and (max-width: 400px)', {
        seriesBarDistance: 20
      }]
    ];
    
    new Chartist.Bar('.ct-chart', data, options, responsiveOptions);
});

/* 3자리 단위마다 콤마 생성 */
function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* 콤마 제거 */
function removeComma(str) {
  n = parseInt(str.toString().replace(/,/g,""));
  return n;
}

/* 현재 시간 출력 */
function showTimer() {
    var currentDate = new Date();
    
    var hours = currentDate.getHours(); // 시
    var min = currentDate.getMinutes(); // 분
    var sec = currentDate.getSeconds(); // 초
    
    if(hours < 10) {
      hours = "0" + hours;
    }
    if(min < 10) {
      min = "0" + min;
    }
    if(sec < 10) {
      sec = "0" + sec;
    }

    $("#currentHour").text(hours);
    $("#currentMin").text(min);
    $("#currentSec").text(sec);

    setTimeout(showTimer, 1000);
  }
 
  
  /* amChart 
  am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var chart = am4core.create('chartdiv', am4charts.XYChart)
    chart.colors.step = 2;
    
    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top' // 타이틀 위치
    chart.legend.paddingBottom = 20 // 타이틀과 그래프 사이 여백
    chart.legend.labels.template.maxWidth = 200 // 타이틀 최대 길이

    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'category'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;
    
    var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.max = 100;
    
    function createSeries(value, name) {
        var series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'category'
        series.name = name
    
        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);
    
        var bullet = series.bullets.push(new am4charts.LabelBullet())
        bullet.interactionsEnabled = false
        bullet.dy = 20; // 그래프 내부 수치 상단 여백
        bullet.label.text = '{valueY}' 
        bullet.label.fontSize = 12; // 그래프 내부 수치 폰트 사이즈
        bullet.label.fill = am4core.color('#ffffff') // 그래프 내부 수치 색상
    
        return series;
    }
    
    chart.data = [
        {
            category: '2020-05-18',
            first: 80,
            second: 55
        },
        {
            category: '2020-05-19',
            first: 80,
            second: 78
        },
        {
            category: '2020-05-20',
            first: 100,
            second: 40
        },
        {
            category: '2020-05-21',
            first: 100,
            second: 33
        },
        {
            category: '2020-05-22',
            first: 100,
            second: 33
        }
    ]

    chart.responsive.enabled = true;

    createSeries('first', '작업지시');
    createSeries('second', '작업완료');
    
    function arrangeColumns() {
    
        var series = chart.series.getIndex(0);
    
        var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
            var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
            var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
            var delta = ((x1 - x0) / chart.series.length) * w;
            if (am4core.isNumber(delta)) {
                var middle = chart.series.length / 2;
    
                var newIndex = 0;
                chart.series.each(function(series) {
                    if (!series.isHidden && !series.isHiding) {
                        series.dummyData = newIndex;
                        newIndex++;
                    }
                    else {
                        series.dummyData = chart.series.indexOf(series);
                    }
                })
                var visibleCount = newIndex;
                var newMiddle = visibleCount / 2;
    
                chart.series.each(function(series) {
                    var trueIndex = chart.series.indexOf(series);
                    var newIndex = series.dummyData;
    
                    var dx = (newIndex - trueIndex + middle - newMiddle) * delta
    
                    series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                })
            }
        }
    }
    
    }); // end am4core.ready()
    */