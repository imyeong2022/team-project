
(function(window,undefined){
    var dateRegex = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/,
        datetimeRegex = /^(\d{1,4})(-|\/|.)(\d{1,2})\2(\d{1,2})\s+(\d{1,2}):(\d{1,2})(:(\d{1,2}))?$/,
        positiveNumberRegex = /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})*$/,
        negtiveNumberRegex = /^-([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})*$/,
        natureNumberRegex = /^[0-9]+$/,
        positiveIntRegex = /^[1-9]\d*$/,
        negtiveIntRegex = /^-[1-9]\d*$/,
        idRegex = /^[a-z]{1,1}[a-z0-9]{4,11}$/,
        passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/,
//        passwordRegex = /^((?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[0-9])|(?=.*[a-z])(?=.*[^a-zA-Z0-9])|(?=.*[A-Z])(?=.*[0-9])|(?=.*[A-Z])(?=.*[^a-zA-Z0-9])|(?=.*[0-9])(?=.*[^a-zA-Z0-9])).{10,}/,
        emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
        mobileRegex = /^(01[016-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/,
        certRegex = /^[0-9A-Z]*$/,
        telFaxRegex = /^(0[2-8][0-5]?|01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/,
        tel15Regex = /^(1544|1566|1577|1588|1644|1688)-?([0-9]{4})$/,
        postCodeRegex = /^[0-9]{6}$/,
        birthdayRegex = /^((((19|2\d)\d{2})\.(0?[13578]|1[02])\.(0?[1-9]|[12]\d|3[01]))|(((19|2\d)\d{2})\.(0?[13456789]|1[012])\.(0?[1-9]|[12]\d|30))|(((19|2\d)\d{2})\.0?2\.(0?[1-9]|1\d|2[0-8]))|(((19|2\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))\.0?2\.29))$/,
        specialStringRegex = new RegExp("[`~!@#$^&*()%+=|{}':;',\\[\\].<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、？]"),
        bankNumberRegex = /^(\d){8,24}$/,
        identityCardRegex = /^((\d{15})|(\d{17})|(\d{18})|(\d{17}(X|x)))$/,
        ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/,
        decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,

		englishNumberRegex = /^[A-Za-z0-9]+$/,
    	emailIdRegex = /^([\w-]+(?:\.[\w-]+)*)$/,
    	emailDomainRegex = /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    	domainRegex = /^([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/,
    	codeRegex = /^[A-Z]+$/,
    	hangleRegex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    
    var validateUtil = new Object();

	validateUtil.trim = function(value) {
		if (typeof value == "undefined")
			return null;
		return value == null ? "" : value.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};
	validateUtil.isNull = function(value) {
		return value == null;
	};
	validateUtil.isBlank = function(value) {
		if (typeof value == 'undefined')
			return true;
		return validateUtil.trim(value) == "";
	};
	validateUtil.isValidId = function(value) { // 아이디 체크섬
		if (typeof value == "undefined")
			return false;
		return idRegex.test(value);
	};
	validateUtil.isValidPassword = function(value) { // 비밀번호 체크섬
		if (typeof value == "undefined")
			return false;
		
		var failCnt = 0;
		if (value.length < 8) {
			return false;
		}

		if (value.search(/[0-9]/g) === -1 ) {
			return false;
		}
		if (value.search(/[!@#$%^&*()?_~]/g) === -1  ) {
			return false;
		}
		if (value.search(/[a-z]/g) === -1 ) {
			failCnt++;
		}
		if (value.search(/[A-Z]/g) === -1 ) {
			failCnt++;
		}
		if (failCnt > 1) {
			return false;
		}
		
		return true;
	};
	validateUtil.isIncludeIdPassword = function(id, passwd) { // 비밀번호에 아이디 체크
		if (typeof id == "undefined")
			return false;
		if (typeof passwd == "undefined")
			return false;

		if (id != "" && passwd.indexOf(id) >= 0) {
			return false;
		}
		return true;
	};
	validateUtil.isContinuePassword = function(passwd) { // 비밀번호 동일한 문자, 숫자 4자리이상 체크
		if (typeof passwd == "undefined")
			return false;

		if(/(\w)\1\1\1/.test(passwd)) {
			return false;
		}

		if(/(\d)\1\1\1/.test(passwd)) {
			return false;
		}

		return true;
	};

	validateUtil.isContinueNumberPassword = function(passwd) { // 비밀번호 동일한 숫자 4자리이상 체크
		if (typeof passwd == "undefined")
			return false;

		if(/(\d){4,}/.test(passwd)) {
			return false;
		}

		return true;
	};

	validateUtil.isPermanencePassword = function(passwd) { // 비밀번호 연속된 문자열 체크
		if (typeof passwd == "undefined")
			return false;

		var chkSameCnt = 0; //동일문자 카운트
		var chkPmncPlus = 0; //연속성(+) 카운드
		var chkPmncMinus = 0; //연속성(-) 카운드

		var chkChar1;
		var chkChar2;
		var chkChar3;
		for (var i=0; i < passwd.length; i++) {
			chkChar1 = passwd.charAt(i);
			chkChar2 = passwd.charAt(i+1);

			//동일문자 카운트
			if (chkChar1 == chkChar2) {
				chkSameCnt = chkSameCnt + 1;
			}
			chkChar3 = passwd.charAt(i+2);
			//연속성(+) 카운드
			if (chkChar1.charCodeAt(0) - chkChar2.charCodeAt(0) == 1 && chkChar2.charCodeAt(0) - chkChar3.charCodeAt(0) == 1) {
				chkPmncPlus = chkPmncPlus + 1;
			}
			//연속성(-) 카운드
			if(chkChar1.charCodeAt(0) - chkChar2.charCodeAt(0) == -1 && chkChar2.charCodeAt(0) - chkChar3.charCodeAt(0) == -1){
				chkPmncMinus = chkPmncMinus + 1;
			}
		}
		if (chkPmncPlus > 1 || chkPmncMinus > 1 ) {
			return false;
		}

		return true;
	};
	validateUtil.isMatchPassword = function(passwd, rePasswd) {
		if (typeof passwd == "undefined")
			return false;
		if (typeof rePasswd == "undefined")
			return false;

		if (passwd == "" || rePasswd == "")
			return false;
		return passwd == rePasswd;

	};
	validateUtil.isValidLength = function(value, min, max) {
		var length = value.length;
		return length >= min && length <= max;

	};
	validateUtil.isValidDate = function(value) {
		if (typeof value == "undefined") {
			return false;
		}
		value = value.replace(/\./g, "");

		return dateRegex.test(value);
	};
	validateUtil.isValidDatetime = function(year, month, day, hour, minute,
			second) {
		month -= 1;
		hour = hour || 0;
		minute = minute || 0;
		second = second || 0;
		try {
			var dt = new Date(year, month, day, hour, minute, second);
			if (dt.getDate() != day) {
				return false;
			} else if (dt.getMonth() != month) {
				return false;
			} else if (dt.getFullYear() != year) {
				return false;
			} else if (dt.getHours() != hour) {
				return false;
			} else if (dt.getMinutes() != minute) {
				return false;
			} else if (dt.getSeconds() != second) {
				return false;
			}
		} catch (ex) {
			return false;
		}

		return true;
	};
	//input type='month'가 지원되지 않는 기기 년도, 월 체크
	validateUtil.isValidMonth = function(yearMonth) {
		var yearMonthSplit;
		var year;
		var month;

		if (yearMonth.length == 6 ) {
			year = yearMonth.substring(0,4);
			month = yearMonth.substring(4,6);
		} else if (yearMonth.length == 7) {
			yearMonthSplit = yearMonth.split(".");
			year = yearMonthSplit[0];
			month = yearMonthSplit[1];
		} else {
			return false;
		}

		if(1900 > Number(year)) {
			return false;
		}

		month -= 1;

		try {
			var dt = new Date(year, month, "01");
			if (dt.getMonth() != month) {
				return false;
			} else if (dt.getFullYear() != year) {
				return false;
			}
		} catch (ex) {
			return false;
		}

		return true;
	};
	validateUtil.isDate = function(value) {
		if (typeof value == "undefined")
			return false;
		var date;
		if (datetimeRegex.test(value)) {
			date = datetimeRegex.exec(value);
			if (date[7] == ':')
				return false;
			return validateUtil.isValidDatetime(date[1], date[3], date[4], date[5], date[6], date[8]);
		} else if (dateRegex.test(value)) {
			date = dateRegex.exec(value);
			return validateUtil.isValidDate(date[1], date[3], date[4]);
		}
		return false;
	};
	validateUtil.isPositiveNumber = function(value) {
		if (typeof value == "undefined")
			return false;
		if (positiveNumberRegex.test(value)) {
			var str = value.replace(/[,]/g, "");
			if (str * 1 > 0)
				return true;
		}
		return false;
	};
	validateUtil.isZero = function(value) {
		if (typeof value == "undefined")
			return false;
		if (positiveNumberRegex.test(value)) {
			var str = value.replace(/[,]/g, "");
			if (str * 1 == 0)
				return true;
		}
		return false;

	};
	validateUtil.isNatureNumber = function(value) {
		if (typeof value == "undefined")
			return false;
		return natureNumberRegex.test(value);
	};
	validateUtil.isNegtiveNumber = function(value) {
		if (typeof value == "undefined")
			return false;
		return negtiveNumberRegex.test(value);
	};
	validateUtil.isPositiveInt = function(value) {
		if (typeof value == "undefined")
			return false;
		return positiveIntRegex.test(value);
	};
	validateUtil.isNegtiveInt = function(value) {
		if (typeof value == 'undefined')
			return false;
		return negtiveIntRegex.test(value);
	};
	validateUtil.isEmail = function(value) {
		var email = value.split("@");
		var email_Domain = email.length > 1 ? email[1].split(".") : email;

		if (typeof value == 'undefined') {
			return false;
		}

		if (email_Domain[1] == "com" && email_Domain[2] == "com") {
			return false;
		}

		if (email_Domain[1] == "net" && email_Domain[2] == "net") {
			return false;
		}

		return emailRegex.test(value);
	};
	validateUtil.isEmailId = function(value) {
		if (typeof value == 'undefined')
			return false;
		return emailIdRegex.test(value);
	};
	validateUtil.isEmailDomain = function(value) {
		var domain = value.split(".");

		if (typeof value == 'undefined'){
			return false;
		}

		if (domain[1] == "com" && domain[2] == "com") {
			return false;
		}

		if (domain[1] == "net" && domain[2] == "net") {
			return false;
		}

		return emailDomainRegex.test(value);
	};
	validateUtil.isMobile = function(value) {
		if (typeof value == 'undefined')
			return false;
		return mobileRegex.test(value);
	};
	validateUtil.isCert = function(value) {
		if (typeof value == 'undefined')
			return false;
		return certRegex.test(value);
	};
	validateUtil.isPostCode = function(value) {
		if (typeof value == 'undefined')
			return false;
		return postCodeRegex.test(value);
	};
	validateUtil.isTelFax = function(value) {
		if (typeof value == 'undefined')
			return false;
		return (telFaxRegex.test(value) || tel15Regex.test(value));
	};
	validateUtil.isBirthday = function(value) {
		if (typeof value == 'undefined')
			return false;
		return birthdayRegex.test(value);
	};
	validateUtil.isSpecialString = function(value) {
		if (typeof value == 'undefined')
			return false;
		return specialStringRegex.test(value);
	};
	validateUtil.isBankNumber = function(value) {
		if (typeof value == 'undefined')
			return false;
		return bankNumberRegex.test(value);
	};
	validateUtil.isIdentityCard = function(value) {
		if (typeof value == 'undefined')
			return false;
		return identityCardRegex.test(value);
	};
	validateUtil.isIp = function(value) {
		if (typeof value == 'undefined')
			return false;
		return ipRegex.test(value);
	};
	validateUtil.isDecial = function(value) {
		if (typeof value == 'undefined')
			return false;
		return decimalRegex.test(value);
	};
	//기간 유효성 체크
	validateUtil.isTerm = function(value1, value2) {
		if (typeof value1 == 'undefined')
			return false;
		if (typeof value2 == 'undefined')
			return false;

		var iValue1 = parseInt(value1.replace(/\./g, ""));
		var iValue2 = parseInt(value2.replace(/\./g, ""));

		if (validateUtil.isDecial(iValue1) == false || validateUtil.isDecial(iValue2) == false) {
			return false;
		}
		if (iValue1 > iValue2) {
			return true;
		} else {
			return false;
		}
	};

	//수치 유효성 체크
	validateUtil.isMeasuer = function(value1, value2) {
		if (typeof value1 == 'undefined')
			return false;
		if (typeof value2 == 'undefined')
			return false;

		var fValue1 = parseFloat(value1);
		var fValue2 = parseFloat(value2);

		if (validateUtil.isDecial(fValue1) == false || validateUtil.isDecial(fValue2) == false) {
			return false;
		}
		if (fValue1 > fValue2) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * 피플인사이드 추가
	 */
	validateUtil.isEnglishNumber = function(value) {
		if (typeof value == 'undefined')
			return false;
		return englishNumberRegex.test(value);
	};
	// 빈값이면 메세지 출력
	validateUtil.checkBlank = function(obj, elem, msg) {
		var val = obj.val();
		if (validateUtil.isBlank(val)) {
			elem.text(msg).show();
			return true;
		}
		return false;
	};
	// 빈값이면 메세지 출력
	validateUtil.checkBlank = function(obj, msg) {
		var val = obj.val();
		if (validateUtil.isBlank(val)) {
			alert(msg);
			obj.focus();
			return true;
		}
		return false;
	};
	// 영문, 숫자이외에 값이 존재하면 메세지 출력
	validateUtil.checkEnglishNumber = function(obj, msg) {
		var val = obj.val();
		if (validateUtil.isEnglishNumber(val) == false) {
			alert(msg);
			obj.focus();
			return true;
		}
		return false;
	};
	// 특수문자가 존재하면 메세지 출력
	validateUtil.checkSpecialString = function(obj, msg) {
		var val = obj.val();
		if (validateUtil.isSpecialString(val)) {
			alert(msg);
			obj.focus();
			return true;
		}
		return false;
	};
	// 값의 길이가 최소길이와 최대길이 사이에 속하지 않으면 메세지 출력
	validateUtil.checkValidLength = function(obj, msg, min, max) {
		var val = obj.val();
		if (typeof max == 'undefined')
			max = 99999999;
		if (validateUtil.isValidLength(val, min, max) == false) {
			alert(msg);
			obj.focus();
			return true;
		}
		return false;
	};
	// val1과 val2가 일치하지 않으면 메세지 출력
	validateUtil.checkEqualString = function(obj1, obj2, msg) {
		var val1 = obj1.val();
		var val2 = obj2.val();
		if (val1 != val2) {
			alert(msg);
			obj.focus();
			return true;
		}
		return false;
	};
	// 숫자 이외의 값이 존재하면 메세지 출력
	validateUtil.checkNatureNumber = function(obj, msg) {
		var val = obj.val();
		if (validateUtil.isNatureNumber(val) == false) {
			alert(msg);
			obj.focus();
			return true;
		}
		return false;
	};
	// 핸드폰번호 유효성 검사
	validateUtil.checkMobile = function(obj, elem, msg) {
		var val = obj.val();
		if (validateUtil.isMobile(val) == false) {
			elem.text(msg).show();
			return true;
		}
		return false;
	};
	// 이메일 유효성 검사
	validateUtil.checkEmail = function(obj, elem, msg) {
		var val = obj.val();
		if (validateUtil.isEmail(val) == false) {
			elem.text(msg).show();
			return true;
		}
		return false;
	};
	// 주민번호 유효성 검사
	validateUtil.checkJumin = function(obj, elem, msg) {
		var val = obj.val();

		var pattern = /^([0-9]{6})-?([0-9]{7})$/;
	    if (!pattern.test(val)) {
	    	elem.text(msg).show();
			return true;
	    }

	    val = RegExp.$1 + RegExp.$2;
	    if(val.substring(2,3) > 1) {
	    	elem.text(msg).show();
			return true;
	    }
	    if(val.substring(4,5) > 3) {
	    	elem.text(msg).show();
			return true;
	    }
	    var sum = 0;
	    var last = val.charCodeAt(12) - 0x30;

	    var bases = "234567892345";
	    for (var i=0; i<12; i++) {
	        if (isNaN(val.substring(i,i+1))) {
	        	elem.text(msg).show();
				return true;
	        }
	        sum += (val.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
	    }
	    var mod = sum % 11;
	    if ((11 - mod) % 10 != last) {
	    	elem.text(msg).show();
	    	return true;
	    }
	    return false;
	};
	//
	validateUtil.checkDate = function(obj, msg) {
		var val = obj.val();
		if (validateUtil.isDate(val) == false) {
			alert(msg);
			obj.focus();
			return true;
		}
		return false;
	};
	
	// 도메인 형식 체크
	validateUtil.isDomain = function(value) {
		if (typeof value == 'undefined') {
			return true;
		}
		
		if(/^www\./.test(value)) {
			return false;
		}
		
		return domainRegex.test(value);
	};
	
	// 코드 형식 체크
	validateUtil.isCode = function(value) {
		if (typeof value == 'undefined')
			return true;
		return codeRegex.test(value);
	};
	
	// 한글 체크
	validateUtil.isHangle = function(value) {
		if (typeof value == 'undefined')
			return true;
		return hangleRegex.test(value);
	};

	window.validateUtil = validateUtil;

}) (window);