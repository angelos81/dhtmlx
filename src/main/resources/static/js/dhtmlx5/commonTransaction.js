/*
 * Transaction 처리
 */



/**
 * 기본적인 ajax통신용
 * @param option
 * @param bProgressOnEvent : 처리중 프로그래스바 표시(default:true)
 */
function fn_ajax(option, bProgressOnEvent) {
	
	// 기본 설정은 프로그레스바 표시
	if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
	if (bProgressOnEvent) parent.layoutMain.progressOn();
	
	//console.log("@@@ fn_ajax : async = " + async);
	/*
	$.each(option.postParam, function (key, data) {
	    console.log("@@@ fn_ajax : " + key + " = " + data);
	});
	*/
	if (typeof option.async == "undefined") option.async = true;
	if (typeof option.type == "undefined") option.type = "POST";

	var url = fn_urlAddMenuCode(option.url);

	$.ajax({
		    url      : rootPath + url,
		    data     : JSON.stringify(option.postParam),
		    async    : option.async,
		    type     : option.type,
		    dataType : "json",
			contentType: 'application/json; charset=utf-8',
	        success  : function(responseData, textStatus, jqXHR){
				try{
					if (responseData.msgCode == "fail") {
						alert(responseData.msg);
						return;
					}
					fn_succMsg(option.postType);
					if(option.success) option.success(responseData);
				} catch (e) {
					console.log(e);
				}
		    },
		    error : function(jqXHR, textStatus, errorThrown) {
		        fn_failMsg(jqXHR, textStatus, errorThrown);
		        if(option.fail) option.fail();
	        },
	        complete : function(data) {
	    	 	if (bProgressOnEvent) parent.layoutMain.progressOff();
	        }
		 });

	// 실행완료여부와 상관없이 지정되면 실행..
    if(option.loadCompleted) option.loadCompleted();
}



/**
 * 콤보박스에 사용하기 위해 데이터를 한번에 가져옴  
 * (공통코드와 지정된 ID의 sql을 실행한 결과(컬럼명은 CD/NM으로)를 조회)
 * 
 *  - 지정된 ID : sqlid = "조회결과:실행SQL:(콤보사용추가항목);결과data:실행SQL:(콤보사용추가항목);결과data:실행SQL"
 *  - 공통코드   : grpcd = "결과data:공통코드:(사용여부추가항목):(콤보사용추가항목);결과data:공통코드:(사용여부추가항목):(콤보사용추가항목)"
 *  
 *  - 추가옵션(필수아님)
 *  	- 콤보사용추가항목 : Combo에 사용할때 맨 위에 전체/선택 항목을 추가
 *  					A = 전체
 *  					S = 선택
 *  	- 사용여부추가항목 : 공통코드를 가져올때 사용여부를 조건으로 추가
 *  					Y = 사용
 *  					N = 미사용
 *  
 *  - ex) var postParam = new Object();
		 	  postParam.sqlid = "dsUserGroup:CMSY0030.selectList:S";
		      postParam.grpcd = "dsStatus:CM003;dsUserType:CM017:Y:S";
				
			  fn_ajaxGetData({ postParam           : postParam
				             , success             : function(responseData) { 
							           	  cboUserGrp.load(responseData.dsUserGroup); 
							           	  cboStatus.load(responseData.dsStatus);
				                 }
			  });
 *  - 콤보박스 생성용으로 options이 포함되어 있지만 다른용도로 사용가능
 *  	ex) vEXIST_YN = responseData.dsCHK.options[0].EXIST_YN;
 *  
 * @param option
 */
function fn_ajaxGetDsForCombo(option) {
	if (typeof option.async == "undefined") option.async = true;

	option.url      = "/dhtmlx/common/selectDsForCombo.do";
	option.postType = ""; // 처리결과 메세지는 필요없음
	
	fn_ajax(option, true);
}


/**
 * 지정된 Form에 조회결과를 넣는다.
 * @param option
 */
function fn_ajaxGetForm(option, bProgressOnEvent) {
	if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
	if (bProgressOnEvent) parent.layoutMain.progressOn();
	if (typeof option.async == "undefined") option.async = true;
	if (typeof option.type == "undefined") option.type = "POST";

	var url = fn_urlAddMenuCode(option.url);

	$.ajax({
	        url: rootPath + url,
	        data: JSON.stringify(option.postParam),
	        async: option.async,
	        type: option.type,
	        dataType: "json",
			contentType: 'application/json; charset=utf-8',
	        success: function(responseData, textStatus, jqXHR){
	        	try{
					if (responseData.msgCode == "fail") {
						alert(responseData.msg);
						return;
					}
					option.formName.clear();
					if(option.formName) option.formName.setFormData (eval("responseData.result.data[0]"));
					if(option.success)  option.success(responseData);	
	        	}catch (e) {
		     		console.log(e);
				}
	        },
		    error: function(jqXHR, textStatus, errorThrown) {
		        fn_failMsg(jqXHR, textStatus, errorThrown);
	            if(option.fail) option.fail();
	        },
	        complete: function(data) {
	        	if (bProgressOnEvent) parent.layoutMain.progressOff();
	        }
	});

	if(option.loadCompleted) option.loadCompleted();
}


