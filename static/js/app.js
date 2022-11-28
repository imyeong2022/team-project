var valueList = document.getElementById('employ_value');
var text ='<span> You have selected : </span>';
var areaList = []; //지역
var typeOfBusinessList=[]; //업종
var career_details=[];//경력 
var education_list=[]; //학력

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

var career_checkboxes = document.querySelectorAll('.career_details');//경력
for(var checkbox of career_checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            career_details.push(this.value);
            valueList.innerHTML = text + career_details.join(',');
           }
        else{
            career_details = career_details.filter(e => e !== this.value);
            valueList.innerHTML = text + career_details.join(',');
        }
    })
}

var education_checkboxes = document.querySelectorAll('.education');//학력
for(var checkbox of education_checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            education_list.push(this.value);
            valueList.innerHTML = text + education_list.join(',');
           }
        else{
            education_list = education_list.filter(e => e !== this.value);
            valueList.innerHTML = text + education_list.join(',');
        }
    })
}


function employ_checkbox(){
    let area = areaList.join();
    let industry=typeOfBusinessList.join();
    let career_detail=career_details.join();
    let education=education_list.join();

    alert(area)
    alert(industry)
    alert(career_detail)
    alert(education)

    $.ajax({
        type:'GET',
        url:'/employtest',
        dataType:'json',
        data:{'area':area,'industry':industry,'career_detail':career_detail,'education':education},
        success: function (data_list) {
            alert("여기");
            console.log(data_list);
            let li = data_list[""];
            for (let i = 0; i < data_list.length; i++) {
                li +=
                '<li><div><div><a onClick="window.location.reload()" style="cursor: pointer;"></a>'+
                '<a class="btn btn-default btn-md header-logo-a" href='+data_list[i]["url"]+
                '><div><span class="col75">지원하러 가기</span></div></a><span class="grid-sub-blue"></span>'+
                '<a onclick="#" style="cursor:pointer">'+
                '<p class="grid-title" id="company_title">'+data_list[i]["company"]+'</p>'+
                '<p class="grid-title" id="company_title">'+data_list[i]["title"]+'</p></a>'+
                '<p class="condition-sub-text">'+data_list[i]["region"]+'|'+
                data_list[i]["career_details"]+'|'+
                data_list[i]["education"]+'|'+
                data_list[i]["work_type"]+'|'+
                data_list[i]["salary"]+'|'+
                data_list[i]["d_day"]+'</p></div></div><div><ul class="tag"></ul></div></li>';
                let region = data_list[i]["region"];
                let career_details = data_list[i]["career_details"];
                let education = data_list[i]["education"];
                let work_type = data_list[i]["work_type"];
                let salary = data_list[i]["salary"];
                let d_day = data_list[i]["d_day"];
                console.log(region, career_details, education, work_type, salary, d_day);        
                    
            }   
                        
            console.log(li);
            const ul = document.querySelector("#employListArea");
            ul.innerHTML = li;
            },
            error: function (request, status, error) {
            console.log(request, status, error);
            },
        });
}

