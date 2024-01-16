/*
 * UI와 상관없는 공통적으로 사용하는 함수들 모임
 */

/**
 * Cookie제어 Util
 */
var CookieUtil = {

    get: function (name){
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;
            
        if (cookieStart > -1){
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1){
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        } 

        return cookieValue;
    },
    
    set: function (name, value, path, domain, secure, expires) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += "; path=" + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },
    
    unset: function (name, path, domain, secure){
        this.set(name, "", new Date(0), path, domain, secure);
    }

};

/**
 * null 체크
 * @param obj
 * @returns
 */
function fn_isNull(obj) {
	return (typeof obj != "undefined" && obj != null && obj != "") ? false : true;
}


/**
 * not null 체크
 * @param obj
 * @returns
 */
function fn_isNotNull(obj) {
	return !fn_isNull(obj);
}

/**
 * JSON OBJECT TO TEXT
 * @param objJson
 * @returns
 */
function fn_toJsonText(objJson) {
	var textJson;
	try {
		textJson = JSON.stringify(objJson);
	} catch (e){
	}
	return textJson;
}

/**
 * Text To JSON OBJECT
 * @param textJson
 * @returns
 */
function fn_toJsonObject(textJson) {
	var objJson;
	try {
		objJson = JSON.parse(textJson);
	} catch (e){
	}
	return objJson;
}

/**
 * XML To Text
 * @param node
 * @returns
 */
function fn_toXmlText(node) {
   if (typeof(XMLSerializer) !== 'undefined') {
      var serializer = new XMLSerializer();
      return serializer.serializeToString(node);
   } else if (node.xml) {
      return node.xml;
   }
}


/**
 * IE인가요?
 * @returns {Boolean}
 */
function fn_isIE() {
	var bIE = false;
	if (fn_getBrowserType().indexOf("IE") > -1) {
		bIE = true;
	}
	return bIE;
}


/**
 * 어떤 브라우저일까?
 * @returns {String}
 */
function fn_getBrowserType() {
      
    var _ua = navigator.userAgent;
    var rv = -1;
     
    //IE 11,10,9,8
    var trident = _ua.match(/Trident\/(\d.\d)/i);
    if( trident != null )
    {
        if( trident[1] == "7.0" ) return rv = "IE" + 11;
        if( trident[1] == "6.0" ) return rv = "IE" + 10;
        if( trident[1] == "5.0" ) return rv = "IE" + 9;
        if( trident[1] == "4.0" ) return rv = "IE" + 8;
    }
     
    //IE 7...
    if( navigator.appName == 'Microsoft Internet Explorer' ) return rv = "IE" + 7;
     
    /*
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if(re.exec(_ua) != null) rv = parseFloat(RegExp.$1);
    if( rv == 7 ) return rv = "IE" + 7; 
    */
     
    //other
    var agt = _ua.toLowerCase();
    if (agt.indexOf("chrome") != -1) return 'Chrome';
    if (agt.indexOf("opera") != -1) return 'Opera'; 
    if (agt.indexOf("staroffice") != -1) return 'Star Office'; 
    if (agt.indexOf("webtv") != -1) return 'WebTV'; 
    if (agt.indexOf("beonex") != -1) return 'Beonex'; 
    if (agt.indexOf("chimera") != -1) return 'Chimera'; 
    if (agt.indexOf("netpositive") != -1) return 'NetPositive'; 
    if (agt.indexOf("phoenix") != -1) return 'Phoenix'; 
    if (agt.indexOf("firefox") != -1) return 'Firefox'; 
    if (agt.indexOf("safari") != -1) return 'Safari'; 
    if (agt.indexOf("skipstone") != -1) return 'SkipStone'; 
    if (agt.indexOf("netscape") != -1) return 'Netscape'; 
    if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
}


/**
 * 문자열의 자릿수 보다 적은 공백을 지정문자로 채우기
 * @param str
 * @param digits
 * @param fillStr
 * @returns {String}
 */
