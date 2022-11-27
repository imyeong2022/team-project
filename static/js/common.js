var contextPath = getContextPath();
var dev = {
	isLogin : false,
	init : function() {
		dev.bind();
		visitCheck();
	},
	bind : function() {
		/**
		 * UI Select box bind
		 */
		$(document).on("click", ".select-box .select-list li", function(){
			$this = $(this);
			var $box = $this.closest(".select-box");
			var $span = $this.find("span");
			var value = "";

			if(typeof $span.data("value") != "undefined"){
				value = $span.data("value");
			} else {
				value = $span.text();
			}

			$box.children("input:hidden:eq(0)").val(value);
		});

		/**
		 * 문자 정규식 적용
		 */
		$("input[text-type*='exceptNumber']").on("keypress keyup", function(event){
			return dev.regexp.exceptNumber(event);
		});

		$("input[text-type*='onlyNumber']").on("keypress keyup", function(event){
			return dev.regexp.onlyNumber(event);
		});

		$("input[text-type*='onlyText']").on("keypress", function(event){
			return dev.regexp.onlyText(event);
		});

		/**
		 *  로그아웃
		 */
		$("a#logout, button#logout").on("click", function(){
			dev.action.logout($(this).data("usertype"), null, true);
		});

		$("input[enterkey-func]").on("keydown", function(event){
			if (event.keyCode == 13){
				eval($(this).attr("enterkey-func"));
			}
		});
	},
	renderer : {
		share : function() {
			var display = $("section.container").attr("share-util");

			if (display == "on") {
				$("div.util-area").children(".page-func").show();
			} else {
				$("div.util-area").children(":not('ol.breadcrumb')").remove();
			}
		}
	},
	action : {
		login : function() {
			// contextPath 추가 22.01.03
			location.href = contextPath + "/login";
		},
		loginWithConitue : function() {
			// contextPath 추가 22.01.04
			location.href = contextPath + "/login?continue=" + encodeURIComponent(location.href);
		},
		logout : function(usertype, url, isConfirm) {
			if (isConfirm && !confirm("로그아웃 하시겠습니까?")) {
				return false;
			}

			var $form = $('<form></form>');
			/* contextPath 추가 22.01.03 */
			$form.attr('action', contextPath + "/j_spring_security_logout");
			$form.attr('method', 'post');
			$form.appendTo('body');

			var $usertype = $("<input type='hidden' value=" + usertype + " name='j_usertype'>");
			$form.append($usertype);

			if (url) {
				if(url.indexOf(location.host) === -1){
					url = location.origin + url;
				}
				var $continue = $("<input type='hidden' value=" + url + " name='continue'>");
				$form.append($continue);
			}

			$form.submit();
		},
		searchType : {
			validate : function(selector, callback, failCallback){
				var submitFlag = true;
				var sno;
				$(selector).each(function(){
					if(submitFlag){
						sno = $(this).data("sno");
						if(typeof $("[name='companyTypeSearchAnswers[" + (sno-1) + "].answr']:checked").val() == "undefined"){
							submitFlag = false;
						}
					}
				});

				if(submitFlag){
					callback();
				} else {
					failCallback(sno);
				}
			}
		}, browserCompatibleCheck : function(){
			var browse = navigator.userAgent.toLowerCase();

			// 익프플로러 제어
			if ((navigator.appName == 'Netscape' && browse.indexOf('trident') > -1) || (browse.indexOf("msie") > -1)) {
				if (browse.indexOf("msie") > -1) {
					if (browse.indexOf("msie 8.0") > -1) {
						location.href = contextPath + "/browser?version=8";
					} else if (browse.indexOf("msie 7.0") > -1) {
						location.href = contextPath + "/browser?version=7";
					} else if (browse.indexOf("msie 6.0") > -1) {
						location.href = contextPath + "/browser?version=6";
					}
				}
			}
		},
		loading : {
			show : function(){
				$(".loading_wrap").show();
			},
			hide : function(){
				$(".loading_wrap").hide();
			}
		},
		enterSubmit: function(callback){
			if (event.keyCode === 13) {
				callback();
				event.preventDefault();
			}
		},
		slfdgnsScoreCnvr: function(orignlScore){
			return ((orignlScore)/(7))*10;
		},
		unexpsrCmpAlert: function(){
			alert("해당 기업은 현재 비노출 처리되어있습니다.");
		}
	},
	regexp : {
		exceptNumber : function(event) {
			var keyId = (event.which) ? event.which : event.keyCode;

			event.target.value = event.target.value.replace(/[0-9]/gi, "");

			return ((keyId >= 97 && keyId <= 122) || (keyId >= 65 && keyId <= 90));
		},
		onlyNumber : function(event) {
			var keyId = (event.which) ? event.which : event.keyCode;

			event.target.value = event.target.value.replace(/[^0-9]/gi, "");

			return (keyId >= 48 && keyId <= 57);
		},
		onlyText : function(event){
			var keyId = (event.which) ? event.which : event.keyCode;
			var regexp = /[^a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]/gi;
			event.target.value = event.target.value.replace(regexp, "");

			return ((keyId >= 97 && keyId <= 122) || (keyId >= 65 && keyId <= 90)) || (keyId >= 12593 && keyId <= 12684) || (keyId >= 44032 && keyId <= 55203);
		}
	}
}

/**
 * 지정된 URL(페이지 주소)로 이동합니다
 *
 * @param url 이동할 URL(페이지 주소)
 */
function move(url) {
	location.href = url;
}

/**
 * 부모페이지를 지정된 URL(페이지 주소)로 이동합니다
 *
 * @param url 이동할 URL(페이지 주소)
 */
function parentMove(url) {
	opener.location.href = url;
}

/**
 * URL을 호출하여 HTML을 가져온다.
 *
 * @param fileUrl
 * @param parameter
 * @param callback
 */
function loadHtmlAjax(url, type, params, callback, async) {
	var ajax = $.ajax({
		dataType: "html",
		async: async,
		url: url,
		type: type,
		data: params,
		//contentType: "application/x-www-form-urlencoded",
		success: function(data) {
			callback(data, params);
		},
		error : function(err) {}
	});
}

/**
 * URL을 호출하여 Json 데이터를 가져온다.
 *
 * @param fileUrl
 * @param parameter
 * @param callback
 */
function loadJsonAjax(url, type, params, callback, async) {
	var ajax = $.ajax({
		dataType: "json",
		async: async,
		url: url,
		type: type,
		data: params,
		success: function(data) {
			callback(data, params);
		},
		error : function(err) {}
	});
}

/**
 * 팝업형태로 새창을 오픈합니다
 *
 * @param url 오픈할 URL(페이지 주소)
 * @param width 팝업 넓이
 * @param height 팝업 높이
 */
function openWin1(url, width, height) {
	openWin(url, '', width, height, '', '');
}


/**
 * 팝업형태로 새창을 오픈합니다
 *
 * @param url 오픈할 URL(페이지 주소)
 * @param width 팝업 넓이
 * @param height 팝업 높이
 * @param scroll 스크롤 여부
 */
function openWin2(url, width, height, scroll) {
	openWin(url, '', width, height, scroll, '');
}