/**
 * 지정된 grid에 조회결과를 넣는다.
 * @param option
 */
function fn_ajaxGetGrid(option, bProgressOnEvent) {
	if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
	if (bProgressOnEvent) parent.layoutMain.progressOn();
	
	if (typeof option.async     == "undefined") option.async     = true;
	if (typeof option.parseType == "undefined") option.parseType = "js";
	if (typeof option.type == "undefined") option.type = "POST";

	var url = fn_urlAddMenuCode(option.url);

	$.ajax({
	        url: rootPath + url,
	        data: JSON.stringify(option.postParam),
	        async: option.async,
	        type: option.type,
	        dataType: "json",
			contentType: 'application/json; charset=utf-8',
	        success: function(responseData, textStatus, jqXHR){
	        	try{
					if (responseData.msgCode == "fail") {
						alert(responseData.msg);
						return;
					}

					// console.log(responseData);
					option.gridName.clearAll();
					if(option.gridName) option.gridName.parse(fn_toJsonText(responseData.result), option.parseType);
					if(option.success ) option.success(responseData);
					
					//페이징 있을 경우 처리
					if(option.paging) option.paging(responseData);
	        	}catch (e) {
	        		//페이징 있을 경우 처리
	        		if(option.paging) option.paging();
				}
	        },
		    error: function(jqXHR, textStatus, errorThrown) {
		        fn_failMsg(jqXHR, textStatus, errorThrown);
	            if(option.fail) option.fail();
	          //페이징 있을 경우 처리
	            if(option.paging) option.paging();
	        },
	        complete: function(data) {
	        	if (bProgressOnEvent) parent.layoutMain.progressOff();
	        }
	});

    if(option.loadCompleted) option.loadCompleted();
}



/**
 * Form의 데이터를 저장하기 위해 전송
 * @param option
 * @param bProgressOnEvent
 */
function fn_ajaxSaveForm(option, bProgressOnEvent) {
	if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
	if (bProgressOnEvent) parent.layoutMain.progressOn();
	if (typeof option.async == "undefined") option.async = true;
	if (typeof option.type == "undefined") option.type = "POST";

	var url = fn_urlAddMenuCode(option.url);

	$.ajax({
		     url: rootPath + url,
		     data: JSON.stringify(option.postParam),
		     async: option.async,
		     type: option.type,
		     dataType: "json",
			 contentType: 'application/json; charset=utf-8',
		     success: function(responseData, textStatus, jqXHR){
				try{
					 // msgCode fail일때 처리 추가 20180907 (사용자등록 validation체크에서 사용)
					 if (responseData.msgCode == "fail") {
		     			 alert(responseData.msg);
		     			 return;
		     		 }
		     		 
					// fn_succMsg(option.postType);
				    if(option.success) option.success(responseData);
				} catch (e) {
					console.log(e);
				}
		     },
		     error : function(jqXHR, textStatus, errorThrown) {
		         fn_failMsg(jqXHR, textStatus, errorThrown);
		         if(option.fail) option.fail();
		     },
	         complete: function(data) {
	        	 if (bProgressOnEvent) parent.layoutMain.progressOff();
	         }
	});

	if(option.loadCompleted) option.loadCompleted();
}


/**
 * Grid의 데이터를 저장하기 위해 전송
 *  - contentType : "application/json"
 * @param option
 * @param bProgressOnEvent
 */
