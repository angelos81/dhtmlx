/*
 * dhtmlx공통 처리 함수
 */

/**
 * 페이지 초기화 함수
 * @param bEnterEvent : 조회폼(frmSearch)에 엔터키 입력 시 조회 이벤트 여부(기본값 : true)
 */
function fn_init(bEnterEvent) {
	if (typeof bEnterEvent == "undefined") bEnterEvent = true;
	
	layoutMain.setSizes();
	$(window).resize(function() { layoutMain.setSizes(); });
	
	layoutMain.setOffsets({
	    top: 0,
	    right: 5,
	    bottom: 5,
	    left: 5
	});
	
	// layout에 이벤트 부여..
	// footer의 dock, undock 기능을 위한 select box추가
	/*layoutMain.forEachItem(function(cell){
	    // your codebhere, for example
	    //cell.setText(cell.getText()+" updated");
	    //console.log(cell.getId() + cell.getText() + " init~");
	    selLayoutMain = document.getElementById("selLayoutMain");
	    selLayoutMain.options.add(new Option(cell.getText(),cell.getId()));
	});*/

	layoutMain.attachEvent("onDblClick", function(name){
		//writeLog("event onDblClick called for mainLayout, cell "+name);
		fn_undockCell(this, name);
	});
		
	//레이아웃 셋팅~
	layoutMain.forEachItem(function(cell) {
		
		var layoutObject = layoutMain.cells(cell.getId()).getAttachedObject();
		//console.log("cell.getId() -=" + cell.getId()); 
	
		// 레아웃의 구성요소가 form일때는 따로 초기화작업을 함
		if (layoutObject instanceof window.dhtmlXForm) {
			fn_initForm(layoutObject);
			
		// sub layout을 가질때..
		} else if (window.dhtmlXLayoutObject != null && layoutObject instanceof window.dhtmlXLayoutObject) {
			//console.log("추가 layout을 가질때..");

			// 헤드 더블클릭 이벤트 부여..
			layoutObject.attachEvent("onDblClick", function(name){
				//writeLog("event onDblClick called for mainLayout, cell "+name);
				fn_undockCell(this, name);
			});
			
			layoutObject.forEachItem(function(subCell) {

				var layoutObjectSub = layoutObject.cells(subCell.getId()).getAttachedObject();
				//console.log("subCell.getId() -=" + subCell.getId()); 
				
				// form일때.
				if (layoutObjectSub instanceof window.dhtmlXForm) {
					fn_initForm(layoutObjectSub);
				}
			});
		}
	});
	
	// 조회폼(frmSearch)에 enter key 입력 시 조회 이벤트 발생처리
	if (bEnterEvent) {
		if ((typeof frmSearch != "undefined") && (typeof fn_search != "undefined") ){
			// 평범한 input
			frmSearch.attachEvent('onKeyDown', function(inp, event, name){
				try{
					var nameSplit = name.split("_");
					
					var ent = true;
					
					if(nameSplit.length>1){
						if(nameSplit[nameSplit.length-1] == "POP"){
							ent = false;
						}
					}
					
					if(ent){
		            	if ( event.which == 13 ) {
		            		fn_search();
		            	} 
					}
				}catch (e) {
					//console.log("event.which  e = "+e);
				}
		    });
			
			// combo인 경우
			try{
				frmSearch.forEachItem(function(name) {
					if (frmSearch.getItemType(name)=="combo"){
						frmSearch.getCombo(name).attachEvent("onKeyPressed", function(keyCode){
				            if ( event.which == 13 ) {
				            	fn_search();
				            } 
						 });
					}				
				});
			}catch (e) {
				//console.log("set enter event e = "+e);
			}
		}
	}
}

/**
 * 초기화 과정에서 Form설정
 * @param form
 */
