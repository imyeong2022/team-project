var valueList = document.getElementById('valueList');
var text ='<span> You have selected : </span>';
var areaList = []; //지역
var typeOfBusinessList=[]; //업종
var typeOfEmploymentList=[];//고용형태
var careerList=[]; //경력

var area_checkboxes = document.querySelectorAll('.checkbox_area');//지역 
for(var checkbox of area_checkboxes){
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
var business_checkboxes = document.querySelectorAll('.checkbox_business');//업종 
for(var checkbox of business_checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            typeOfBusinessList.push(this.value);
            valueList.innerHTML = text + typeOfBusinessList.join(',');
           }
        else{
            typeOfBusinessList = typeOfBusinessList.filter(e => e !== this.value);
            valueList.innerHTML = text + typeOfBusinessList.join(',');
        }
    })
}

var employ_checkboxes = document.querySelectorAll('.checkbox_employ');//고용형태
for(var checkbox of employ_checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            typeOfEmploymentList.push(this.value);
            valueList.innerHTML = text + typeOfEmploymentList.join(',');
           }
        else{
            typeOfEmploymentList = typeOfEmploymentList.filter(e => e !== this.value);
            valueList.innerHTML = text + typeOfEmploymentList.join(',');
        }
    })
}

var career_checkboxes = document.querySelectorAll('.checkbox_career');//경력 
for(var checkbox of career_checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            careerList.push(this.value);
            valueList.innerHTML = text + careerList.join(',');
           }
        else{
            careerList = careerList.filter(e => e !== this.value);
            valueList.innerHTML = text + careerList.join(',');
        }
    })
}


function checkbox_test(){
    let str = areaList.join();
    alert(str)
    const param ={'area':str};
    $.ajax({
        type:'GET',
        url:'/employtest',
        dataType:'json',
        data:param,
        success: function (data) {
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