/**
 * 팝업형태로 새창을 오픈합니다
 *
 * @param url 오픈할 URL(페이지 주소)
 * @param width 팝업 넓이
 * @param height 팝업 높이
 * @param scroll 스크롤 여부
 * @param resize 리사이즈 여부
 */
function openWin3(url, width, height, scroll, resize) {
	openWin(url, '', width, height, scroll, resize);
}


/**
 * 팝업형태로 새창을 오픈합니다
 *
 * @param url 오픈할 URL(페이지 주소)
 * @param target 타켓
 * @param width 팝업 넓이
 * @param height 팝업 높이
 * @param scroll 스크롤 여부
 * @param resize 리사이즈 여부
 */
function openWin(url, target, width, height, scroll, resize) {
	var x = window.screenLeft;
	var y = window.screenTop;
	var left = x+((document.body.offsetWidth-width)/2);
	var top = y+((document.body.offsetHeight-height)/2);

	winParams = 'height='+height+',width='+width+',top='+top+',left='+left+',scrollbars='+scroll+',resizable='+resize;
	win = window.open(url, target, winParams);
	win.window.focus();
}

/**
 * 숫자에 있는 콤마를 제거합니다.
 *
 * @param val 콤마를 제거할 문자열
 */
function delComma(val) {
	val = val.replace(/,/gi,"");

	return val;
}

function setNumberFormat(el) {
	var val = el.value;
	var minusFlag = 0;

	if (val.charAt(0) == "-") {
		minusFlag = 1;
	}

	val = val.replace(/[^.0-9]/g ,"");
	val = val.replace(/[.]+/g ,".");

	if (minusFlag == 1) {
		el.value = "-" + numberFormat(val);
	} else {
		el.value = numberFormat(val);
	}
}

/**
 * 숫자 3자리마다 콤마를 추가합니다.
 *
 * @param num 콤마를 추가할 number
 */
function numberFormat(val) {
	var reg = /(^[+-]?\d+)(\d{3})/;
	var result = "" + val;

	while (reg.test(result)) {
		result = result.replace(reg, '$1' + ',' + '$2');
	}

	return result;
}

/**
 * 콤마 찍기
 *
 * @param str 콤마를 추가할 number
 */
function comma(str) {
	str = String(str);
	return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 콤마 해제
 *
 * @param str 콤마를 해제할 number
 */
function uncomma(str) {
	str = String(str);
	return str.replace(/[^\d]+/g, '');
}

/**
 * 콤마 해제
 *
 * @param str 콤마를 해제할 number
 */
function uncomma1(str) {
	str = String(str);
	return str.replace(/,/g, '');
}

/**
 * 숫자 3자리마다 실시간으로 콤마를 추가합니다.
 *
 * @param num 콤마를 추가할 number
 * <input type="text" onkeyup="inputNumberFormat(this)" />
 */
function inputNumberFormat(obj) {
	obj.value = comma(uncomma(obj.value));
}

/**
 * 콤마 해제
 *
 * @param text 콤마를 해제할 text
 */
function inputUncomma(text) {
	if ($("input[name='"+ text +"']").val() != "") {
		$("input[name='"+ text +"']").val($("input[name='"+ text +"']").val().replace(/[^\d]+/g, ''));
	}
}

/**
 * 숫자만 입력할 수 있게 합니다.
 *
 * @param val 숫자만 남기고 걸러낼 문자열
 */
function numberOnly(val) {
	re = /[^0-9]/gi;
	return val.replace(re, "");
}

/**
 * 영문만 입력할 수 있게 합니다.
 *
 * @param val 영문만 남기고 걸러낼 문자열
 */
function engOnly(val) {
	re = /[^a-zA-Z]/gi;
	return val.replace(re, "");
}

/**
 * 한글, 숫자, 특수문자는 입력할 수 없게하고 alert을 띄워줌.
 *
 * @param val 검사할 문자열
 */
function engOnlyAlert(txt) {
	var cnt = 0;

	for (i = 0; i < txt.length; i++) {
		if ((txt.charCodeAt(i) >= 65 && txt.charCodeAt(i) <= 122) || txt.charCodeAt(i) == 32) {
			// ascii
		} else {
			// not ascii
			cnt++;
		}
	}
	if (cnt > 0) alert("한글, 숫자, 특수문자는 입력하실 수 없습니다.");
	return (cnt > 0) ? false : true;
}

/**
 * 가장 앞 부분에는 0을 붙일 수 없게 함.
 *
 * @param val 문자열
 */
function numberLimitZero(val) {
	return val.substring(0, 1) == 0 ? '' : val;
}

/**
 * 숫자를 한글(숫자)문자로 변환한다
 * @param val - 숫자 또는 숫자 문자열
 * 사용예) numberToHan(12345) = "만이천삼백사십오"
 *
 * ( 참고URL:/meritzfire/wbiz/page/cyberservice/loan/loan_propose.do )
 */
function numberToHan(val) {
	var num;
	var result = "";

	if(!val || val.substr(0,1) == 0) {
		return result;
	} else {
		num = parseInt(val);
	}
	num += "0000";

	hn = new Array("영","일","이","삼","사","오","육","칠","팔","구");
	hj = new Array("","만","억","조","경","해","시","양","구","간","정","재","극","항하사","아승지","나유타","불가사의","무량대수");
	ul = new Array("영천","영백","영십","영");
	tm = new Array();

	if (num.charAt(0)=="-") {
		result = "마이너스 ";
		num = num.substr(1,num.length-1);
	}

	loop_size = Math.ceil(num.length/4);
	num2 = "";

	for (count=num.length; count >= 0; count--) {
		num2 += num.substring(count,count-1);
	}
	num = num2;

	for (i=0;i<loop_size;i++) {
		sum = hj[i] + " ";
		tm[i] = num.substr(i*4,4);

		tm2 = "";
		for (count=tm[i].length; count >= 0; count--) {
			tm2 += tm[i].substring(count,count-1);
		}
		tm[i] = tm2;
		part_jari = tm[i].length;

		for (j=0;j<10;j++) {
			for (k=0;k<10;k++) {
				tm[i] = tm[i].replace(k,hn[k]);
			}
		}

		if (part_jari == 4) {
			tm[i] = tm[i].charAt(0)+"천"+tm[i].charAt(1)+"백"+tm[i].charAt(2)+"십"+tm[i].charAt(3);
		} else if (part_jari == 3) {
			tm[i] = tm[i].charAt(0)+"백"+tm[i].charAt(1)+"십"+tm[i].charAt(2);
		} else if (part_jari == 2) {
			tm[i] = tm[i].charAt(0)+"십"+tm[i].charAt(1);
		} else {
			tm[i] = tm[i].charAt(0);
		}

		for (l=0;l<4;l++) {
			if (tm[i].match(ul[l])) {
				part_jari--; tm[i] = tm[i].replace(ul[l],"");
			}
		}

		if (part_jari != 0) {
			tm[i] += sum;
		}
	}

	for (loop_size;loop_size>-1;loop_size--) {
		result += tm[loop_size];
	}

	result = result.replace("undefined","");

	return result;
}

/**
 * 주민번호로 나이를 가져온다
 * @param juminNo
 * @return
 */
function getAge(juminNo1, juminNo2) {
	//연, 월, 일 가져오기
	var ju1 = juminNo1.substr(0,2);
	var ju2 = juminNo1.substr(2,2);
	var ju3 = juminNo1.substr(4,2);

	//주민번호 뒤번호 앞자리 가져오기
	var ju4 = juminNo2.substr(0,1);
	var year;

	if ("3478".indexOf(ju4) != -1) { //주민번호 뒷자리 첫번째가 3또는 4또는 7또는 8 이라면(7, 8은 우리나라 외국인 거주자)
		year = "20" + ju1;
	} else {
		year = "19" + ju1;
	}

	var nowDate = new Date();
	var nowYear = nowDate.getYear();

	return (parseInt(nowYear) - parseInt(year) + 1);
}

/**
 * 생년월일로 만나이를 가져온다
 * @param brthdy
 */
function getAge2(brthdy) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	month = month < 10 ? '0' + month : month;
	day = day < 10 ? '0' + day : day;
	var monthDay = month + "" + day;

	var birthYear = brthdy.substr(0, 4);
	var birthMonthDay = brthdy.substr(4, 4);

	var age = (monthDay < birthMonthDay) ? (year - birthYear - 1) : (year - birthYear);

	return age;
}