function fn_setFillBlanks(str, digits, fillStr) {

    var blank = "";
    str = str.toString();  

    if  (str.length < digits) {  
        for (var i = 0; i < digits - str.length; i++)  
        {
        	blank += fillStr;  
        }
    }
    return blank + str;  
}


/**
 * 오늘 일자 구하기
 * @returns {Date}
 */
function fn_getToday() {
	return new Date();
}

function fn_getToday2() {
	const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    return year.toString() + month.toString() + date.toString();
}

/**
 * 이번달의 첫번째 일자 구하기
 * @returns {Date}
 */
function fn_getFirstDate() {
    var nowDate = new Date();
	return new Date(nowDate.getFullYear(),nowDate.getMonth(),1);
}

/**
 * 이번달의 마지막 일자 구하기
 * @returns {Date}
 */
function fn_getLastDate() {
    var nowDate = new Date();
	return new Date(nowDate.getFullYear(),nowDate.getMonth()+1,0);
}

/**
 * 해당년월의 마지막 일자 구하기
 * @param year
 * @param month
 * @returns {Date}
 */
function fn_getLastDayOfMonth(year, month) {
	
	if(month<10) month = "0"+month;
	
    var _firstDayOfMonth = [ year, month, "01"].join('-');  // ex) 2014-04-01 
    var _firstDayOfMonthDate = new Date(_firstDayOfMonth);
    _firstDayOfMonthDate.setMonth(_firstDayOfMonthDate.getMonth() + 1);   // ex) 2014-05-01 
    _firstDayOfMonthDate.setDate(_firstDayOfMonthDate.getDate() - 1);   // ex) 2014-04-30
    
    return _firstDayOfMonthDate; 
}

/**
 * 몇일후 날짜 계산		
 * 	ex)  fn_getDateOfPlusDay( Date, -30 ) 
 * @param targetDate
 * @param dayInt
 * @returns {Date}
 */
function fn_getDateOfPlusDay(targetDate, dayInt) {
	var newDate = new Date();
	var processTime = targetDate.getTime() + ( parseInt(dayInt)*24*60*60*1000 );
	newDate.setTime(processTime);
	
	return newDate;
}


/**
 * 오늘의 년월을 yyyy-dd로 가져옴
 * @returns {String}
 */
function fn_getYearMonth() {
	return fn_getStrFromDate(fn_getToday()).substring(0, 7);
}

/**
 * Date객체를 String(yyyy구분mm구분dd)으로 변환
 * @param dateObj
 * @param sDelimiter : 별도 지정 없으면 "-"
 * @returns {String}
 */
function fn_getStrFromDate(dateObj ,sDelimiter) {
	if (typeof sDelimiter == "undefined") sDelimiter = "-";
	
	var str   = "";
	var year  = dateObj.getFullYear();
	var month = dateObj.getMonth()+1;
	var day   = dateObj.getDate();
	
	str = year + sDelimiter + fn_setFillBlanks(month,2,'0') + sDelimiter + fn_setFillBlanks(day,2,'0');
	
	return str;
}

/**
 * 날자같은 문자를 'yyyy구분mm구분dd' 으로 변환
 * @param sdate
 * @param sDelimiter
 * @returns {String}
 */
function fn_getFormatDate(sdate, sDelimiter) {
	if (typeof sDelimiter == "undefined") sDelimiter = "-";
	
	var fmtDate = "";

	if(sdate.length == 8) {
       fmtDate = sdate.substring(0, 4) + sDelimiter + sdate.substring(4, 6) + sDelimiter + sdate.substring(6, 8);
    } else if (sdate.length == 6) {
       fmtDate = sdate.substring(0, 4) + sDelimiter + sdate.substring(4, 6);
    }

	return fmtDate;
}

/**
 * 숫자 스트링에 "," format을 줌
 * @param number
 * @returns
 */
