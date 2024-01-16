/**
 * 기본적인 ajax통신용
 * @param option
 * @param bProgressOnEvent : 처리중 프로그래스바 표시(default:true)
 */

function fn_ajax(option, bProgressOnEvent) {
  // 기본 설정은 프로그레스바 표시
  if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
  if (bProgressOnEvent && parent.header != undefined)
    parent.layoutMain.progressOn();

  //console.log("@@@ fn_ajax : async = " + async);
  /*
	$.each(option.postParam, function (key, data) {
	    console.log("@@@ fn_ajax : " + key + " = " + data);
	});
	*/
  if (typeof option.async == "undefined") option.async = true;
  if (typeof option.dataType == "undefined") option.dataType = "json";

  var url = fn_urlAddMenuCode(option.url);

  $.ajax({
    url: rootPath + url,
    data: option.param || JSON.stringify(option.postParam),
    async: option.async,
    type: option.type || "POST",
    dataType: option.dataType,
    contentType: "application/json; charset=utf-8",
    success: function (responseData, textStatus, jqXHR) {
      try {
        fn_s_succMsg(option.postType);
        if (option.success) option.success(responseData, textStatus, jqXHR);
      } catch (e) {
        console.log(e);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // 에러일 때 alert창X
      if (option.resultCodeException) {
        option.resultCodeException(jqXHR);
        return;
      }
      if (option.mockResult) {
        option.mockResult(jqXHR);
        return;
      }
      fn_s_failMsg(jqXHR, textStatus, errorThrown);
      if (option.fail) option.fail();
    },
    complete: function (data) {
      if (bProgressOnEvent && parent.header != undefined)
        parent.layoutMain.progressOff();
    },
  });

  // 실행완료여부와 상관없이 지정되면 실행..
  if (option.loadCompleted) option.loadCompleted();
}

function fn_ajax_formdata(option, bProgressOnEvent) {
  // 기본 설정은 프로그레스바 표시
  if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
  if (bProgressOnEvent && parent.header != undefined)
    parent.layoutMain.progressOn();

  //console.log("@@@ fn_ajax : async = " + async);
  /*
	$.each(option.postParam, function (key, data) {
	    console.log("@@@ fn_ajax : " + key + " = " + data);
	});
	*/
  if (typeof option.async == "undefined") option.async = true;
  if (typeof option.dataType == "undefined") option.dataType = "json";

  var url = fn_urlAddMenuCode(option.url);

  $.ajax({
    url: rootPath + url,
    data: option.param,
    async: option.async,
    type: option.type || "POST",
    dataType: option.dataType,
    enctype: "multipart/form-data",
    processData: false,
    contentType: false,
    success: function (responseData, textStatus, jqXHR) {
      try {
        fn_s_succMsg(option.postType);
        if (option.success) option.success(responseData, textStatus, jqXHR);
      } catch (e) {
        console.log(e);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      //alert('fail');
      // 에러일 때 alert창X
      if (option.resultCodeException) {
        option.resultCodeException(jqXHR);
        return;
      }
      fn_s_failMsg(jqXHR, textStatus, errorThrown);
      if (option.fail) option.fail();
    },
    complete: function (data) {
      if (bProgressOnEvent && parent.header != undefined)
        parent.layoutMain.progressOff();
    },
  });

  // 실행완료여부와 상관없이 지정되면 실행..
  if (option.loadCompleted) option.loadCompleted();
}

/**
 * 지정된 grid에 조회결과를 넣는다.
 * @param option
 */
function fn_ajaxGetGrid(option, bProgressOnEvent) {
  //if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
  if (bProgressOnEvent && parent.header != undefined)
    parent.layoutMain.progressOn();

  if (typeof option.async == "undefined") option.async = true;

  var url = fn_urlAddMenuCode(option.url);

  $.ajax({
    url: rootPath + url,
    data: option.postParam,
    async: option.async,
    type: "POST",
    dataType: "json",
    success: function (responseData, textStatus, jqXHR) {
      try {
        // console.log(responseData);
        //option.gridName.clearAll();
        //if(option.gridName) option.gridName.parse(fn_toJsonText(responseData.result), option.parseType);

        option.gridName.data.parse(responseData.result.data);

        if (option.success) option.success(responseData);
      } catch (e) {}
    },
    error: function (jqXHR, textStatus, errorThrown) {
      fn_s_failMsg(jqXHR, textStatus, errorThrown);
      if (option.fail) option.fail();
    },
    complete: function (data) {
      if (bProgressOnEvent && parent.header != undefined)
        parent.layoutMain.progressOff();
    },
  });

  if (option.loadCompleted) option.loadCompleted();
}

/**
 * Form의 데이터를 저장하기 위해 전송
 * @param option
 * @param bProgressOnEvent
 */
function fn_s_ajaxSaveForm(option, bProgressOnEvent) {
  if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
  if (bProgressOnEvent && parent.header != undefined)
    parent.layoutMain.progressOn();
  if (typeof option.async == "undefined") option.async = true;

  var url = fn_urlAddMenuCode(option.url);

  $.ajax({
    url: rootPath + url,
    data: option.postParam,
    async: option.async,
    type: "POST",
    dataType: "json",
    success: function (responseData, textStatus, jqXHR) {
      try {
        // msgCode fail일때 처리 추가 20180907 (사용자등록 validation체크에서 사용)
        if (responseData == "fail") {
          //alert(responseData.msg);
          return;
        }
        fn_s_succMsg(option.postType);
        if (option.success) option.success(responseData);
      } catch (e) {
        console.log(e);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("jqXHR : " + jqXHR);
      console.log("jqXHR : " + textStatus);
      console.log("jqXHR : " + errorThrown);
      fn_s_failMsg(jqXHR, textStatus, errorThrown);
      if (option.fail) option.fail();
    },
    complete: function (data) {
      if (bProgressOnEvent && parent.header != undefined)
        parent.layoutMain.progressOff();
    },
  });

  if (option.loadCompleted) option.loadCompleted();
}

/**
 *
 * Transaction 처리 후 성공 메세지
 */
function fn_s_succMsg(postType) {
  //console.log("postType = " + postType);
  switch (postType) {
    case "save":
      fn_s_message("저장 되었습니다.");
      break;
    case "exec":
      fn_s_message("처리 되었습니다.");
      break;
    case "del":
      fn_s_message("삭제 되었습니다.");
      break;
    case "mail":
      fn_s_message("발송 되었습니다.");
      break;
    default:
      break;
  }
}

/**
 * Grid의 데이터를 저장하기 위해 전송
 *  - contentType : "application/json"
 * @param option
 * @param bProgressOnEvent
 */
function fn_s_ajaxSaveGrid(option, bProgressOnEvent) {
  if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
  if (bProgressOnEvent && parent.header != undefined)
    parent.layoutMain.progressOn();
  if (typeof option.async == "undefined") option.async = true;

  // json 변환처리
  option.postParam = fn_toJsonText(option.postParam);
  var url = fn_urlAddMenuCode(option.url);

  $.ajax({
    url: rootPath + url,
    data: option.postParam,
    async: option.async,
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    success: function (responseData, textStatus, jqXHR) {
      try {
        fn_s_succMsg(option.postType);
        if (option.success) option.success(responseData);
      } catch (e) {
        console.log(e);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      fn_s_failMsg(jqXHR, textStatus, errorThrown);
      if (option.fail) option.fail();
    },
    complete: function (data) {
      if (bProgressOnEvent && parent.header != undefined)
        parent.layoutMain.progressOff();
    },
  });

  if (option.loadCompleted) option.loadCompleted();
}

/*
 * Transaction 처리 후 에러 메세지
 */
function fn_s_failMsg(jqXHR, textStatus, errorThrown) {
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
  if (0 < parent.length) {
    parent.location.href = rootPath + url;
  } else {
    location.href = rootPath + url;
  }
}

function fn_fileUpload(option, bProgressOnEvent, useDefaultFailMsg) {
  if (typeof bProgressOnEvent == "undefined") bProgressOnEvent = true;
  if (bProgressOnEvent && parent.header != undefined)
    parent.layoutMain.progressOn();
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
    success: function (responseData, textStatus, jqXHR) {
      try {
        if (option.success) option.success(responseData, textStatus, jqXHR);
      } catch (e) {
        console.log(e);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (option.resultCodeException) {
        console.log('[dhtmlx7/commonTransaction] error. resultCodeException => ', jqXHR);
        option.resultCodeException(jqXHR);
        return;
      }

      if (useDefaultFailMsg == true) {
        fn_s_failMsg(jqXHR, textStatus, errorThrown);
      }
      if (option.fail) option.fail();
    },
    complete: function (data) {
      if (bProgressOnEvent && parent.header != undefined)
        parent.layoutMain.progressOff();
    },
  });

  if (option.loadCompleted) option.loadCompleted();
}

function fn_convertServerErrorMessage(msg) {
  if(msg == null || msg == '') {
    return msg;
  }
  return decodeURIComponent(msg.replaceAll('+', ' '));
}

function fn_resultCodeException(jqXHR) {
  let errorMessage = '요청에 실패하였습니다.';
  if((jqXHR.status && jqXHR.getResponseHeader("msgcode") && jqXHR.getResponseHeader("msg"))) {
    errorMessage = fn_convertServerErrorMessage(jqXHR.getResponseHeader("msg"));
  }
  alert(errorMessage);
}