function check14Age(juminNo1, juminNo2) {
	//연, 월, 일 가져오기
	var ju1 = juminNo1.substr(0,2);
	var ju2 = juminNo1.substr(2,2);
	var ju3 = juminNo1.substr(4,2);
	var ju4 = juminNo2.substr(0,1);

	if ("3478".indexOf(ju4) != -1) { //주민번호 뒷자리 첫번째가 3또는 4또는 7또는 8 이라면(7, 8은 우리나라 외국인 거주자)
		year = "20" + ju1;
	} else {
		year = "19" + ju1;
	}

	var birthDate = year + "-" + ju2 + "-" + ju3;
	var chkDate = addYear(birthDate, 14);

	chkDate = parseInt(chkDate.replace(/-/gi, ""));
	nowDate =  parseInt(formatDate(new Date(), "yyyyMMdd"));

	if (chkDate > nowDate) {
		return false;
	} else {
		return true;
	}
}

function getFileSize(filePath) {
	var len = 0;
	if ( navigator.appName.indexOf("Netscape") != -1) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		} catch(e) {
			alert("signed.applets.codebase_principal_support를 설정해주세요!\n"+e);
			return -1;
		}
		try {
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath ( filePath );
			len = file.fileSize;
		} catch(e) {
			alert("에러 발생:"+e);
		}
	} else if (navigator.appName.indexOf('Microsoft') != -1) {
		var img = new Image();
		img.dynsrc = filePath;
		len = img.fileSize;
	}
	return len;
}

// 자바스크립트 request 객체
var Request = function() {
	this.getParameter = function(name) {
		var rtnval = '';
		var nowAddress = unescape(location.href);
		var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');

		for(var i = 0 ; i < parameters.length ; i++) {
			var varName = parameters[i].split('=')[0];
			if(varName.toUpperCase() == name.toUpperCase()) {
				rtnval = parameters[i].split('=')[1];
				break;
			}
		}
		return rtnval;
	}
}

var request = new Request();

//form 태그 생성후 POST로 이동시키기
function postLink(url, params, target) {
	var formHtml = "<form id='postLinkForm' name='postLinkForm' method='POST' action='"+url+"'>";
	if ( params.constructor == Array || params.jquery ) {
		jQuery.each(params, function() {
			formHtml += "<input type='hidden' name='"+this.name+"' value='"+this.value+"'>";
		});
	} else {
		for (var i in params) {
			if (params[i] && params[i].constructor == Array) {
				jQuery.each( params[i], function(){
					formHtml += "<input type='hidden' name='"+i+"' value='"+this+"'>";
				});
			} else {
				formHtml += "<input type='hidden' name='"+i+"' value='"+params[i]+"'>";
			}
		}
	}

	formHtml += "</form>";
	jQuery("body").append(formHtml);

	if (target != null && target != "") {
		document.postLinkForm.target = target;
	}
	document.postLinkForm.submit();
}


/**
 * jQuery를 이용한 checkbox에 대한 전체 체크/해제
 *
 * @param target 	: 체크/해제의 대상이 되는 name 값
 * @param chkVal 	: true, false 값을 전달받아 체크/해제의 조건으로 사용
 */
function allCheck(target, booleanVal){
	if (booleanVal){
		jQuery("input[name='" + target + "']").prop("checked", true);
	} else {
		jQuery("input[name='" + target + "']").attr("checked", false);
	}
}

/**
 * 입력 태그의 값을 반환해줌
 * param tagType : 입력태그 종류
 * param name    : 입력태그에 지정한 name 속성값
 * return        : 하나로 합쳐진 값을 반환함(값이 없을경우 ""로 반환)
 */
function getVal(tagType, name){
	var val = jQuery(tagType + "[name='" + name + "']").val();
	if (val == null){
		val = "";
	}
	return val ;
}

/**
 * 입력 태그의 값을 넣기
 * param tagType : 입력태그 종류
 * param name    : 입력태그에 지정한 name 속성값
 * param value   : 입력태그에 넣을 value 속성값
 */
function setVal(tagType, name, value){
	jQuery(tagType + "[name='" + name + "']").val(value);
}

/**
 * 이미지 리사이즈
 *
 * imgResize(this, 100, 100);
 */
function imgResize(i, maxW, maxH) {
	if(!maxW || !maxH ) {
		return;
	}
	var maxWidth = maxW;
	var maxHeight = maxH;

	var orgWidth = i.width;
	var orgHeight = i.height;

	var newWidth = orgWidth;
	var newHeight = orgHeight;

	var scaleWW = orgWidth/maxWidth;
	var scaleHH = orgHeight/maxHeight;

	// Determine the scale.
	if(orgWidth > maxWidth || (orgHeight > maxHeight && maxHeight > 0)){
		if(scaleWW > scaleHH || maxHeight == 0){
			newWidth = maxWidth;
			newHeight = Math.round(orgHeight/scaleWW);
		} else {
			newHeight = maxHeight;
			newWidth = Math.round(orgWidth/scaleHH);
		}
	}

	// 리사이즈한 크기로 이미지 크기 다시 지정
	i.width = newWidth;
	i.height = newHeight;
}


/**
 * 문자 사이의 공백을 제거한다.
 * @param str  공백제거할 문자열
 * @return  공백제거된 문자열
 */
function removeBlank(str){
	if (str != null){
		str = str.replace(/\s/g,'');
	} else {
		str = "";
	}
	return str;
}


//한글등을 2글자로 처리하는 문자열길이 구하는 함수
function strByteLength(str){
	totalByte = 0;
	if (str != null){
		if (str.length > 0){
			for (var i = 0; i < str.length; i++) {
				if (escape(str.charAt(i)).length > 4){
					totalByte += 2;
				} else {
					totalByte++;
				}
			}
		}
	}

	return totalByte;
}


