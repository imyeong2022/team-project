/**
 * 셀렉트(콤보박스)를 JSON 형태의 데이타를 동적 로딩하여 출력합니다.
 *
 * @param url JSON 형태의 데이타를 가져올 요청 URL
 * @param destination 로딩될 데이타를 출력할 셀렉트(콤보박스)
 * @param params 필요한 파라미터들(밑에 정의되어 있음)
 * @param parameters 요청에 전달될 파라미터 객체
 *
 * 사용법
	$("select[name='codeList1']").change(function(event) {
		var upCd = $(this).attr('selected', true).val();
		var cdLen = upCd.length + 3;
		loadSelect("./code_list.do",
			"select[name='codeList2']",
			{command:'codeList', value:'cd', text:'cdNm', noDataMsg:'하위 코드가 없습니다'},
			{upCd:upCd, cdLen:cdLen}
		);
	});
 */
    function loadSelect(url, destination, params, parameters, callBack) {
        var params = $.extend({
            command : 'command', //코멘드 객체명
            changeFn : '',
            value : 'value', //option의 value에 들어갈 command의 멤버변수명
            text : 'text', //option의 text에 들어갈 command의 멤버변수명
            oneWholeYn : '', //데이타가 한건 일때 전체  옵션 추가 여부
            oneWholeYnTxt : '전체',
            searchViewYn : '', //데이타 최상의에 '선택' 보여주기 여부
            selSelected : '',	//options 출력항목을 넘겨받은 value값으로 selected
            noDataMsg : '', //데이타가 없을 시 출력 할 메세지
            loadingMsg : '조회중입니다..' //로딩중에 출력 할 메세지
        }, params);
        var $dest = destination;
    
        $dest.empty();
    
        $.getJSON(url, parameters, function(data) {
            var optionHtml = "";
            var commandLen = data[params.command].length;
            
            if (commandLen > 0) {
                var i = 0;
    
                if (params.changeFn != '') {
                    $dest.attr("onChange", params.changeFn);
                }
    
                if (params.oneWholeYn != "") {
                    optionHtml += "<option value=''>" + params.oneWholeYnTxt + "</option>";
                }
    
                if (params.searchViewYn != "") {
                    optionHtml += "<option value=''>선택</option>";
                }
    
                $.each(data[params.command], function(entryIdx, entry) {
                    if (params.value != "") {
                        if (params.selSelected == entry[params.value]){
                            optionHtml += "<option value='" + entry[params.value] + "' selected>" + entry[params.text]+ "</option>";
                        } else {
                            optionHtml += "<option value='" + entry[params.value] + "'>" + entry[params.text]+ "</option>";
                        }
                    } else {
                        if (params.selSelected == entry){
                            optionHtml += "<option value='" + entry + "' selected>" + entry+ "</option>";
                        } else {
                            optionHtml += "<option value='" + entry + "'>" + entry+ "</option>";
                        }
                    }
                    i++;
                });
    
    
            } else {
                if (params.noDataMsg != '') {
                    optionHtml += "<option value=''>" + params.noDataMsg + "</option>";
                }
            }
            
            if (callBack) {
                $.when($dest.append(optionHtml)).then(callBack);
            } else {
                $dest.append(optionHtml);
            }
    
        });
    };