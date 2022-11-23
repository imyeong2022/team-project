var valueList = document.getElementById('valueList');
var text ='<span> You have selected : </span>';
var areaList = []; //지역
var typeOfBusinessList=[]; //업종
var typeOfEmploymentList=[];//기업형태
// var careerList=[]; //경력
var welfareList=[];

// var checkboxes = document.querySelectorAll('.checkbox_area');
var checkboxes = document.querySelectorAll('.checkbox');


for(var checkbox of checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            areaList.push(this.value);
            // typeOfBusinessList.push(this.value);
            // typeOfEmploymentList.push(this.value);
            // welfareList.push(this.value);
            valueList.innerHTML = text + areaList.join(',');
           }
        else{
            areaList =  areaList.filter(e=> e !== this.value);
            valueList.innerHTML = text + areaList.join(',');
            // typeOfBusinessList = typeOfBusinessList.filter(e => e !== this.value);
            // typeOfEmploymentList = typeOfEmploymentList.filter(e => e !== this.value);
            // welfareList = welfareList.filter(e => e !== this.value);
            
        }

    })
}



function checkbox_test(){
    let str= areaList.join();
    alert(str)
    const param ={'area':str};
    // alert(areaList, typeOfBusinessList, typeOfEmploymentList, welfareList)
    // const industry="'건설업', '도매 및 소매업', '제조업'"
    // const param ={'industry':industry};
    $.ajax({
        type:'GET',
        url:'/employtest',
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
