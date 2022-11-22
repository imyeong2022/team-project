var valueList = document.getElementById('valueList');
var text ='<span> You have selected : </span>';
var areaList = []; //지역
var industry =[]; //업종
var tag = []; //태그

var checkboxes = document.querySelectorAll('.checkbox');


for(var checkbox of checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            areaList.push(this.value);
            valueList.innerHTML = text + areaList.join(',');
           }
        else{
            areaList = areaList.filter(e => e !== this.value);
            valueList.innerHTML = text + areaList.join(',');
        }
    })
}

function checkbox_test(){
    let str = areaList.join();
    alert(str)
    const param ={'area':str};
    $.ajax({
        type:'GET',
        url:'/search',
        dataType:'json',
        data:param,
        success: function (data) {
            alert('여기')
            console.log(data);
            let html_tr='<tr>';
                html_tr +='<th>NAME</th>'
                html_tr +='<th>Phone</th>'
                html_tr +='<th>BIRTH</th>'
        for(let rows of data){
            html_tr+='<tr>';
            for(r of rows){
                html_tr+='<td>';
                html_tr+=r;
                html_tr+='</td>';
            }
            html_tr +='</tr>'; 
        }  
        
        $('#test').html(html_tr);
    },
        error: function (request, status, error) {
            console.log(request, status,error);
        }
    });   
}