//textArea 글자수 제한(this, 한글[2byte]제한수)
function checkStrLen(obj, maxlen){
	var temp;
	var msglen;
	var msglen = maxlen*2;
	var strValue = obj.value;

	var strLen = strValue.length;
	var tmpstr = "" ;

	if (strLen == 0){
		value = maxlen * 2;
	} else {
		for(var k=0; k < strLen; k++){
			temp = strValue.charAt(k);

			if (escape(temp).length > 4){
				msglen -= 2;
			} else {
				msglen--;
			}

			if(msglen < 0){
				alert("총 영문 " + (maxlen*2) + " 자 또는 한글 " + maxlen + " 자 까지만 입력할 수 있습니다");
				obj.value=tmpstr;
				break;
			} else {
				tmpstr += temp;
			}
		}
	}
}

function checkTextareaStrLength(obj, maxlen, viewId, isByte) {
	var value = obj.value;
	var temp = "";
	var temp2 = "";
	var maxlen2 = maxlen;

	for (var i = 0; i < value.length; i++) {
		temp = value.charAt(i);

		if (isByte) {
			if (escape(temp).length > 4) {
				maxlen2 -= 2;
			} else {
				maxlen2--;
			}
		} else {
			maxlen2--;
		}

		if ($("#" + viewId).size() > 0) {
			$("#" + viewId).text((maxlen - maxlen2));
		}
		// if ($("#" + viewId).size() > 0) {
		// 	$("#" + viewId).text((maxlen - maxlen2) + "/" + maxlen + " bytes");
		// }

		if (maxlen2 < 0) {
			if (isByte) {
				alert("총 " + maxlen + "byte 까지만 입력할 수 있습니다.");
			} else {
				alert("총 " + maxlen + "자 까지만 입력할 수 있습니다.");
			}

			obj.value = temp2;
			break;
		} else {
			temp2 += temp;
		}
	}
}

function fn_TextAreaInputLimit(name, size, viewId) {
	var tempText = $("textarea[name='" + name + "']");
	var tempChar = "";                                        // TextArea의 문자를 한글자씩 담는다
	var tempChar2 = "";                                        // 절삭된 문자들을 담기 위한 변수
	var countChar = 0;                                        // 한글자씩 담긴 문자를 카운트 한다
	var tempHangul = 0;                                        // 한글을 카운트 한다
	var maxSize = size;                                        // 최대값

	// 글자수 바이트 체크를 위한 반복
	for(var i = 0 ; i < tempText.val().length; i++) {
		tempChar = tempText.val().charAt(i);

		// 한글일 경우 2 추가, 영문일 경우 1 추가
		if(escape(tempChar).length > 4) {
			countChar += 2;
			tempHangul++;
		} else {
			countChar++;
		}
	}

	// 카운트된 문자수가 MAX 값을 초과하게 되면 절삭 수치까지만 출력을 한다.(한글 입력 체크)
	// 내용에 한글이 입력되어 있는 경우 한글에 해당하는 카운트 만큼을 전체 카운트에서 뺀 숫자가 maxSize보다 크면 수행
	if((countChar-tempHangul) > maxSize) {
		alert("최대 글자수를 초과하였습니다.");

		tempChar2 = tempText.val().substr(0, maxSize-1);
		tempText.val(tempChar2);
	}

	if ($("#" + viewId).size() > 0) {
		$("#" + viewId).text("(" + (countChar-tempHangul) + " / " + maxSize + ")");
	}
}