function fn_getNumberWithComma(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * string에 천 단위 "," 추가
 * @param string
 * @returns
 */
function fn_stringWithCommas(string) {
    return string.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/**
 * 문자열 길이 계산
 * @param str
 * @returns {Number}
 */
function fn_getLength(str) {

	var charLength = 0;
	var ch1 = "";

    for(var i=0; i< str.length; i++) {
    	ch1 = str.charAt(i);
    	(escape(ch1).length > 4)?charLength += 2:charLength += 1;
    }
    return charLength;
}


/**
 * html 특수문자 치환
 * @param str
 * @returns {Number}
 */
function fn_unescapeHtml(str) {
	if (str == null) {
		return "";
	}
	return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#39;/g, "'");
}


/**
 * Submit하기위한 Form동적 생성
 * @param obj
 */
function fn_createFomSubmit(obj) {

	var form = document.createElement("form"); 

	form.action = obj.actionUrl; 
	form.name   = "objForm";

	if (typeof obj.method != "undefined"){
		form.method = obj.method;
	} else {
		form.method = "post"; 
	}
	
	if (typeof obj.target != "undefined"){
		form.target = obj.target;
	}

	for(var paramKey in obj) {
		// console.log("paramKey = "+paramKey);
		// console.log("postParam[paramKey] = "+obj[paramKey]);
		
		form = fn_addInput(form, "hidden", paramKey, obj[paramKey]);
    }
	
	document.body.appendChild(form);
    form.submit();
	
}

/**
 * Form에 Input객체 추가하여 생성
 * @param form
 * @param type
 * @param name
 * @param value
 * @returns
 */
function fn_addInput(form, type, name, value) {
	var input = document.createElement("input");
	input.type = type;
	input.name = name;
	input.value = value;
	
	form.insertBefore(input, null);
	
	return form;
}

/**
 * "-"가 없는 전화번호 마스킹 (뒤 4자리)
 * @param phNo 
 * @returns 
 */
function fn_phoneMaskingEnd (phNo) {
    var res = phNo;
    var mskOther = "";
    
    if (typeof res != "undefined") {
        if (res.length > 3) {
            mskOther = res.substr(0, res.length - 4);
            res = mskOther + "****";
        } else {
            res = "";
        }
    }

    return res;
}

/**
 * "-"가 없는 전화번호 마스킹 (가운데 4자리)
 * @param phNo 
 * @returns 
 */
 function fn_phoneMaskingCenter (phNo) {
    var res = phNo;
    var prefix = "";
    var suffix = "";

    if (typeof res != "undefined") {
        if (res.length > 7) {
            prefix = res.substr(0, res.length - 8);
            suffix = res.substr(res.length - 4, 4);
            res = prefix + "****" + suffix;
        } else if (res.length > 3) {
            prefix = res.substr(0, res.length - 4);
            res = prefix + "****";
        } else {
            res = "";
        }
    }

    return res;
}

function fn_urlAddMenuCode(url) {
    var res = url;
    var menuCode = gMenuCode;
    if (menuCode && menuCode != "") {
        if (url.indexOf("?") > -1) {
            res += "&menu_code=" + menuCode;
        } else {
            res += "?menu_code=" + menuCode;
        }
    }
    return res;
}

function fn_openNewWindow(url, title, options) {
    var newUrl = fn_urlAddMenuCode(url);
    return window.open(newUrl, title, options)
}

function fn_getOnlyNumber(str) {
    var regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
    return str.replace(regex, "");
}

function fn_adminAlert(message) {
	if (parent.fn_footerMessage) {
		parent.fn_footerMessage(message);
	} else {
		alert(message);
	}
}

function fn_objectToQueryString(obj) {
    // return encodeURIComponent(new URLSearchParams(obj).toString());
    return '?' + Object.keys(obj).map(key => {
        return `${key}=${encodeURIComponent(obj[key])}`;
    }).join('&');
}

function fn_queryStringToObject(params) {
    return JSON.parse(
            '{"'
            + decodeURI(params.replace(/&/g, "\",\"").replace(/=/g,"\":\""))
            + '"}');
}