function fn_initForm(form) {

	//calendar 이벤트
	var calendarArray = new Array();
	var calendarArrayCount = 0;
	try{
		form.forEachItem(function(name) {
			// input box readonly 색상 처리
			if($("input[name="+name+"]").attr("readonly") == "readonly"){
			   $("input[name="+name+"]").attr("style",$("input[name="+name+"]").attr("style")+"border:1px solid #ccc;"); 
			   // $("input[name="+name+"]").attr("style",$("input[name="+name+"]").attr("style")+"border:1px solid #ccc; color:#ccc;"); // 글자가 너무 흐려서 일단 막음
			}				
			
			//calendar 속성체크 후 처리
			if(form.getItemType(name)=="calendar"){
				
				calendarArray[calendarArrayCount] = name;
				calendarArrayCount++;
				
				//bg 이미지 셋팅
				if (dhtmlx_skin != "") {
					form.getInput(name).style.backgroundImage    = "url(" + rootPath + "/images/dhtmlx/paging/"+dhtmlx_skin+"/calendar.png)";
				}
				form.getInput(name).style.backgroundPosition = "center right";
				form.getInput(name).style.backgroundRepeat   = "no-repeat";
				
				// 현지화 작업
				form.getCalendar(name).loadUserLanguage('ko');
			}
		});
	}catch (e) {
		console.log("e = "+e);
	}
	
	//calendar 속성 있을 경우 이벤트 붙이기 
	if(calendarArrayCount>0){
		//calendar 포커스 아웃기 창 닫기
		form.attachEvent("onFocus", function(name){
			var b = true;
			for(var i=0 ; i<=calendarArrayCount ; i++){
				if(calendarArray[i]==name){
					b = false;						
				}
			}
			try{
				if(b){
					for(var i=0 ; i<=calendarArrayCount ; i++){
						if(form.getCalendar(calendarArray[i]).isVisible()){
							form.getCalendar(calendarArray[i]).hide();
						}
					}
				}
			}catch (e) {
				//console.log(" calendarArrayCount e = "+e);
			}
		});
		
		form.attachEvent('onInputChange', function(name,val,inp){
            for(var i=0 ; i<=calendarArrayCount ; i++){
				if(calendarArray[i]==name){
					//val.replace(/\-/g,"");
	            	if(val.length > 7){
	            		//날짜 유효성 체크
	            		if(isNaN(Date.parse(fn_getFormatDate(val.replace(/\-/g,""),"-")))==false){
	            			form.getCalendar(name).setDate(fn_getFormatDate(val.replace(/\-/g,""),"-"));
	            		}
	            		
	            	}
	            }
            }
	    });
	}
}

/**
 * dataProcessor초기화 함수
 * 	Grid의 validation과 row상태 변화 체크를 위해 사용
 * @param dp1
 * @param grid1
 * @param bErrorActionFlag
 */
function fn_initDP(dp1, grid1,  bErrorActionFlag) {
	if (typeof bErrorActionFlag == "undefined") bErrorActionFlag = true;
    dp1.setTransactionMode("POST", true);
    dp1.enableDataNames(true);
    dp1.setUpdateMode("off", false);
    
    //console.log("dp1.setUpdateMode(row, false);");
    //dp1.styles.error = "font-weight:bold; color:red";
    dp1.init(grid1);
    
    grid1.enableEditEvents(true,false,true);
    
    if (bErrorActionFlag) {
        dp1.defineAction("error", function(response) {
        	//alert(response.getAttribute('sid'));
        	if (fn_isNotNull(response.firstChild.nodeValue)) {
        	    fn_alertMsg(response.firstChild.nodeValue);
        	}
        });
    }
	dp1.attachEvent("onValidationError",function(id,messages){
		fn_alertMsg(messages.join("\n"));
		return true; //confirm block 
	})
}

/**
 * layout의 undockCell
 * @param layout
 * @param id
 */
function fn_undockCell(layout, id) {
    
    var width  = layout.cells(id).getWidth();;
    var height = layout.cells(id).getHeight();
    // undock(int x,int y,int width,int height);
    layout.cells(id).undock(200,0,width,height);
}



/**
 * 해당 Form에서 서버에 전송하기 위한 데이터를 추출
 * @param form
 * @returns
 */