//특수문자를 제거
function specialTextRemove(str){
	if (str == null || str == ""){
		str = "";
	} else {
		//str = str.replace(/[#\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/g, "");
		str = str.replace(/[#\&\\;\'\`|#<>]/g, "");
	}
	return str;
}


/**
 * 검색 일자 설정
 * dateCountMinus("1y", "schStrtYmd", "schEndYmd");
 *
 * 종료 일자 필드는 오늘 날짜가 입력됨.
 *
 * @param v		: 기간(0d, 1m, 7d, 등 )
 * @param strtDt : 시작 일자 name
 * @param endDt : 종료 일자 name
 * @return
 */
function dateCountMinus(v, strtDt, endDt) {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var day = now.getDate();

	// 오늘
	if (v == "0d"){
	}
	// 일주일
	if( v == "-7d") {
		day = day - 7;
	}
	// 보름
	if( v == "-15d") {
		day = day - 15;
	}
	// 1개월
	if( v == "1m") {
		month = month - 1;
	}
	// 2개월
	if( v == "2m") {
		month = month - 2;
	}
	// 3개월
	if( v == "3m") {
		month = month - 3;
	}
	// 6개월
	if( v == "6m") {
		month = month - 6;
	}
	// 1년
	if( v == "1y"){
		year = year - 1;
	}
	// 어제
	if(v == "-1d" ) {
		day = day - 1;
	}
	// 이번달
	if( v == "0m") {
		day = 1;
	}

	if (jQuery("input[name='" + strtDt + "']")) {
		jQuery("input[name='" + strtDt + "']").val(jQuery.datepicker.formatDate("yy.mm.dd", new Date(year, month, day)));
	}

	if(jQuery("input[name='" + endDt + "']")){
		jQuery("input[name='" + endDt + "']").val(jQuery.datepicker.formatDate("yy.mm.dd", new Date()));
	}
}

/**
 * 검색 일자 설정
 * dateCountMinus("1y", "schStrtYmd", "schEndYmd");
 *
 * 종료 일자 필드는 오늘 날짜가 입력됨.
 *
 * @param v		: 기간(0d, 1m, 7d, 등 )
 * @param strtDt : 시작 일자 name
 * @param endDt : 종료 일자 name
 * @return
 */
function dateCountMinusYm(v, strtDt, endDt) {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var day = now.getDate();

	// 오늘
	if (v == "0d"){
	}
	// 일주일
	if( v == "-7d") {
		day = day - 7;
	}
	// 보름
	if( v == "-15d") {
		day = day - 15;
	}
	// 1개월
	if( v == "1m") {
		month = month - 1;
	}
	// 2개월
	if( v == "2m") {
		month = month - 2;
	}
	// 3개월
	if( v == "3m") {
		month = month - 3;
	}
	// 6개월
	if( v == "6m") {
		month = month - 6;
	}
	// 1년
	if( v == "1y"){
		year = year - 1;
	}
	// 어제
	if(v == "-1d" ) {
		day = day - 1;
	}
	// 이번달
	if( v == "0m") {
		day = 1;
	}

	if (jQuery("input[name='" + strtDt + "']")) {
		jQuery("input[name='" + strtDt + "']").val(jQuery.datepicker.formatDate("yy.mm", new Date(year, month)));
	}

	if(jQuery("input[name='" + endDt + "']")){
		jQuery("input[name='" + endDt + "']").val(jQuery.datepicker.formatDate("yy.mm", new Date()));
	}
}

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

/**
 * 검색 일자 설정
 * dateCountPlus("1y", "schStrtYmd", "schEndYmd");
 *
 * 종료 일자 필드는 오늘 날짜가 입력됨.
 *
 * @param v		: 기간(0d, 1m, 7d, 등 )
 * @param strtDt : 시작 일자 name
 * @param endDt : 종료 일자 name
 * @return
 */
function dateCountPlus(v, strtDt, endDt) {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var day = now.getDate();


	// 오늘
	if (v == "0d"){
	}
	// 일주일
	if( v == "7d") {
		day = day + 7;
	}
	// 보름
	if( v == "15d") {
		day = day + 15;
	}
	// 1개월
	if( v == "1m") {
		month = month + 1;
	}
	// 3개월
	if( v == "3m") {
		month = month + 3;
	}
	// 6개월
	if( v == "6m") {
		month = month + 6;
	}
	// 1년
	if( v == "1y"){
		year = year + 1;
	}
	// 어제
	if(v == "1d" ) {
		day = day + 1;
	}
	// 이번달
	if( v == "0m") {
		day = 1;
	}

	if( sId ) {
		jQuery(sId).val(jQuery.datepicker.formatDate("yy.mm.dd", new Date()));
	}

	if( eId ){
		jQuery(eId).val(jQuery.datepicker.formatDate("yy.mm.dd", new Date(year, month, day)));
	}
}

function encodeToHex(str) {
	var r="";
	var e=str.length;
	var c=0;
	var h;
	while(c<e){
		h=str.charCodeAt(c++).toString(16);
		while(h.length<3) h="0"+h;
		r+=h;
	}
	return r;
}
function decodeFromHex(str) {
	var r="";
	var e=str.length;
	var s;
	while(e>=0){
		s=e-3;
		r=String.fromCharCode("0x"+str.substring(s,e))+r;
		e=s;
	}
	return r;
}

function trim(str) {
	return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");

}

String.prototype.trim = function() {
	return this.replace(/^\s\s*/,"").replace(/\s\s*$/,"");
}

/**
 * 숫자만 입력받기
 * <input type="text" onkeydown='return onlyNumber(event)' onkeyup='removeChar(event)' style='ime-mode:disabled;'>
 * @param event
 * @returns {Boolean}
 */
function onlyNumber(event){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 9 || keyID == 46 || keyID == 37 || keyID == 39 ) {
		return;
	} else {
		return false;
	}
}
function removeChar(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( keyID == 8 || keyID == 9 || keyID == 46 || keyID == 37 || keyID == 39 ) {
		return;
	} else {
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
	}
}

/**
 * 날짜만 입력받기(숫자, 점)
 * <input type="text" onkeydown='return onlyNumber(event)' onkeyup='removeChar(event)' style='ime-mode:disabled;'>
 * @param event
 * @returns {Boolean}
 */
function onlyNumberForDate(event, obj){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;

	with(obj) { // 입력된값중 포함된 문자있으면 backspace
		var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()_+|}{\":?><=-\\][';/.,";

		for (var i = 0; i < a.length; i++){
			if(obj.value.substr(obj.value.length - 1 , obj.value.length) == a.charAt(i)) {
				obj.value = obj.value.substr(0, obj.value.length - 1);
			}
		}
	}
	var change = obj.value;
	var cnt = change.length;

	if ( keyID != 8 ) {
		if (cnt == 4) { //자릿수에 맞추어 '.' 넣기
			obj.value = obj.value + ".";
		}
		if (cnt == 7) { //자릿수에 맞추어 '.' 넣기
			obj.value = obj.value + ".";
		}
	}
}

//시작일, 종료일 날짜형식 체크 및 날짜비교
function checkCmprDate(strtDt, endDt, tp, todayCheckYn) {
	var d = new Date();
	var indate = $("input[name='"+ strtDt +"']").val().replace(/\./gi, "");
	var yyyy = d.getFullYear();
	var mm = d.getMonth() + 1;
	var dd = d.getDate();

	if (mm < 10) {
		mm = "0" + mm;
	}

	if (dd < 10) {
		dd = "0" + dd;
	}

	if (todayCheckYn == "Y") {
		today = yyyy + mm + dd;
		if (today > indate && tp == "start") {
			alert("현재 날짜보다 이전 입니다.");
			$("input[name='"+ strtDt +"']").val("");
			return;
		}
	}

	var date = "";
	if (tp == "start") {
		date = $("input[name='"+ strtDt +"']").val().replace(/\./gi, "");
	} else {
		date = $("input[name='"+ endDt +"']").val().replace(/\./gi, "");
	}

	if (date != "") {
		if (!validateUtil.isValidDate(date)) {
			alert("날짜 형식이 맞지 않습니다.");
			if (tp == "start") {
				date = $("input[name='"+ strtDt +"']").val("").focus();
			} else {
				date = $("input[name='"+ endDt +"']").val("").focus();
			}
			return;
		}
	}

	if ($("input[name='"+ strtDt +"']").val() != "" && $("input[name='"+ endDt +"']").val() != "") {
		var intStrtYmd = parseInt($("input[name='"+ strtDt +"']").val().replace(/\./gi, ""));
		var intEndYmd = parseInt($("input[name='"+ endDt +"']").val().replace(/\./gi, ""));

		if (intStrtYmd > intEndYmd) {
			alert("시작일이 종료일보다 이전일자여야 합니다.");
			if (tp == "start") {
				$("input[name='"+ strtDt +"']").val("").focus();
			} else {
				$("input[name='"+ endDt +"']").val("").focus();
			}
			return;
		}
	}
}

//시작일, 종료일 날짜형식 체크 및 날짜비교
function checkCmprDateYm(strtDt, endDt, tp, todayCheckYn) {
	var d = new Date();
	var indate = $("input[name='"+ strtDt +"']").val().replace(/\./gi, "");
	var yyyy = d.getFullYear();
	var mm = d.getMonth() + 1;

	if (mm < 10) {
		mm = "0" + mm;
	}

	if (todayCheckYn == "Y") {
		today = yyyy + mm;
		if (today > indate && tp == "start") {
			alert("현재 월보다 이전 입니다.");
			$("input[name='"+ strtDt +"']").val("");
			return;
		}
	}

	var date = "";
	if (tp == "start") {
		date = $("input[name='"+ strtDt +"']").val().replace(/\./gi, "");
	} else {
		date = $("input[name='"+ endDt +"']").val().replace(/\./gi, "");
	}

	// if (date != "") {
	// 	if (!validateUtil.isValidDate(date)) {
	// 		alert("날짜 형식이 맞지 않습니다.");
	// 		if (tp == "start") {
	// 			date = $("input[name='"+ strtDt +"']").val("").focus();
	// 		} else {
	// 			date = $("input[name='"+ endDt +"']").val("").focus();
	// 		}
	// 		return;
	// 	}
	// }

	if ($("input[name='"+ strtDt +"']").val() != "" && $("input[name='"+ endDt +"']").val() != "") {
		var intStrtYmd = parseInt($("input[name='"+ strtDt +"']").val().replace(/\./gi, ""));
		var intEndYmd = parseInt($("input[name='"+ endDt +"']").val().replace(/\./gi, ""));

		if (intStrtYmd > intEndYmd) {
			alert("시작월이 종료월보다 이전월이여야 합니다.");
			if (tp == "start") {
				$("input[name='"+ strtDt +"']").val("").focus();
			} else {
				$("input[name='"+ endDt +"']").val("").focus();
			}
			return;
		}
	}
}

//시작일, 종료일 날짜형식 체크 및 날짜비교
function checkCmprDate2(strtYmd, endYmd, strtHis, endHis, tp) {
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
	var flag = false;
	var _strtYmd = $("input[name='"+ strtYmd +"']").val().replace(/\./gi, "");
	var _endYmd = $("input[name='"+ endYmd +"']").val().replace(/\./gi, "");
	var _strtHis = $("input[name='"+ strtHis +"']").val().replace(regExp, "").substring(0, $("input[name='"+ strtHis +"']").val().replace(regExp, "").length - 2);
	var _endHis = $("input[name='"+ endHis +"']").val().replace(regExp, "").substring(0, $("input[name='"+ endHis +"']").val().replace(regExp, "").length - 2);
	var strtHisDate = $("input[name='"+ strtHis +"']").val().replace(regExp, "").substring($("input[name='"+ strtHis +"']").val().replace(regExp, "").length - 2);
	var endHisDate = $("input[name='"+ endHis +"']").val().replace(regExp, "").substring($("input[name='"+ endHis +"']").val().replace(regExp, "").length - 2);

	if (Number(_strtYmd) != "" && Number(_endYmd) != "" && Number(_strtHis) != "" && Number(_endHis) != "") {
		if (Number(_strtYmd) == Number(_endYmd)) {
			if (strtHisDate == "pm" && endHisDate == "am") {
				flag = true;
			}

			if (strtHisDate == endHisDate) {
				_strtHis = _strtHis.replace(/12/gi, "0");
				_endHis = _endHis.replace(/12/gi, "0");

				if (Number(_strtHis) > Number(_endHis)) {
					flag = true;
				}
			}

			if (flag) {
				alert("시작일이 종료일보다 이전일자여야 합니다.");

				if (tp == "start") {
					$("input[name='"+ strtHis +"']").val("").focus();
				} else {
					$("input[name='"+ endHis +"']").val("").focus();
				}
			}
		}
	}
}

// 현재 날짜보다 이전인지 체크
function checkTodayPrevDate(endDate) {
	var d = new Date();
	var endD = $("input[id='" + endDate +"']").val();
	var yyyy = today.getFullYear();
	var mm = today.getMonth() + 1;
	var dd = today.getDate();

	if (mm < 10) {
		mm = "0" + mm;
	}

	if (dd < 10) {
		dd = "0" + dd;
	}

	var today = yyyy + mm + dd;

	if (today > endD) {
		alert("현재 날짜보다 이전입니다.");
	}
}

//입력받은 날짜 시작일, 종료일 점제거
function deleteDotForDate(strtDt, endDt) {
	if ($("input[name='"+ strtDt +"']").val() != "") {
		$("input[name='"+ strtDt +"']").val($("input[name='"+ strtDt +"']").val().replace(/\./gi, ""));
	}

	if ($("input[name='"+ endDt +"']").val() != "") {
		$("input[name='"+ endDt +"']").val($("input[name='"+ endDt +"']").val().replace(/\./gi, ""));
	}
}

//입력받은 날짜 시작시간 am/pm 제거
function changeOneDateFormatHis(strtHisNm) {
	if ($("input[name='"+ strtHisNm +"']").length > 0 && $("input[name='"+ strtHisNm +"']").val() != "") {
		var strtHis = $("input[name='"+ strtHisNm +"']").val();
		var strtHis1 = strtHis.substring(0, strtHis.length - 2);
		var strtHis2 = strtHis.substring(strtHis.length - 2);
		var strtHis3 = strtHis1.split(":");

		if (strtHis3[0].length == 1) {
			strtHis3[0] = "0"+ strtHis3[0];
		}

		if (strtHis2 == "am") {
			if (strtHis3[0] == "12") {
				strtHis3[0] = "00";
			}
		}

		if (strtHis2 == "pm") {
			strtHis3[0] = Number(strtHis3[0]) + 12;
		}

		$("input[name='"+ strtHisNm +"']").val(strtHis3[0] + strtHis3[1]);

	}
}

//입력받은 날짜 시작시간, 종료시간 am/pm 제거
function changeDateFormatHis(strtHisNm, endHisNm) {
	if ($("input[name='"+ strtHisNm +"']").length > 0 && $("input[name='"+ strtHisNm +"']").val() != "") {
		var strtHis = $("input[name='"+ strtHisNm +"']").val();
		var strtHis1 = strtHis.substring(0, strtHis.length - 2);
		var strtHis2 = strtHis.substring(strtHis.length - 2);
		var strtHis3 = strtHis1.split(":");

		if (strtHis3[0].length == 1) {
			strtHis3[0] = "0"+ strtHis3[0];
		}

		if (strtHis2 == "am") {
			if (strtHis3[0] == "12") {
				strtHis3[0] = "00";
			}
		}

		if (strtHis2 == "pm") {
			strtHis3[0] = Number(strtHis3[0]) + 12;
		}

		$("input[name='"+ strtHisNm +"']").val(strtHis3[0] + strtHis3[1]);

	}

	if ($("input[name='"+ endHisNm +"']").length > 0 && $("input[name='"+ endHisNm +"']").val() != "") {
		var endHis = $("input[name='"+ endHisNm +"']").val();
		var endHis1 = endHis.substring(0, endHis.length - 2);
		var endHis2 = endHis.substring(endHis.length - 2);
		var endHis3 = endHis1.split(":");

		if (endHis3[0].length == 1) {
			endHis3[0] = "0" + endHis3[0];
		}

		if (endHis2 == "am") {
			if (endHis3[0] == "12") {
				endHis3[0] = "00";
			}
		}

		if (endHis2 == "pm") {
			endHis3[0] = Number(endHis3[0]) + 12;
		}

		$("input[name='"+ endHisNm +"']").val(endHis3[0] + endHis3[1]);
	}
}

//입력받은 날짜 시작시간 am/pm 제거 후 값 return
function returnOneDateFormatHis(strtHisVal) {
	if (strtHisVal != "") {
		var strtHis = strtHisVal;
		var strtHis1 = strtHis.substring(0, strtHis.length - 2);
		var strtHis2 = strtHis.substring(strtHis.length - 2);
		var strtHis3 = strtHis1.split(":");

		if (strtHis3[0].length == 1) {
			strtHis3[0] = "0"+ strtHis3[0];
		}

		if (strtHis2 == "am") {
			if (strtHis3[0] == "12") {
				strtHis3[0] = "00";
			}
		}

		if (strtHis2 == "pm") {
			strtHis3[0] = Number(strtHis3[0]) + 12;
		}

		return strtHis3[0] + strtHis3[1];
	}
}

//입력받은 날짜 시작일, 종료일 점제거
function deleteDotForDateOne(strtDt) {
	if ($("input[name='"+ strtDt +"']").val() != "") {
		$("input[name='"+ strtDt +"']").val($("input[name='"+ strtDt +"']").val().replace(/\./gi, ""));
	}
}

// D-Day 계산
// param : 종료일
// Format : ex)'20200707'
function returnDecimalDay(endDate) {
	if(!endDate){return;}

	var year = endDate.substr(0,4);
	var month = endDate.substr(4,2);
	var day = endDate.substr(6,2);
	var date = new Date(year, month-1, day);
	var today = new Date();
	var endDay = new Date(date);
	var decimalDay = today.getTime() - endDay.getTime();
	var result = Math.floor(decimalDay / (1000 * 60 * 60 * 24));
	if(today.getTime() >= endDay.getTime()){
		if(result == 0){
			result = "-" + result;
		}else{
			result = "+" + result;
		}
	}

	return "D" + result;
}

//입력받은 Input 특수문자 제거
function deleteSpecialCharForInput(val, specialChar) {
	if ($("input[name='"+ val +"']").val() != "") {
		$("input[name='"+ val +"']").val($("input[name='"+ val +"']").val().replace(specialChar, ""));
	}
}

//레이어팝업 콜백
function callbackPopupLayer(data, popupId) {
	$("#divNeedPopup").empty().append(data);
	$(".needpopup_wrapper").remove();
	initNeedPopup();
	needPopup.show("#" + popupId);
}

// 레이어 팝업 초기화
function initNeedPopup() {
	needPopup.config.custom = {
		'removerPlace': 'outside',
		'closeOnOutside': false,
		onShow: function() {
		},
		onHide: function() {
		}
	};
	needPopup.init();
}

// 레이어 팝업 닫기
function closeNeedPopup() {
	if ($(".needpopup_wrapper").length > 0) {
		needPopup.hide();
		$(".needpopup_wrapper").remove();
	}
}

//파일 다운로드
function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}

