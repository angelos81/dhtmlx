/*
 * 팝업처리
 */

var dhxWins;

/**
 * 팝업을 생성하는 내부용 함수
 * @returns {Boolean}
 */
function fn_dhxWinInIt() {
	//윈도우 수 제한
	var p = 0;
	try{
		dhxWins.forEachWindow(function(){p++;});
		if (p>0) {
			//이벤트 없음 그냥 한개만 떠있게 요구상항 있을 경우 수정
			//alert("Too many windows");
			return false;
		}
	}catch (e) {
		//윈도우 셋팅
		dhxWins = new dhtmlXWindows();
		dhxWins.attachViewportTo("layoutObj");
	}
	return true;
}


/* 
*  URL기반으로 팝업을 생성
*  popObject : 팝업정보
*       필수요소  
*  		이름 : POP_NM
*  		주소 : URL
*  		가로 : POP_SIZE_X
*  		세로 : POP_SIZE_Y
*/
function fn_dhxWinUrlCreate(popObject){

	// 팝업 윈도우 생성 및 체크
	if (!fn_dhxWinInIt()) return;
	
	//윈도우 위치 셋팅
	var dw = dhxWins.createWindow("dhxWin", 68, 66, popObject.POP_SIZE_X, popObject.POP_SIZE_Y);
	dhxWins.window("dhxWin").setText(popObject.POP_NM);
	
	var returnObj = dw.attachURL(popObject.URL);
	console.log("returnObj = " + returnObj);
}


/* 공통코드를 이용한 팝업 윈도우 생성
*  	fmName : 폼네임
*  	codeName : 코드 값이 들어갈 히든 네임 
*  	name : 코드명이 셋팅 될 인풋 네임
*  	grpCd : 공통 코드값(FI012)
*  	func : 함수명 (fn_test())
*  	paramObj : commCd 코드명 , commNm 코드 네임순으로 (ex code:SE001, name:명)
*/

/**
 * 공통코드를 조회하기 위한 팝업 윈도우 생성
 * @param reqObject : Form
 * @param resCd     : 코드 값이 들어갈 Input 네임 
 * @param resNm     : 코드 명이 들어갈 Input 네임 
 * @param grpCd     : 공통 코드값(FI012)
 * 
 * @param searchKeyword  : 검색어 
 * @param func      : 콜백 함수명 (fn_test())
 */