function fn_getPostParam(form) {
	var postParam = form.getFormData();

	form.forEachItem(function(name){
		//calendar 데이터 포멧 변경
		if(form.getItemType(name)=="calendar"){
			postParam[name] = form.getCalendar(name).getFormatedDate("%Y%m%d");
			
		//combo 데이터 포멧변경(checkCombo사용)
		//checkCombo의 경우, 체크가 우선 선택은 체크가 다 풀어졌을때 사용
		}else if(form.getItemType(name)=="combo"){
			var checked_array = form.getCombo(name).getChecked();
			var new_param = "";
			if(checked_array.length > 0) {
				for(var i=0; i<checked_array.length; i++) {
					if (i>0) new_param += ",";
					new_param = new_param + "'"+checked_array[i] + "'";
				}
				postParam[name] = new_param;
			}
		}
	});
    return postParam;
}

/**
 * 공통코드 자동 완성 설정
 * @param fmName : 폼네임
 * @param name : 자동완성이 셋팅 될 인풋 네임 
 * @param codeName : 코드 값이 들어갈 네임
 * @param commclscd : 공통 코드 속성값(DEPO_BNK_CD:FI012:Y)
 * @param num : 자동완성 시작 글자수
 */
function fn_setAutocomplete(fmName, name, codeName, commclscd, num) {

	//코드값 리셋 이벤트
	fmName.attachEvent('onInputChange', function(eventObj,val,inp){
		if(eventObj==name){
			if(val==""){
				fmName.setItemValue(codeName,"");
				//$("input[name="+codeName+"]").val("");
			}
		}
	});
	
	var commclscdAr = commclscd.split(":");
	
	if(commclscdAr.length>2){
		$("input[name="+name+"]").autocomplete({
		   	source: function( request, response ) {
		   		
		   		var postParam = new Object();
		   		postParam.COMP_CD = vCOMP_CD;
			    postParam.commclscd = commclscd; 	//"DEPO_BNK_CD:FI012:Y";
			    postParam.COMM_CD_NM =  $("input[name="+name+"]").val();	//fmName.getItemValue(name);
			    
		        $.ajax({
		            url: rootPath + "/common/selectDsForCombo.do",
		            data: postParam,
		            async: true,
		            dataType: "json",
		            type: "POST",
		            success: function( data ) {
		                var jsonData = eval("data."+commclscdAr[0]+".options"); 
		                //console.log("jsonData = "+jsonData);
		                response( $.map( jsonData, function( item ) {
		                    if(item.value != ""){
		                    	return{label: "["+item.value+"]"+item.text, value: item.text, data:item.value}
		                    }
		                }));
		            }
		        });
		    }
			,focus: function( event, ui ) {
				//포커스시 처리 코드
		        return false;
		      }
		    ,select: function (event, ui) {
		        //아이템 선택시 처리 코드
		    	fmName.setItemValue(codeName,ui.item.data);
		    	//$("input[name="+codeName+"]").val(ui.item.data);
		    } 
		    ,minLength: num	//자동완성 시작 글자수
		});
	}
}

/**
 * 공통코드 keyIn이벤트 처리
 * @param fmName : 폼네임
 * @param codeName : 코드 값이 들어갈 네임 
 * @param name : 자동 셋팅 될 인풋 네임
 * @param commClsCd : 공통 코드값(FI012)
 * @param num : 코드수 부터 검색
 */
function fn_keyIn(fmName, codeName, name, commClsCd, num) {
	
	var postParam = new Object();
	postParam.COMP_CD = vCOMP_CD;
    postParam.COMM_CLS_CD = commClsCd; 	//"DEPO_BNK_CD:FI012:Y";
    postParam.USE_YN = "Y"; 	
    if ( event.which == 13 ) {
	    if(fmName.getItemValue(codeName).length > num){
	    
		    postParam.COMM_CD =  fmName.getItemValue(codeName); 	//$("input[name="+name+"]").val();	//fmName.getItemValue(name);
		   // console.log("postParam.COMM_CD = "+postParam.COMM_CD);
		    
		    $.ajax({
		        url: rootPath + "/common/selectComboCdRow.do",
		        data: postParam,
		        async: true,
		        dataType: "json",
		        type: "POST",
		        success: function( data ) {
		            //console.log("jsonData = "+data.data.CD);
		            if(typeof data.data.CD != "undefined"){
		            	fmName.setItemValue(name,data.data.NM);
		            }else{
		            	fmName.setItemValue(name,"");
		            }
		        }
		    });
	    }else{
	    	fmName.setItemValue(name,"");
	    }
    }
}