//검색어바 엔터키 이벤트
function keydownEnterSearch(evt, tp) {
	if (evt.keyCode == 13) {
		if (tp != "") {
			goSearch(tp);
		} else {
			goSearch();
		}

		return false;
	}
}

//특수기호 변환
function toHtml(str){
	return String(str).replace(/&#40;/g, '(').replace(/&#41;/g, ')').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&#35;/g, '#');
}

/**
 * 폼 초기화(input, select)
 * @param formId
 */
function formInitialize(formId) {
	$("#" + formId + " input").each(function(){
		var type = $(this).attr("type");

		if (type == "radio") {
			var radioName = $(this).attr("name");
			$("input:radio[name='" + radioName + "']").eq(0).prop("checked", true);
		} else if (type == "checkbox") {
			$(this).prop("checked", false);
		} else if (type == "text") {
			$(this).val("");
		}
	});

	$("#" + formId + " select").each(function(){
		$(this).prop("selectedIndex", 0);
	});

	$("#" + formId + " textarea").each(function(){
		$(this).val("");
	});
}

/* gnb 펼침 */
function resizeMenu() {
	var my_img = $("#h_nav").css("width");

	if(my_img == "265px"){
		$("#h_nav").animate({width:'70px'},500);
		$("#h_nav").addClass("gnb_bg");
		$("#h_nav .allmenu").css("right","30px");
		$("#h_nav h1").attr("style","display:none;");
		$("#h_nav div:first-child").removeClass("upper");
		$(".lower").attr("style","display:none;");
		$("#container").css("paddingLeft","90px");
		$("#h_nav .info-admin").hide();
		$("#gnb").hide();
	}else{
		$("#h_nav").animate({width:'265px'},500);
		$("#h_nav").removeClass("gnb_bg");
		$("#h_nav .allmenu").css("right","30px");
		$("#h_nav h1").attr("style","display:block;");
		$("#h_nav div:first-child").addClass("upper");
		$(".lower").attr("style","display:block;");
		$("#container").css("paddingLeft","280px");
		$("#h_nav .info-admin").show();
		$("#gnb").show();
	}
}

/**
 * 아이프레임 높이값을 수정한다.
 *
 * @param id
 * @param height
 */
function iframeResize(id, height) {
	$("#" + id).height(height);
}

/**
 * 문자열 왼쪽에 지정한 길이만큼 특정문자열을 덧붙여서 반환합니다.
 *
 * @param val
 * @param padLength
 * @param padString
 */
function lpad(val, padLength, padString) {
	while(val.length < padLength)
		val = padString + val;
	return val;
}

/**
 * 문자열 오른쪽에 지정한 길이만큼 특정문자열을 덧붙여서 반환합니다.
 *
 * @param val
 * @param padLength
 * @param padString
 */
function rpad(val, padLength, padString) {
	while(val.length < padLength)
		val += padString;
	return val;
}

/**
 * 부모창 아이프레임 높이값 수정 함수를 호출한다.
 *
 * @param selector
 * @param id
 * @param val
 */
function parentIframeResize(selector, id, val) {
	var height = 0;

	$(selector).each(function() {
		height += $(this).height();
	});
	parent.iframeResize(id, height + val);
}

/**
 * url parameter 값을 가져온다.
 *
 * @param name
 * @param url
 * @param val
 */
function getParameterByName(name) {
	var url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");

	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	var results = regex.exec(url);

	if (results != null) {
		return results[2];
	}
}

/**
 * 날짜 포맷을 입력
 *
 * @param date
 * @returns {string}
 */
function dateFormat(date) {
	var result = '';
	// 공백제거
	date = date.replace(/\s/gi, "");

	try {
		if (date.length == 8) {
			result = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
		}
		if (date.length == 6) {
			result = date.replace(/(\d{2})(\d{2})(\d{2})/, '$1.$2.$3');
		}
		if (date.length == 4) {
			result = date.replace(/(\d{2})(\d{2})/, '$1.$2');
		}
	} catch (e) {
		result = num;
	}

	return result;
}

/**
 * 시간 포맷을 입력
 *
 * @param date
 * @returns {string}
 */
function timeFormat(time) {
	var result = '';
	// 공백제거
	time = time.replace(/\s/gi, "");

	try {
		if (time.length == 6) {
			result = time.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
		}
		if (time.length == 4) {
			result = time.replace(/(\d{2})(\d{2})/, '$1:$2');
		}
	} catch (e) {
		result = time;
	}

	return result;
}

/**
 * 빈값 체크
 */
function isBlank(value){
	if(value){
		return false;
	}else{
		return true;
	}
}

/**
 * 입력한 범위 내 랜덤 숫자 반환
 *
 * @param min
 * @param max
 * @returns {number}
 */
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * URL을 호출하여 HTML을 가져온다.
 *
 * @param fileUrl
 * @param parameter
 * @param callback
 */
function fileViwer(fileDwldDvsnCd, fileId) {
	var browse = navigator.userAgent.toLowerCase();
	if ((navigator.appName == 'Netscape' && browse.indexOf('trident') > -1) || (browse.indexOf("msie") > -1)) {
		if (browse.indexOf("msie") > -1) {
			if (browse.indexOf("msie 9.0") > -1) {
				alert("접속하신 브라우저는 MS의 기술지원이 만료되어 바로보기 기능이 지원되지 않습니다. 브라우저 업데이트 후 이용해주시기 바랍니다.");
				return;
			}
		}
	}

	dev.action.loading.show();

	$.getJSON(contextPath + "/file_viewr_json?fileDwldDvsnCd=" + fileDwldDvsnCd + "&fileId=" + fileId, function(data) {
		if (data.resultCode == 0) {
			dev.action.loading.hide();

			if (isBrowser()) {
				move(data.viewrUrl);
				return;
			}

			window.open(data.viewrUrl);
		} else if (data.resultCode == -1) {
			alert(data.resultMsg);
			dev.action.loading.hide();
		} else {
			alert("처리중 오류가 발생했습니다.\n관리자에게 문의하세요.");
			dev.action.loading.hide();
		}
	});
}

/**
 * 파일 사이즈 체크
 * @returns {boolean}
 */
function fileSizeCheck(id) {
	var maxSize = 200 * 1024 * 1024;	// 200MB
	var fileSize = document.getElementById(id).files[0].size;

	if (fileSize > maxSize) {
		alert("첨부파일 사이즈는 200MB 이내로 등록 가능합니다.");
		return true;
	}

	return false;
}

/**
 * 파일 사이즈 체크 (USER)
 * @returns {boolean}
 */
function fileSizeCheck1(id) {
	var maxSize = 250 * 1024 * 1024;	// 250MB
	var fileSize = document.getElementById(id).files[0].size;

	if (fileSize > maxSize) {
		alert("첨부파일 사이즈는 250MB 이내로 등록 가능합니다.");
		return true;
	}

	return false;
}

/**
 * 브라우저 체크
 * @returns {boolean}
 */
function isBrowserForIe9() {
	var browse = navigator.userAgent.toLowerCase();

	if (browse.indexOf("msie 9.0") > -1) {
		return false;
	}

	return true;
}

/**
 * 브라우저 체크
 */
function isBrowser() {
	var result = false;
	var agent = navigator.userAgent.toLowerCase();

	if (agent.indexOf("mac") > -1) {
		result = true;
	}

	return result;
}

/**
 * 일자리플랫폼 앱 체크 (웹뷰)
 */
function isApp() {
	var result = false;
	var agent = navigator.userAgent.toLowerCase();

	if (agent.indexOf("jpmapp") > -1) {
		result = true;
	}

	return result;
}

/**
 * 일자리플랫폼 IOS 앱 체크 (웹뷰)
 */
function isAppIOS() {
	var result = false;
	var agent = navigator.userAgent.toLowerCase();

	if (agent.indexOf("jpmappios") > -1) {
		result = true;
	}

	return result;
}

/**
 * 일자리플랫폼 Android 앱 체크 (웹뷰)
 */
function isAppAOS() {
	var result = false;
	var agent = navigator.userAgent.toLowerCase();

	if (agent.indexOf("jpmappaos") > -1) {
		result = true;
	}

	return result;
}

/**
 * 모바일 체크
 */
function isMobile() {
	var result = false;
	var agent = navigator.userAgent.toLowerCase();

	if (agent.match(/iphone|ipad|ipod|android/i) != null) {
		result = true;
	}

	return result;
}

/**
 * 모바일 IOS 체크
 */
function isMobileIOS() {
	var result = false;
	var agent = navigator.userAgent.toLowerCase();

	if (agent.match(/iphone|ipad|ipod/i) != null || isAppIOS()) {
		result = true;
	}

	return result;
}

/**
 * 모바일 AOS 체크
 */
function isMobileAOS() {
	var result = false;
	var agent = navigator.userAgent.toLowerCase();

	if (agent.match(/android/i) != null || isAppAOS()) {
		result = true;
	}

	return result;
}

/**
 * 관심기업 등록/삭제
 */
function interestCompanySave(cmpId, intrstYn, callback){
	var queryString = "intrstYn=" + intrstYn + "&cmpIds=" + cmpId;

	// contextPath 추가 22.01.04
	loadJsonAjax(contextPath + "/company/interest_company_save", "POST", queryString, function(data) {
		callback(data);
	});
}

/**
 * 추천(좋아요) 기능 등록/삭제
 */
function rcmdBoardSave(cntntsId, rcmdYn, url, callback){
	var queryString = "cntntsId=" + cntntsId + "&likeYn=" + rcmdYn;

	loadJsonAjax(url, "POST", queryString, function(data) {
		callback(data);
	});
}

/*통합주소검색 레이어팝업*/
var addrLayer = {
	init : function (){
		addrLayer.render("unity");
		addrLayer.open();
	},
	render : function(url){
		loadHtmlAjax(contextPath + "/common/search_adr/"+url, "GET", null, function(html){
			if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
				document.getElementById("searhAdrModal").innerHTML = html;
			} else {
				$("#searhAdrModal").html(html);
			}
		},false);
	},
	moveTab : function (url){
		addrLayer.render(url);
	},
	open : function(){
		$("#searhAdrModal").show();
	},
	close : function(){
		$("#searhAdrModal").hide();
	},
	goSearch : function (ty) {
		var srchAdr = $("#srchAdr").val();

		if (srchAdr) {
			loadHtmlAjax(contextPath + "/common/search_adr/"+ty+"_list_html", "GET", {"srchAdr": srchAdr}, addrLayer.searchComplete, addrLayer.searchError);
		}
	},
	searchComplete : function (result) {
		var $infoBox = $("#info_box");
		var $result = $(result);
		var $adrs = $result.find("#adrs");

		if ($adrs.length > 0) {
			if($result.find(".sort").length > 0){
				$(".dot-guide-list").remove();
				$infoBox.empty().append($result.find(".sort")).append($adrs);
			}else{
				$infoBox.empty().append($result.find(".total_txt")).append($adrs);
			}
		} else {
			$infoBox.find("script").remove().end().append($result.find("script"));
		}
	},
	searchError : function (err) {
		alert("검색 중 오류가 발생하였습니다.");
	},
	setAdr : function (ty){	// 선택 주소 (부모창 전달)
		var $tr = $("#adrs").find("tr input:radio:checked").closest("tr");
		if(ty === 'unity'){
			addrLayer.setData($tr.data("zip"), $tr.data("rnm-adr"));
		}else{
			addrLayer.setData($tr.data("zip"), $tr.data("ltno-adr"));
		}
	},
	setData : function(zip,rnmAdr){
		if(zip && rnmAdr){
			$("#ownhomZpcd").val(zip);
			$("#ownhomAddr").val(rnmAdr);
			addrLayer.close();
		}else{
			alert("주소를 입력해 주세요.");
			return;
		}
	},
	keydownEnterSearch : function(evt, tp){
		if (evt.keyCode == 13) {
			if (tp != "") {
				addrLayer.goSearch(tp);
			} else {
				addrLayer.goSearch();
			}
			return false;
		}
	}
}

