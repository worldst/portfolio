var draggedEventIsAllDay;
var activeInactiveWeekends = true;

function getDisplayEventDate(event) {

  var displayEventDate;

  if (event.allDay == false) {
    var startTimeEventInfo = moment(event.start).format('HH:mm');
    var endTimeEventInfo = moment(event.end).format('HH:mm');
    displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
  } else {
    displayEventDate = "하루종일";
  }

  return displayEventDate;
}

function filtering(event) {
  var show_type = true;

  var type = $('input:checkbox.filter:checked').map(function () {
    return $(this).val();
  }).get();
  show_type = type.indexOf(event.type) >= 0;

  return show_type;
}

function calDateWhenResize(event) {

  var newDates = {
    startDate: '',
    endDate: ''
  };

  if (event.allDay) {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD');
    newDates.endDate = moment(event.end._d).subtract(1, 'days').format('YYYY-MM-DD');
  } else {
    newDates.startDate = moment(event.start._d).format('YYYY-MM-DD HH:mm');
    newDates.endDate = moment(event.end._d).format('YYYY-MM-DD HH:mm');
  }

  return newDates;
}
var calendar = $('#calendar').fullCalendar({
  editable: true,
  eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
    revertFunc();
  },
  eventRender: function (event, element, view) {
    //일정에 hover시 요약
    element.popover({
      title: $('<div />', {
        class: 'popoverTitleCalendar',
        text: event.title
      }).css({
        'background': event.backgroundColor,
        'color': event.textColor
      }),
      content: $('<div />', {
          class: 'popoverInfoCalendar'
        }).append('<p><strong>제목:</strong> ' + event.subject + '</p>')
        .append('<p><strong>구분:</strong> ' + event.type + '</p>')
        //.append('<p><strong>시간:</strong> ' + getDisplayEventDate(event) + '</p>')
        .append('<div class="popoverDescCalendar"><strong>내용:</strong> ' + event.description + '</div>'),
      delay: {
        show: "800",
        hide: "50"
      },
      trigger: 'hover',
      placement: 'top',
      html: true,
      container: 'body'
    });

    return filtering(event);

  },
  

  /*//주말 숨기기 & 보이기 버튼
  customButtons: {
    viewWeekends: {
      text: '주말',
      click: function () {
        activeInactiveWeekends ? activeInactiveWeekends = false : activeInactiveWeekends = true;
        $('#calendar').fullCalendar('option', {
          weekends: activeInactiveWeekends
        });
      }
    }
  },*/

  header: {
    left: '',
    center: 'prev, title, next',
    right: ''
  },
  views: {
    month: {
      columnFormat: 'dddd'
    },
    agendaWeek: {
      columnFormat: 'M/D ddd',
      titleFormat: 'YYYY년 MM월 DD일',
      eventLimit: false
    },
    agendaDay: {
      columnFormat: 'dddd',
      eventLimit: false
    },
    listWeek: {
      columnFormat: ''
    },
  },

  /* ****************
  *  일정 받아옴 
  * ************** */
 // events: function (start, end, timezone, callback) {
 //   // start 는 시작지점
 //    // end 는 종료지점
 //    //alert(moment(start).format('YYYY-MM-DD'));
 //    //alert(moment(end).format('YYYY-MM'));
 //    $.ajax({
 //      method: "get",
 //      url: "/approval/calendar/search/",
 //      data: {
 //        start : moment(start).format('YYYY-MM-DD'),
 //        end : moment(end).format('YYYY-MM-DD'),
 //      },
 //      success: function (response) {
 //        var fixedDate = response.result.map(function (array) {
 //          if (array.allDay && array.start !== array.end) {
 //            // 이틀 이상 AllDay 일정인 경우 달력에 표기시 하루를 더해야 정상출력
 //            array.end = moment(array.end).add(1, 'days');
 //          }
 //          return array;
 //        })
 //        callback(fixedDate);
 //      }
 //    });
 //  },

  eventAfterAllRender: function (view) {
    if (view.name == "month") {
      $(".fc-content").css('height', 'auto');
    }
  },

  //일정 리사이즈
  eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
     event.editable = false;
    $('.popover.fade.top').remove();

    /** 리사이즈시 수정된 날짜반영
     * 하루를 빼야 정상적으로 반영됨. */
    var newDates = calDateWhenResize(event);

    //리사이즈한 일정 업데이트
    $.ajax({
      type: "get",
      url: "",
      data: {
        //id: event._id,
        //....
      },
      success: function (response) {
        alert('수정: ' + newDates.startDate + ' ~ ' + newDates.endDate);
      }
    });

  },
  //이벤트 클릭시 수정이벤트
  eventClick: function (event, jsEvent, view) {
    //editEvent(event);
  },
  // dayClick: function(date, allDay, jsEvent, view) {
  //   var yy=date.format("YYYY");
  //   var mm=date.format("MM");
  //   var dd=date.format("DD");
  //   var ss=date.format("dd");
  //   alert(date);
  // }, 
  locale: 'ko',
  timezone: "local",
  nextDayThreshold: "09:00:00",
  allDaySlot: true,
  displayEventTime: true,
  displayEventEnd: true,
  firstDay: 0, //월요일이 먼저 오게 하려면 1
  weekNumbers: false,
  selectable: true,
  weekNumberCalculation: "ISO",
  eventLimit: true,
  views: {
    month: {
      eventLimit: 12
    }
  },
  eventLimitClick: 'week', //popover
  navLinks: false,  //날짜클릭시 day 이동 없애기 살리려면 True로 바꿔야됨.
  //defaultDate: moment('2019-05'), //실제 사용시 삭제
  timeFormat: 'HH:mm',
  defaultTimedEventDuration: '01:00:00',
  editable: true,
  minTime: '00:00:00',
  maxTime: '24:00:00',
  slotLabelFormat: 'HH:mm',
  weekends: true,
  nowIndicator: true,
  dayPopoverFormat: 'MM/DD dddd',
  longPressDelay: 0,
  eventLongPressDelay: 0,
  selectLongPressDelay: 0
});
$(function(){
  $('.fc-day-number').click(function(event){
    event.preventDefault();
  });
});



// $('.fc-prev-button').click(function(){
//   alert($(".fc-center h2").text());
// });
// $('.fc-next-button').click(function(){
//   alert($(".fc-center h2").text());
// });