/**
 * 지정주소를 파일로 다운로드
 * (주로 엑셀파일 생성 후 다운로드)
 * @param postParam
 * 필수 actionUrl
 */
function fn_download(postParam) {

	var iframe = document.createElement('iframe');
	iframe.id = "ifr";
	iframe.name = "ifr";
	iframe.width="0";
	iframe.height="0"; 
	document.getElementById("centerWrap").appendChild(iframe);
	
	var form = document.createElement("form"); 
	form.method = "post"; 
	form.action = postParam.actionUrl; 
	form.name = "download";
	form.target = "ifr";

	for(var paramKey in postParam) {
		//console.log("paramKey = "+paramKey);
		//console.log("postParam[paramKey] = "+postParam[paramKey]);
		
		form = fn_addInput(form, "hidden", paramKey, postParam[paramKey]);
    }
	
	document.body.appendChild(form);
    form.submit();
	
}

/**
 * dhtmlx메세지 처리
 * @param text : 내용
 * @param messageType : error로 지정여부
 */
function fn_message(text, messageType) {
	if (typeof messageType == "undefined") messageType = "";
	if (messageType == "error") {
		dhtmlx.message({ 
			type:"error",
			text:text,
			expire: -1
		});
	} else {
		dhtmlx.message({ 
		    text:text
		});
	}
}


/**
 * dhtmlx 알림창 처리
 * @param text
 */
function fn_alertMsg(text){
	dhtmlx.alert({
		title:"알림",
		type:"alert-error",
		text:text,
		ok:"확인"
	});
}


/**
 * dhtmlx 알림창 처리
 * @param text
 */
function fn_messagePopup(text){
    dhtmlx.alert(text);
}

/**
 * layout의 title에 이미지 보여줄때 사용
 * @param imageName
 * @returns {String}
 */
function fn_getTitleImage(imageName) {
	return '<img src="' + rootPath +'/images/dhtmlx/' + imageName + '" style="margin-bottom: -5px;" >';
}


/**
 * 년월 선택하는 달력 이벤트 설정
 * @param fName
 * @param inputName
 */
function fn_setMMCal(form, inputName){
	
	var selectInputName = $("input[name="+inputName+"]");
	if (dhtmlx_skin != "") {
		selectInputName.css("backgroundImage"    ,"url("+rootPath+"/images/dhtmlx/paging/"+dhtmlx_skin+"/calendar.png)");
	}
	selectInputName.css("backgroundPosition" ,"center right");
	selectInputName.css("backgroundRepeat"   ,"no-repeat");
	
	selectInputName.datepicker( {
        defaultDate : new Date( (selectInputName.val()).replace(/\-/g,"").substring(0, 4), Number((selectInputName.val()).replace(/\-/g,"").substring(4, 6))-1, 1 ),
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        showMonthAfterYear: true,
        dateFormat: 'yy-mm',
        onClose: function(dateText, inst) { 
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            selectInputName.datepicker("option", "defaultDate", new Date(year, month, 1));
            selectInputName.datepicker('setDate', new Date(year, month, 1));
            form.setItemValue(name, selectInputName.val());
        }
    });

	form.attachEvent("onInputChange", function (n, value){
		if(inputName.indexOf(n)>-1 ){
			if((value.replace(/\-/g,"")).length==6){
				var vDate = new Date();
				vDate.setFullYear(value.replace(/\-/g,"").substring(0, 4));
				vDate.setMonth(value.replace(/\-/g,"").substring(4, 6));
				vDate.setDate("01");
				
				if( vDate.getFullYear() != value.replace(/\-/g,"").substring(0, 4) || vDate.getMonth()    != value.replace(/\-/g,"").substring(4, 6) ){			   
					return;
				}else{
					$("input[name="+n+"]").datepicker( "option", "defaultDate", new Date(value.replace(/\-/g,"").substring(0, 4), parseInt(value.replace(/\-/g,"").substring(4, 6))-1, 1) );
					$("input[name="+n+"]").datepicker('setDate', new Date(value.replace(/\-/g,"").substring(0, 4), parseInt(value.replace(/\-/g,"").substring(4, 6))-1, 1));
					
					form.setItemValue(n, value.replace(/\-/g,"").substring(0, 4)+"-"+value.replace(/\-/g,"").substring(4, 6));
				}
			}
		}
	});
	
	form.attachEvent("onKeyDown",function(inp, ev, n, value){
		if(inputName.indexOf(n)>-1 ){
			if(ev.which == 13){
				try{
					$("#btnSearch").focus()
				}catch (e) {

				}
			}
		}
	});
}