/**
 * 파일 첨부 label 클릭 시 input file 위치 변경
 */
function beforeFileUpload(id) {
	var fileId = id || "file";

	$("label[for='" + fileId + "']").after($("#" + fileId));
}

/**
 * 이중 submit 체크
 */
var doubleSubmitFlag = false;
function doubleSubmitCheck(){
	if(doubleSubmitFlag){
		return doubleSubmitFlag;
	}else{
		doubleSubmitFlag = true;
		return false;
	}
}

function visitCheck(){
	let date = new Date();
	let cookieCheck = $.cookie("visitor");

	if(!cookieCheck){
		// contextPath 추가 22.01.13
		loadJsonAjax(contextPath + "/save_access", "POST", {"cnctnDomain" : location.hostname}, function (item) {
			if(item.data && item.data.flag === "Y"){
				// contextPath 추가 22.01.13
				loadHtmlAjax(contextPath + "/visit_event_popup", "POST", {cnt : item.data.value} , function(data) {
					callbackPopupLayer(data, "visitEvent");
				});
			}
		},false);
	}

	/*쿠키 생성 & 갱신*/
	date.setTime(date.getTime() + 5*60*1000); // 5분
	$.cookie('visitor', 'on', { expires: date, path : '/' });
}
/* contextPath 추가 22.01.03 */
function getContextPath() {
	var hostIndex = location.href.indexOf( location.host ) + location.host.length;
	return location.href.substring( hostIndex, location.href.indexOf('/', hostIndex + 1) );
}

$(function() {
	dev.init();  //한번만 실행.

});