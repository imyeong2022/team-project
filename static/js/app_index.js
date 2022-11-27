var valueList_index = document.getElementById("valueList_Index");
var text = "<span> You have selected : </span>";
var areaList = []; 
var checkboxes = document.querySelectorAll(".checkbox");

for (var checkbox of checkboxes) {
  checkbox.addEventListener("click", function () {
    if (this.checked == true) {
      areaList.push(this.value);
      valueList_index.innerHTML = text + areaList.join(",");
    } else {
      areaList = areaList.filter((e) => e !== this.value);
      valueList_index.innerHTML = text + areaList.join(",");
    }
  });
}

//[encode] - script
// var str = '한글';
// str = encodeURIComponent(str);  

// [decode] - script
// var decodeStr = decodeURIComponent(str);

const form = document.searchform;
function area_search() {
    let str = areaList.join();
    // str = encodeURIComponent(str);  // [encode]
    // var decodeStr = decodeURIComponent(str);
    // url => "GET /condition?areatag?여기들어오는 값(=str)"
    alert(str);
    alert('aaa');
    const param = { areatag: str };
    // $.ajax({
    //     type: "GET",
    //     url: "/searchIndex",
    //     dataType: "json",
    //     data: param,
    //     success: function (data_list) {
    //         console.log(data_list)
    //         let li = data_list[""];
        //     for (let i = 0; i < data_list.length; i++) {
        //         li +=
        //             '<li class="item"><div class = "box-text"><div class="box-btn-area"><a class="btn btn-default btn-md"><div><span>☆ 관심기업 등록하기</span></div></a>'
        //             +'<a class="btn btn-default btn-md" href=\'/company/'+
        //             data_list[i].data_id + '#location_map' +'\';" style="cursor:pointer">'
        //             +'<div><span>일자리 지도 보기</span></div></a><!-- 1라인--><span class="grid-sub-blue">' + 
        //             data_list[i]["industry"] +
        //             '</span><a onclick="location.href=\'/company/'
        //             + data_list[i].data_id +'\';" style="cursor:pointer"><p class="grid-title">' +
        //             data_list[i]["company"] +
        //             '</p></a><p class="condition-sub-text">' +
        //             data_list[i]["company_type"] +
        //             " | " +
        //             data_list[i]["region"] +
        //             " | " +
        //             data_list[i]["CEO"] +
        //             "</p></div></div></li>";
        //         let CEO = data_list[i]["CEO"];
        //         let company = data_list[i]["company"];
        //         let industry = data_list[i]["industry"];
        //         let company_type = data_list[i]["company_type"];
        //         let region = data_list[i]["region"];
        //         let tag = data_list[i]["tag"];
        //         console.log(CEO, company, industry, company_type, region, tag);
        //         }
        //         console.log(li);
        //         const ul = document.querySelector("#companyListArea");
        //         ul.innerHTML = li;
        //     },
        //     error: function (request, status, error) {
        //         console.log(request, status, error);
        // },
    
}