/**
 * 기간 달력 셋팅
 * @param form : 적용할 폼
 * @param obj
 * 			: calFromName -> from 값을 받을 name
 * 			: calToName -> to 값을 받을 name
 * 			: cboVal -> 선택 값 
 */
function fn_setFromToDt(form, obj){
	switch(obj.cboVal){
		//오늘
		case "01" : 
			form.setItemValue(obj.calFromName, fn_getToday());
			form.setItemValue(obj.calToName  , fn_getToday());
			break;
		//최근 3일			
		case "02" :
			form.setItemValue(obj.calFromName, fn_getDateOfPlusDay(fn_getToday(), -3));
			form.setItemValue(obj.calToName  , fn_getToday());
			break;
		//지난주
		case "03" : 
			for(var i = 0; i<=7; i++){
				if(fn_getDateOfPlusDay(fn_getToday(), -(7+i)).getDay() == 1){
					form.setItemValue(obj.calFromName, fn_getDateOfPlusDay(fn_getToday(), -(7+i)));
					form.setItemValue(obj.calToName  , fn_getDateOfPlusDay(fn_getToday(), -(7+i)+6));
				}
			}		
			break;
		//이번 주	
		case "04" : 
			for(var i = 0; i<=7; i++){
				if(fn_getDateOfPlusDay(fn_getToday(), -i).getDay() == 1){
					form.setItemValue(obj.calFromName, fn_getDateOfPlusDay(fn_getToday(), -i));
					form.setItemValue(obj.calToName  , fn_getDateOfPlusDay(fn_getToday(), -i+6));
				}
			}
			break;
		//이번 주 ~ 오늘	
		case "05" : 
			for(var i = 0; i<=7; i++){
				if(fn_getDateOfPlusDay(fn_getToday(), -i).getDay() == 1){
					form.setItemValue(obj.calFromName, fn_getDateOfPlusDay(fn_getToday(), -i));
					form.setItemValue(obj.calToName  , fn_getToday());
				}
			}
			break;
		//당월
		case "06" : 
			form.setItemValue(obj.calFromName, fn_getFirstDate());
			form.setItemValue(obj.calToName  , fn_getLastDate());
			break;
		
		//당월~오늘
		case "07" : 
			form.setItemValue(obj.calFromName, fn_getFirstDate());
			form.setItemValue(obj.calToName  , fn_getToday());
			break;
		
		//전월
		case "08" : 
			var lastDay = fn_getDateOfPlusDay(fn_getFirstDate(), -1);
			
			form.setItemValue(obj.calFromName, fn_getFormatDate(fn_getStrFromDate(lastDay, "").substring(0, 6), "-")+"-01" );
			form.setItemValue(obj.calToName  , lastDay);		
			break;
		
		default : break;
	}
}

/**
 * 날짜 형식 문자열 변환
 * @param {} date 
 * @returns 
 */
function fn_getDateString(date) {
	var res = "";
	if (date) {
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		res = `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`;
	}
	return res;
}

/**
 * 날짜 시간 형식 문자열 변환
 * @param {*} date 
 * @returns 
 */
