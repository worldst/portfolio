const status = {
    'WAIT' : '대기',
    'START' : '시작',
    'CANCEL' : '취소',
    'PAUSE' : '정지',
    'PART' : '부분완료',
    'COMPLT' : '완료',
}

$(function() {
    GetProjectDashboard();
    thAdd();
});


function thAdd(){
    const thProcessnamelist = JSON.stringify($("input[name='process_name_list']").val()); 
    let thName = thProcessnamelist.split(',')
    //console.log(thName)
    
    
    
    console.log(typeof thProcessnamelist);
    console.log(typeof thName);
    console.log(thProcessnamelist);
    

    let html = '';
    $(".table thead").empty(); 
    
    html += `<tr>`;
    html += `<th>납기일</th>`;
    html += `<th>현장명</th>`;
    
    
    for(let k=0; k<thName.length; k++) {
        html += `<th>${thName[k]}</th>`;
    }


    html += `</tr>`;
    $(".table thead").append(html);
}

function GetProjectDashboard() {
    const process_name_list = JSON.stringify($("input[name='process_name_list']").val());
    //공정명 값 가져온것.
    //console.log('-----')
    //console.log(process_name_list)


    $.ajax({
        url : '/api/sales/dashboard',
        type : 'GET',
        success : function(data) {
            let html = '';
            let process_length = 5; //process_name_list  공정명 길이 5만큼

            
            $(".table tbody").empty();
            for(let i=0; i<data.length; i++) {
                html += `<tr data-id="${data[i].id}">`;
                // html += `   <td class="alignLeft">${data[i].company_id}</td>`;
                html += `   <td>${(data[i].due_dt).split("T")[0]}</td>`;
                html += `   <td class="alignLeft">${data[i].pjt_name}</td>`;
                
                //console.log(data[i].op)
                // for(let j=0; j<data[i].op.length; j++) {
                //     console.log(j)
                //     html += `   <td class="alignLeft">${data[i].op[j].process}</td>`;
                // } 

                for(let j=0; j<process_length; j++){ 
                    //console.log(j);
                    if (j < data[i].op.length) {  
                        html += `<td class="alignLeft">${data[i].op[j].status}</td>`;
                    } else {
                        html += `<td></td>`; // 데이터가 없다면 빈 td를 그려라
                    }
                } //status 추가한거
                // html += `   <td class="alignLeft">${data[i].op.length}</td>`;
                // html += `   <td style="font-weight:bold;">${status[data[i].work_status]}</td>`;
                // html += `   <td style="font-weight:bold;">${status[data[i].shipment_status]}</td>`;
                html += `</tr>`;
            }

            $(".table tbody").append(html);


            // 상태별 색상 처리
            $(".table tbody tr").each(function() {
                const $td = $(this).children("td");

                $td.each(function(i) {
                    if(i == 14 || i == 15) {
                        if($(this).text() == '대기') {
                            $(this).css("background","#b1b1b1");
                        } else if($(this).text() == '진행중') {
                            $(this).css("background","#4fd1ef");
                        } else if($(this).text() == '완료') {
                            $(this).css("background","#ff6d66");
                        } else if($(this).text() == '취소') {
                            $(this).css("background","#fff366");
                        }
                    }
                });
            });


            $("#myTable").trigger("update");

            //fn_autoHtmlTrRowspan("#myTable tbody", '0', null, true);

            // $(".container-fluid").show();
            setTimeout(GetProjectDashboard, 10000);
        }
    });
}