function fn_ajaxSaveGrid(option, bProgressOnEvent) {
	if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
	if (bProgressOnEvent) parent.layoutMain.progressOn();
	if (typeof option.async == "undefined") option.async = true;
	if (typeof option.type == "undefined") option.type = "POST";

	// json 변환처리
	option.postParam = fn_toJsonText(option.postParam);
	var url = fn_urlAddMenuCode(option.url);

	$.ajax({
		url: rootPath + url,
        data: JSON.stringify(option.postParam),
		async: option.async,
		type: option.type,
		dataType: "json",
		contentType: 'application/json; charset=utf-8',
		success: function(responseData, textStatus, jqXHR){
			try{
				if (responseData.msgCode == "fail") {
		     		alert(responseData.msg);
					return;
				}
				fn_succMsg(option.postType);
			    if(option.success) option.success(responseData);
			} catch (e) {
				console.log(e);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			fn_failMsg(jqXHR, textStatus, errorThrown);
			if(option.fail) option.fail();
		},
        complete: function(data) {
        	if (bProgressOnEvent) parent.layoutMain.progressOff();
        }
	});

	if(option.loadCompleted) option.loadCompleted();
}

function fn_fileUpload(option, bProgressOnEvent) {
	if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
	if (bProgressOnEvent) parent.layoutMain.progressOn();
	if (typeof option.async == "undefined") option.async = true;
	if (typeof option.type == "undefined") option.type = "POST";

	var url = fn_urlAddMenuCode(option.url);

	$.ajax({
		url: rootPath + url,
		data: option.data,
		async: option.async,
		type: option.type,
		processData: false,
    	contentType: false,
		success: function(responseData, textStatus, jqXHR){
		   try{
			   if(option.success) option.success(responseData);
		   } catch (e) {
			   console.log(e);
		   }
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (option.resultCodeException) {
				console.log('[dhtmlx7/commonTransaction] error. resultCodeException => ', jqXHR);
				option.resultCodeException(jqXHR);
				return;
			}

			fn_failMsg(jqXHR, textStatus, errorThrown);
			if(option.fail) option.fail();
		},
		complete: function(data) {
			if (bProgressOnEvent) parent.layoutMain.progressOff();
		}
	});

	if(option.loadCompleted) option.loadCompleted();
}

/*
 * Transaction 처리 후 성공 메세지
 */
function fn_succMsg(postType){
	 //console.log("postType = " + postType)
	 switch(postType) {
	 	case 'save': 
	 		fn_message('저장 되었습니다.');
	 		break;
	 	case 'exec': 
	 		fn_message('처리 되었습니다.');
	 		break;
	 	case 'del': 
	 		fn_message('삭제 되었습니다.');
	 		break;
	 	case 'mail': 
	 		fn_message('발송 되었습니다.');
	 		break;
	 	default:
	 		break;
	 }
}

/*
 * Transaction 처리 후 에러 메세지
 */
function fn_failMsg(jqXHR, textStatus, errorThrown){
	
/*	
* jqXHR methods
	readyState 
	status 
	statusText 
	
	getAllResponseHeaders() 
	getResponseHeader() 
	statusCode() 
	abort() 
	//console.log("jqXHR.getAllResponseHeaders() = " + jqXHR.getAllResponseHeaders());
	//console.log("jqXHR.getResponseHeader() = " + jqXHR.getResponseHeader());
	
	
	console.log("jqXHR.readyState = " + jqXHR.readyState);
	console.log("jqXHR.status = " + jqXHR.status);
	console.log("jqXHR.statusText = " + jqXHR.statusText);
	console.log("jqXHR.statusCode()) = " + jqXHR.statusCode());
	
	console.log("textStatus = " + textStatus);
	console.log("jqXHR.responseText = " + fn_toJsonObject(jqXHR.responseText));
*/
	
	// return 코드 확인
	if (jqXHR.status == 401) {
		fn_redirectErrorPage("/sessionValidException.do/invalidaccess");
	} else if (jqXHR.status == 403) {
		fn_redirectErrorPage("/sessionValidException.do/sessioncheck");
	} else if (jqXHR.status == 404) {
		alert("요청페이지를 찾을 수 없습니다.");
	} else if (jqXHR.responseText && JSON.parse(jqXHR.responseText)) {
		var message = JSON.parse(jqXHR.responseText).message;
		if (message == "DUPL_LOGIN_CHECK") {
			fn_redirectErrorPage("/sessionValidException.do/loginduplicate");
		} else if (message == "GROUPCODE_CHANGED") {
			fn_redirectErrorPage("/sessionValidException.do/groupcodeChanged");
		} else {
			alert("요청에 실패하였습니다.");
		}
	} else {
		alert("요청에 실패하였습니다.");
	}
}

function fn_redirectErrorPage(url) {
	if(0 < parent.length){
		parent.location.href = rootPath + url;
	} else {
		location.href = rootPath + url;
	}
}

function fn_resultCodeException(jqXHR) {
	let errorMessage = '요청에 실패하였습니다.';
	if((jqXHR.status && jqXHR.getResponseHeader("msgcode") && jqXHR.getResponseHeader("msg"))) {
		errorMessage = fn_convertServerErrorMessage(jqXHR.getResponseHeader("msg"));
	}
	alert(errorMessage);
}

