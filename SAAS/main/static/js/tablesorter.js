$(document).ready(function() {
    $(".table").bind('mouseup',function() {
        setTimeout(() => {
        for (var i = 0; i < $(".table tr").eq(0).children('th').length; i++) {
            var thClass = $(".table tr").eq(0).children('th').eq(i).attr('class');
            if (thClass.includes('headerAsc')) {
                $(".table tr").eq(0).children('th').eq(i).find('span').attr('class', 'glyphicon glyphicon-arrow-up');
            } else if (thClass.includes('headerDesc')) {
                $(".table tr").eq(0).children('th').eq(i).find('span').attr('class', 'glyphicon glyphicon-arrow-down');
            } else if (thClass.includes('headerUnSorted')) {
                $(".table tr").eq(0).children('th').eq(i).find('span').attr('class', 'glyphicon glyphicon-sort');
            }
        }
        },0);
    });

    $(".table").tablesorter({
        theme : 'defalut',
        widthFixed : true,
    
        widgets: ["filter", "stickyHeaders", "zebra"] , //[ 'uitheme', 'zebra', 'stickyHeaders' ],
    
        widgetOptions: {
    
          // css class name applied to the sticky header row (tr)
          stickyHeaders : 'tablesorter-stickyHeader',
    
          // adding zebra striping, using content and default styles - the ui css removes the background from default
          // even and odd class names included for this demo to allow switching themes
    
          // use uitheme widget to apply defauly jquery ui (jui) class names
          // see the uitheme demo for more details on how to change the class names
    
        }
    
      });
    //  $(".table").tablesorter({
    //     theme : 'defalut',
    //     widgets: [ 'filter', 'group', 'zebra' ],
    //     widgetOptions: {
    //       filter_reset         : '.reset',
    //       filter_childRows     : true,
    //       filter_childByColumn : true,
    //       filter_childWithSibs : false,
    //       group_collapsible    : true,
    //       group_collapsed      : false,
    //       group_count          : false
    //     }
    //  });
     for(var i=0; i<$("#myTable tr").eq(1).children('td').length;i++){
        $("#myTable tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
        $("#myTable-sticky tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
     }
     for(var i=0; i<$("#myTable2 tr").eq(1).children('td').length;i++){
        $("#myTable2 tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
        $("#myTable2-sticky tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
     }
     for(var i=0; i<$("#myTable3 tr").eq(1).children('td').length;i++){
        $("#myTable3 tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
        $("#myTable3-sticky tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
     }
     for(var i=0; i<$("#myTable4 tr").eq(1).children('td').length;i++){
        $("#myTable4 tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
        $("#myTable4-sticky tr").eq(1).children('td').eq(i).find('input').attr('class','tablesorter-filter form-control');
     }
});
