var valueList = document.getElementById('valueList');
var text ='<span> You have selected : </span>';
var areaList = []; //지역
var typeOfBusinessList=[]; //업종
var typeOfCompany=[];//기업형태
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

var employ_checkboxes = document.querySelectorAll('.checkbox_employ');//기업 형태
for(var checkbox of employ_checkboxes){
    checkbox.addEventListener('click',function(){
        if(this.checked ==true){
            typeOfCompany.push(this.value);
            valueList.innerHTML = text + typeOfCompany.join(',');
           }
        else{
            typeOfCompany = typeOfCompany.filter(e => e !== this.value);
            valueList.innerHTML = text + typeOfCompany.join(',');
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
    let area = areaList.join();
    let industry=typeOfBusinessList.join();
    let company_type=typeOfCompany.join();
    alert(area)
    alert(industry)
    alert(company_type)

    

    $.ajax({
        type:'GET',
        url:'/employtest',
        dataType:'json',
        data:{'area':area,'industry':industry,'company_type':company_type},
        success: function (data_list) {
            alert("여기");
            console.log(data_list);
            let li = data_list[""];
            for (let i = 0; i < data_list.length; i++) {
                li +=
                '<li class="item"><div class = "box-text"><div class="box-btn-area"><a class="btn btn-default btn-md"><div><span>☆ 관심기업 등록하기</span></div></a>'
                +'<a class="btn btn-default btn-md" href=\'/company/'+
                data_list[i].data_id + '#location_map' +'\';" style="cursor:pointer">'
                +'<div><span>일자리 지도 보기</span></div></a><!-- 1라인--><span class="grid-sub-blue">' + 
                data_list[i]["industry"] +
                '</span><a onclick="location.href=\'/company/'
                + data_list[i].data_id +'\';" style="cursor:pointer"><p class="grid-title">' +
                data_list[i]["company"] +
                '</p></a><p class="condition-sub-text">' +
                data_list[i]["company_type"] +
                " | " +
                data_list[i]["region"] +
                " | " +
                data_list[i]["CEO"] +
                "</p></div></div></li>";
                let CEO = data_list[i]["CEO"];
                let company = data_list[i]["company"];
                let industry = data_list[i]["industry"];
                let company_type = data_list[i]["company_type"];
                let region = data_list[i]["region"];
                let tag = data_list[i]["tag"];
                console.log(CEO, company, industry, company_type, region, tag);
            }
            console.log(li);
            const ul = document.querySelector("#companyListArea");
            ul.innerHTML = li;
            },
            error: function (request, status, error) {
            console.log(request, status, error);
            },
        });
}