function fn_openCodePopup(reqObject, resCd, resNm, grpCd, searchKeyword, func ) {
	
	var postParam = new Object();

	// 팝업 윈도우 생성 및 체크
	if (!fn_dhxWinInIt()) return;
	
	//윈도우 위치 셋팅
	var dw = dhxWins.createWindow("codeWin", 68, 66, 700, 500);
	dhxWins.window("codeWin").setText("공통코드");

	// 레이아웃 셋팅
	var dhxWinsLayout = dw.attachLayout("2E");
	
	//검색 부분 셋팅
	var a = dhxWinsLayout.cells('a');
	a.setText('검색조건');
	a.setHeight('92');
	var str =  [ { type:'settings', position:'label-left', labelWidth:'120', inputWidth:'100', offsetLeft:'20', offsetTop:'14' },
	             { type:"input" , name:"COMM_CD_NM", label:"코드/명" , value:searchKeyword},
	             { type:"newcolumn"   },
	             { type: "combo", label: "사용구분", name: "USE_YN"},
	             { type:"newcolumn"   },
	             { type: "button", value: "검색", name: "dhxWinsSearch" , offsetTop:'8'} 
	          ];
	var dhxWinsSearchForm = a.attachForm(str);
  
	//검색 버튼 클릭시 
	dhxWinsSearchForm.attachEvent("onButtonClick", function(name){
		//검색
		if(name=="dhxWinsSearch"){
			dhxWinsLayout.progressOn();
			postParam = fn_getPostParam(dhxWinsSearchForm);
			postParam.GRP_CD = grpCd;
			fn_ajaxGetGrid({ gridName            : dhxWinsGrd
				, url                 : "/dhtmlx/admin/code/selectCodeList.do"
  	            , postParam           : postParam
  	            , success             : function() { dhxWinsLayout.progressOff(); 	}
				, fail             	  : function() { dhxWinsLayout.progressOff();   }
			});
		}
	});
  
	//검색 input 엔터키 이벤트
	dhxWinsSearchForm.attachEvent('onKeyDown', function(inp, event, name){
		if ( event.which == 13 ) {
			//요걸 함수로 ?
			dhxWinsLayout.progressOn();
			postParam = fn_getPostParam(dhxWinsSearchForm);
			postParam.GRP_CD = grpCd;
			fn_ajaxGetGrid({ gridName            : dhxWinsGrd
				, url                 : "/dhtmlx/admin/code/selectCodeList.do"
  	            , postParam           : postParam
  	            , success             : function() { dhxWinsLayout.progressOff(); }
				, fail             	  : function() { dhxWinsLayout.progressOff(); }
			});
		} 
	});
  
	//그리드 셋팅
	var b = dhxWinsLayout.cells('b');
	b.setText('코드');
	var dhxWinsGrd = b.attachGrid();
	dhxWinsGrd.setHeader(["NO","코드","코드명","사용여부"]);
	dhxWinsGrd.setColumnIds("NO,COMM_CD,COMM_CD_NM,USE_YN");
	dhxWinsGrd.setColTypes("ro,ro,ro,ro,ro,ro,ro");
	dhxWinsGrd.setInitWidths('40,*,*,*');
  
	fn_initGrid(dhxWinsGrd);
	
	//그리트 더블 클릭시 이벤트 -> 값을 리턴받고자 하는곳에 보냄
	dhxWinsGrd.attachEvent("onRowDblClicked",function(id,ind) {
		/* 그리드에서 호출하는 경우의 처리하는 부분 제외
		// 리턴 대상이 그리드일 때는 dp처리도 필요함
		if (window.dhtmlXGridObject != null && fmName instanceof window.dhtmlXGridObject) {
			try{
				var codeNameArray = name.split(",");
				for(var i=0;i<codeNameArray.length;i++){
	        		var setCellValArray = codeNameArray[i].split(":");
	        			//fmName.selectCell(codeName, setCellValArray[1]);
		        		//fmName.editCell();
	        			dpName.setUpdated(codeName,"updated");
						fmName.cells(codeName, setCellValArray[1]).setValue(setCellValArray[0]=="name"?dhxWinsGrd.cells(id,2).getValue():dhxWinsGrd.cells(id,1).getValue());
						//fmName.editStop();	
				}
			}catch (e) {
				console.log("e = "+e);
			}
		// 리턴 대상이 폼일때는 지정된곳에 값만 리턴하고 끝
		}else{
		*/
		//폼
		reqObject.setItemValue(resCd, dhxWinsGrd.cells(id,1).getValue());
		reqObject.setItemValue(resNm, dhxWinsGrd.cells(id,2).getValue());
		//}
	  	
		eval(func);
  		dhxWins.unload();
  		
	});
  
	//윈도우 오픈시 그리드 표시 
	dhxWinsLayout.progressOn();
	//postParam = fn_getPostParam(dhxWinsSearchForm);
	postParam.GRP_CD     = grpCd;
	postParam.COMM_CD_NM = searchKeyword;
	fn_ajaxGetGrid({ gridName            : dhxWinsGrd
			, url                 : "/dhtmlx/admin/code/selectCodeList.do"
			, postParam           : postParam
	        , success             : function() { dhxWinsLayout.progressOff(); }
			, fail             	  : function() { dhxWinsLayout.progressOff(); }
	});
}

// swaf-batch에서 사용하는 window.open 팝업 추가 [2020.08.11 add by 174309]
/**
 * 각 업무단 개별화면을 URL팝업으로 뛰울때
 * @param popupUrl
 * 
 *  
    오픈 예)
	var popupUrl = "/admin/batch/batchExeAdmin.do?param=test";        	
	var width    = '1500';
	var heigth   = '700';
	var popupNm   = 'testPop';            
	fn_winPopup(popupUrl,width,heigth,popupNm);
 * 
 */
function fn_winPopup(option)
{
    var wop;
    
    if (option.popupUrl != '') {
    	var top = (screen.height - option.height) / 2; 
    	var left = (screen.width - option.width) / 2;
    	
        wop = window.open(option.popupUrl, option.popupNm, "location=no, toolbar=no, menubar=no, scrollbars=yes, resizable=yes, fullscreen=no, height=" + option.height + "," + "width=" + option.width +" ,top="+top+" ,left="+left);

        
        wop.onload = function() { 

            var popLayoutMain = $(wop.document).find("[id='layoutMain']");
            
            wop.focus();
        };
    }
}