function fn_getDateTimeString(date) {
	var res = "";
	if (date) {
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		res = `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`;
		res += " ";
		res += `${hour >= 10 ? hour : '0' + hour}:${min >= 10 ? min : '0' + min}:${sec >= 10 ? sec : '0' + sec}`
	}
	return res;
}

/**
 * 콤보박스의 인덱스를 0으로 변경
 * @param combo
 */
function fn_setComboIndex0(combo) {
	var option = combo.getOptionByIndex(0);
	if(option){
	     var value = option.value;
	     combo.setComboValue(value);
	}
}

/**
 * 콤보박스의 해당하는 값으로 인덱스 이동
 * @param combo
 * @param value : 해당값
 */
function fn_setComboIndexByValue(combo, value) {
	var option = combo.getOption(value);
	if(option){
	     var value = option.value;
	     combo.setComboValue(value);
	}
}


/**
 * 우편번호 조회 팝업 생성
 * @param fmName
 * @param postCode
 * @param address
 * @param detailAddress
 */
function fn_getPostCode(fmName, postCode, address, detailAddress) {
	
	// 팝업 윈도우 생성 및 체크
	if (!fn_dhxWinInIt()) return;
	
	//윈도우 위치 크리 셋팅
	var dw = dhxWins.createWindow("postCodeWin", 68, 66, 520, 565);
	dhxWins.window("postCodeWin").setText("우편번호");
	
	// 레이아웃 셋팅
	var dhxWinsLayout = dw.attachLayout("1C");
	
	//검색 부분 셋팅
	var a = dhxWinsLayout.cells('a');
	a.setText('우편번호검색');
	a.attachHTMLString('<div id="postCodeDiv"></div>');
	
	var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	new daum.Postcode({
	    oncomplete: function(data) {
	    	fmName.setItemValue(postCode, data.zonecode);
	    	fmName.setItemValue(address, data.address);
	    	fmName.setItemFocus(detailAddress);
	    	
	    	dhxWins.unload();
	    }
	}).embed("postCodeDiv");

}

function fn_setBtnEnable(btn, flag) {
	if (flag) {
		btn.attr('class','button-default pure-button');
		btn.attr('disabled', false);
	} else {
		btn.attr('class','pure-button-disabled');
		btn.attr('disabled', true);
	}
}

/**
 * 모바일 기종 체크
 */
function fn_isMobile(){
    var filter = "win16|win32|win64|mac";

    if(navigator.platform){
        if(0 > filter.indexOf(navigator.platform.toLowerCase())){
            return true;
        } else {
            return false;
        }
    }
}

/**
 * calendar컴포넌트의 한국형 기본값 설정
 */
dhtmlXCalendarObject.prototype.langData["ko"] = {
	dateformat: '%Y-%m-%d',
	monthesFNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
	monthesSNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
	daysFNames: ["일요일","월요일","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
	daysSNames: ["일","월","화","수","목","금","토"],
	weekstart: 1,
	weekname: "w"
}

/**
 * Form에 자동완성 기능 제거
 */
function fn_offAutocomplete(form) {
	if (form) {
		form.forEachItem(function(id) {
			if (form.getItemType(id) == "input") {
				form.getInput(id).autocomplete = "off";
			}
		});
	}
}

/**
 * 메뉴코드
 */
function fn_getMenuInfo(menuCd) {
	var menuInfo = {
		level:-1,
		lCode:"",
		mCode:"",
		sCode:""
	}

	if (menuCd.length == 6) {
		menuInfo.lCode = menuCd.substr(0,2);
		menuInfo.mCode = menuCd.substr(2,2);
		menuInfo.sCode = menuCd.substr(4,2);

		if (menuInfo.sCode != "00") {
			menuInfo.level = 2;
		} else if (menuInfo.mCode != "00") {
			menuInfo.level = 1;
		} else {
			menuInfo.level = 0;
		}
	}

	return menuInfo;
}

function validateAdminId(data) {
	var isValid = false;

	if (data && data.length > 0 && data.length <= 20) {
		isValid = /^[A-Za-z0-9]{1,20}$/.test(data);
	}

	return isValid;
}

function validatePhonNumber(data) {
	var isValid = false;

	if (data && data.length > 0 && data.length <= 11) {
		isValid = /^[0-9]{10,11}$/.test(data);
	}

	return isValid;
}

function validateGroupoCode(data) {
	var isValid = false;

	if (data && data.length == 3) {
		isValid = /^[A-Za-z0-9]{3}$/.test(data);
	}

	return isValid;
}

function validateMenuCode(data) {
	var isValid = false;

	if (data && data.length == 6) {
		isValid = /^[0-9]{4}[0]{2}$/.test(data);
	}

	return isValid;
}

function validateIPSubnet(data) {
	var isValid = false;

	if (data && data.length >8 && data.length <= 18) {
		isValid = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(3[0-2]|[12][0-9]|[1-9])$/.test(data);
	}

	return isValid;
}

// grid no 템플릿
function eXcell_no(cell) {
	if (cell){            // the default pattern, just copy it
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.edit = function(){} //read-only cell doesn't have edit method
	// the cell is read-only, so it's always in the disabled state
	this.isDisabled = function(){ return true; } 
	this.setValue=function(val){
		// actual data processing may be placed here, for now we just set value as it is
		var rowId = this.cell.parentNode.idd;
		this.setCValue(this.grid.getRowIndex(rowId) + 1);
	}
}
eXcell_no.prototype = new eXcell;

var pageSize = 15;

// pagination 객체생성
function fn_createPagination(id, currentPage, pageSize, totalcount, visiblePage){
	if(fn_isNull(id)){
		return;
	}

	var $page;
	totalcount = fn_isNull(totalcount)? 0 : totalcount;
	pageSize = fn_isNull(pageSize)? 20 : pageSize;
	var totPage = Math.ceil(totalcount/pageSize) ;

	setTimeout(function(){
		$page = $('#'+id);
		$page.twbsPagination('destroy');
		$page.twbsPagination({
			totalPages: (totPage < 1)? 1 : totPage,	// 총 페이지 번호 수
			visiblePages:  fn_isNull(visiblePage)? 10 : visiblePage,	// 하단에서 한번에 보여지는 페이지 번호 수
			startPage : currentPage, // 시작시 표시되는 현재 페이지
			initiateStartPageClick: false,	// 플러그인이 시작시 페이지 버튼 클릭 여부 (default : true)
			first : "처음",	// 페이지네이션 버튼중 처음으로 돌아가는 버튼에 쓰여 있는 텍스트
			prev : "이전",	// 이전 페이지 버튼에 쓰여있는 텍스트
			next : "다음",	// 다음 페이지 버튼에 쓰여있는 텍스트
			last : "마지막",	// 페이지네이션 버튼중 마지막으로 가는 버튼에 쓰여있는 텍스트

			onPageClick: function (event, page) {
				//console.info(page + ' (from options)');
				fn_search(page - 1);
			}
		}).on('page', function (event, page) {
			//console.info(page + ' (from event listening)');
		});
	}, 100);
}

var excelDownloadCheckTimer;
var excelDownloadCheckAttemps = 60;
function fn_excelDownloadCompleteCheck() {
	excelDownloadCheckAttemps = 60;
	parent.layoutMain.progressOn();
	var expire = new Date();
	expire.setMinutes(expire.getMinutes() + 1);
	CookieUtil.set("excelDownloadCheck", "N", "/", null, null, expire)

	excelDownloadCheckTimer = window.setInterval( function() {
		var checkValue = getCookie("excelDownloadCheck");
		if (checkValue == "Y" || (excelDownloadCheckAttemps < 1)) {
			fn_clearExcelDownloadCompleteCheck();
		}
		excelDownloadCheckAttemps--;
	}, 1000);
}

function fn_clearExcelDownloadCompleteCheck() {
	parent.layoutMain.progressOff();
	window.clearInterval( excelDownloadCheckTimer );
	CookieUtil.unset("excelDownloadCheck","/");
	if (excelDownloadCheckAttemps < 1) {
		alert("Excel Download Timeout");
	}
}