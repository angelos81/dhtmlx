/*
 * dhtmlx공통 처리 함수
 */

/**
 * 페이지 초기화 함수
 * @param bEnterEvent : 조회폼(frmSearch)에 엔터키 입력 시 조회 이벤트 여부(기본값 : true)
 */
function fn_s_init() {
	// console.log("init");
/*  
	// F12 버튼 방지
    $(document).ready(function(){
        $(document).bind('keydown',function(e){
            if ( e.keyCode == 123 ) { // F12 
                e.preventDefault();
				//alert("개발자 모드는 사용이 불가합니다.");
                e.returnValue = false;
            }
        });
    });
    
    // 우측 클릭 방지
    document.onmousedown=disableclick;
    var msg="마우스 오른쪽 클릭은 사용이 불가합니다.";
    
    function disableclick(event){
        if (event.button==2) {
            alert(msg);
            return false;
        }
    }
  */
}

/**
 * 해당 Form에서 서버에 전송하기 위한 데이터를 추출
 * @param form
 * @returns
 */
function fn_getPostParam(form) {
	var postParam = form.getValue();
	return postParam;
}

/**
 * form 내부에 selectBox 데이터 바인딩
 * @param frm : from id
 * @param selectBoxIds : ID 배열
 * @param dsVal : 데이터셋
 */
function fn_s_selectboxPaint(frm, selectBoxIds, dsVal){
	for(i=0 ; i < selectBoxIds.length ; i++){
		frm.getItem(selectBoxIds[i]).config.options = dsVal.options;
		frm.getItem(selectBoxIds[i]).config.disabled = true;
		frm.paint();
		frm.getItem(selectBoxIds[i]).config.disabled = false
		frm.getItem(selectBoxIds[i]).clear();
	}
}

/**
 * Grid 내부에 selectBox 데이터 바인딩
 * @param grd : grid id
 * @param selectBoxId : ID
 * @param dsVal : 데이터셋
 */
function fn_s_selectboxPaintForGrid(grd, selectBoxId, dsVal){
    var dsGridsel = [];                                                
    
    for(var i = 0; i < dsVal.options.length; i++ ){
        dsGridsel[i] =dsVal.options[i].content;   
    } 
    grd.getColumn(selectBoxId).options = dsGridsel;
}

/**
 * grid 데이터 form바인딩 함수
 * @param grid : grid 객체
 * @param frm : form객체
 */
function fn_s_gridToForm(grid, frm){
	var selectedCell = grid.selection.getCell();
	if (selectedCell != undefined){
	
		frm.clear();
		frm.forEach(function(item, index, array) {
		    var itemId = item.config.id;
		    frm.getItem(itemId).setValue(selectedCell.row[itemId]);
	    
		});
	
	}
}

/**
 * 
 * 날짜 포맷 
 * @param date
 * @returns String
 */

function fn_s_setDateFomat(date, type){
    function pad(num) {
        num = num + '';
        // 31 일 오류 (추후 버전 업시 변경 요망) - 20200915
        if(num == 31) num = '00';
           
        return num.length < 2 ? '0' + num : num;
    }

    var returnDate = date.getFullYear() + '-' + pad(date.getMonth()+1) 
    if(type == "D"){
        returnDate += '-' + pad(date.getDate());
    }
    
    return returnDate;
 
}

function fn_s_getComboVal(dsVal, content){
	if(dsVal != undefined){
		for(var idx = 0 ; idx < dsVal.options.length ; idx++ ){
	        if(content == dsVal.options[idx].content){
	            return dsVal.options[idx].value;
	        }
	    }
	}
    
}

function fn_getJsonData(obj, url) {
	$.ajax({
		url: rootPath+url,
		async: true,
		dataType: "json",
		type: "GET",
		success: function( resp ) {
			obj.data.parse(JSON.stringify(resp));
		}
	});
}

// [key , value] 형태를 [{key, value}]형태로 변경해줌
function fn_s_getConvertListToArrayMap(dsVal){
	var resultCode = [];
		if(dsVal != undefined){
		for(var i = 0 ; i < dsVal.length ; i++ ){
			var dsRow= {};
			dsRow[dsVal[i][0]] = dsVal[i][1];
			resultCode.push(dsRow);
		}
	} 
	return resultCode;
}

// [key , value] 형태를 {key, value}형태로 변경해줌
function fn_s_getConvertListToMap(dsVal){
	var resultCode = {};
		if(dsVal != undefined){
		for(var i = 0 ; i < dsVal.length ; i++ ){
			resultCode[dsVal[i][0]] = dsVal[i][1];
		}
	} 
	return resultCode;
}

// [key , value] 형태를 "radioButton","checkbox" 값에 맞게 변경함.
/**
 * 
 * @param {[][]} dsVal 
 * @param {"radioButton","checkbox"} type  
 * @param {"cols","rows"} mode
 * @param {"전체", "선택",""} def
 * @returns {'type' : [{keyNm : valueNm}]}
 */
 function fn_s_getConvertList(dsVal, type, mode, def){
	var resultCode = {};
	var strMode = mode;
	var strType = type;
	var keyNm;
	var valueNm;

	if(mode == "cols" || mode == undefined || mode == ""){
		resultCode = {"cols" : []};
		strMode = "cols";
	} else {
		resultCode = {"rows" : []};
		strMode = "rows";
	}

	if(type == undefined){
		strType = "";
	}
 
	if(strType == "radioButton"){
		keyNm = "value";
		valueNm = "text";
	}else if(strType == "checkbox"){
		keyNm = "id";
		valueNm = "text";
	} else {
		keyNm = "id";
		valueNm = "text";
	}

	if(dsVal != undefined){
		for(var i = 0 ; i < dsVal.length ; i++ ){
			var dsRow= {};
			if(strType != ""){
				dsRow.type = strType;
			}

			if(i == 0){
				if(fn_isNotNull(def)){
					dsRow[keyNm] = "";
					dsRow[valueNm] = def;
					resultCode[strMode].push(dsRow);
					dsRow= {};
				}
			}

			dsRow[keyNm] = dsVal[i][0];
			dsRow[valueNm] = dsVal[i][1];
			//console.log("dsRow i "+ i +" : "+dsRow );
			resultCode[strMode].push(dsRow);
		}
	} 
	return resultCode;
}

// [key , value] 형태를 "combobox"의 형태로 변경함. 
// "def"에 값이 입력되면 맨 첫 row에 설정값이 추가된다.
// "mode"에 값이 "C"라고 입력되면 ['CODE']CODENAME 으로 명칭이 출력된다.
/**
 * 
 * @param {[][]} dsVal 
 * @param {"전체", "선택",""} def 
 * @param {"C", ""} mode 
 * @returns {[{value : code, content : name,}]}
 */
function fn_s_getComboList(dsVal, def, mode){
	var resultCode = [];
	var strDef = def;
	var strMode = mode;
	if(dsVal != undefined){
		for(var i = 0 ; i < dsVal.length ; i++ ){
			var dsRow= {};
			if(i == 0){
				dsRow["selected"] = "true";

				if(fn_isNotNull(strDef)){
					dsRow["value"] = "";
					dsRow["content"] = strDef;
					resultCode.push(dsRow);
					dsRow= {};
				}
			}
			
			if(Array.isArray(dsVal[i])){
				dsRow["value"] = dsVal[i][0];
				if(strMode == "C"){
					dsRow["content"] = "["+dsVal[i][0]+"] "+dsVal[i][1];
				}else{
					dsRow["content"] = dsVal[i][1]+"";
				}
			} else { // key, value로 안되어있으면 강제로 만듬
				dsRow["value"] = dsVal[i];
				if(strMode == "C"){
					dsRow["content"] = "["+dsVal[i]+"] "+dsVal[i];
				}else{
					dsRow["content"] = dsVal[i];
				}
			}
			
			resultCode.push(dsRow);
		}
	} 
	return resultCode;
}

// [key , value] 형태를 "select"의 형태로 변경함. 
// "def"에 값이 입력되면 맨 첫 row에 설정값이 추가된다.
// "mode"에 값이 "C"라고 입력되면 ['CODE']CODENAME 으로 명칭이 출력된다.
/**
 * 
 * @param {[][]} dsVal 
 * @param {"전체", "선택",""} def 
 * @param {"C", ""} mode 
 * @returns {[{value : code, content : name,}]}
 */
 function fn_s_getGridComboList(dsVal, def, mode){
	var resultCode = [];
	var strDef = def;
	var strMode = mode;

	if(dsVal != undefined){
		for(var i = 0 ; i < dsVal.length ; i++ ){
			var dsRow= {};
			if(i == 0){
				dsRow["selected"] = "true";

				if(fn_isNotNull(strDef)){
					dsRow["id"] = "";
					dsRow["value"] = strDef;
					resultCode.push(dsRow);
					dsRow= {};
				}
			}

			dsRow["id"] = dsVal[i][0];
			if(strMode == "C"){
				dsRow["value"] = "["+dsVal[i][0]+"] "+dsVal[i][1];
			}else{
				dsRow["value"] = dsVal[i][1];
			}
			resultCode.push(dsRow);
		}
	} 
	return resultCode;
}

/**
 * 현재 location에 GET 방식의 param을 map형태로 리턴해줌.
 * @returns {[{id : value}]}
 */
function fn_s_getLocationParamToMap() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i){
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

/**
 * 
 * @param {dhtmlx.grid} grid 
 * @param {"파일명"} fileName 
 * @returns 엑셀파일로 해당 그리드의 정보 내보낸다. 
*/
function 	fn_s_exportXlsx(grid,fileName,subTitle, title, downloadReason){
	// console.log("grid : ",grid);
	// console.log("fileName : ",fileName);
	// console.log("subTitle : ",subTitle);
	// console.log("title : ",title);
	// consol.log("downloadReason : ",downloadReason);
	if(fn_isNull(grid)){
		return false;
	}

	if(fn_isNull(fileName)){
		fileName = "gridData";
	}

	if(fn_isNull(title)) {
		title = fileName;
	}

	var excelData = grid.export.xlsx({name:fileName});
	
	excelData["title"] = fn_isNull(title)? "" : title;
	excelData["subTitle"] = fn_isNull(subTitle)? "" : subTitle;
	excelData["downloadReason"] = downloadReason;

	fetch(rootPath+"/common/excelGenerate7.do",{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(excelData),
	})
	.then(response => (response.status == 200)? response.blob() : false)
	// .then(function (response){
	// 	console.log(response);
	// 	return response.blob();
	// })
	.then(function(myBlob) {
		// console.log(myBlob);
		if(myBlob){
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(myBlob);
			link.download = fileName + '_' + fn_s_dayjs().format("YYYY-MM-DD") +'.xlsx';
			link.click();
		} else {
			alert("엑셀다운로드중 통신오류가 발생하였습니다.");
		}
	});
}

function fn_s_exportXlsx2(grid, option){
	var fileName;
	var title;
	var subTitle;

	if(fn_isNull(grid)){
		return false;
	}

	if(fn_isNull(option.fileName)){
		fileName = "gridData";
	} else {
		fileName = option.fileName;
	}

	if(fn_isNull(option.title)) {
		title = fileName;
	} else {
		title = option.title;
	}

	if(fn_isNull(option.subTitle)) {
		subTitle = "";
	} else {
		subTitle = option.subTitle;
	}

	var excelData = grid.export.xlsx({name:fileName});
	
	excelData["title"] = fn_isNull(title)? "" : title;
	excelData["subTitle"] = fn_isNull(subTitle)? "" : subTitle;

	if (fn_isNotNull(option.dataFontSize)) {
		excelData["dataFontSize"] = option.dataFontSize;
	} 

	if (fn_isNotNull(option.dataBold)) {
		excelData["dataBold"] = option.dataBold;
	}

	if (fn_isNotNull(option.dataAlign)) {
		excelData["dataAlign"] = option.dataAlign;
	}

	var dataSpanInfo = fn_getSpanInfo(grid);
	if (fn_isNotNull(dataSpanInfo)) {
		excelData["dataSpanInfo"] = JSON.stringify(dataSpanInfo);
	}

	fetch(rootPath+"/common/excelGenerate7.do",{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(excelData),
	})
	.then(response => (response.status == 200)? response.blob() : false)
	// .then(function (response){
	// 	console.log(response);
	// 	return response.blob();
	// })
	.then(function(myBlob) {
		// console.log(myBlob);
		if(myBlob){
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(myBlob);
			link.download = fileName + '_' + fn_s_dayjs().format("YYYY-MM-DD") +'.xlsx';
			link.click();
		} else {
			alert("엑셀다운로드중 통신오류가 발생하였습니다.");
		}
	});
}

/**
 * 다중 시트 엑셀 다운로드
 * @param fileNameParam 파일명
 * @param password		암호화 비밀번호
 * @param sheetParam 	시트별 데이터
 * @returns 다중 시트 엑셀 다운로드 반환
 */
const fn_s_exportXlsx2_multiSheet = function (fileNameParam, password, sheetParam, downloadReason){
	let fileName;

	if(fn_isNull(fileNameParam)){
		fileName = "untitled";
	} else {
		fileName = fileNameParam;
	}

	//var excelData = grid.export.xlsx({name: fileName});

	let excelData = {name: fileName, password: password, downloadReason: downloadReason};
	let sheetsData = [];

	for (let i = 0; i < sheetParam.length; i++) {
		let title;
		let subTitle;

		let grid = sheetParam[i][0];
		let option = sheetParam[i][1];
		let detailData = grid.export.xlsx();

		if(fn_isNull(grid)){
			return false;
		}

		if(fn_isNull(option.title)) {
			title = "sheet" + (i+1);
		} else {
			title = option.title;
		}

		if(fn_isNull(option.subTitle)) {
			subTitle = "";
		} else {
			subTitle = option.subTitle;
		}

		detailData["title"] = fn_isNull(title)? "" : title;
		detailData["subTitle"] = fn_isNull(subTitle)? "" : subTitle;

		if (fn_isNotNull(option.dataFontSize)) {
			detailData["dataFontSize"] = option.dataFontSize;
		}

		if (fn_isNotNull(option.dataBold)) {
			detailData["dataBold"] = option.dataBold;
		}

		if (fn_isNotNull(option.dataAlign)) {
			detailData["dataAlign"] = option.dataAlign;
		}

		let dataSpanInfo = fn_getSpanInfo(grid);
		if (fn_isNotNull(dataSpanInfo)) {
			detailData["dataSpanInfo"] = JSON.stringify(dataSpanInfo);
		}
		sheetsData.push(detailData);
	}

	excelData.sheetsData = sheetsData;

	fetch(rootPath+"/common/excelGenerateMultiSheet.do",{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(excelData),
	})
		.then(response => (response.status == 200)? response.blob() : false)
		.then(function(myBlob) {
			if(myBlob){
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(myBlob);
				link.download = fileName + '_' + fn_s_dayjs().format("YYYY-MM-DD") +'.xlsx';
				link.click();
			} else {
				alert("엑셀다운로드중 통신오류가 발생하였습니다.");
			}
		});
}

function fn_getSpanInfo(grid) {
	if (fn_isNull(grid.config) || fn_isNull(grid.config.columns) || fn_isNull(grid.config.spans) ) {
		return null;
	}

	var colIdx = [];
	var gridColumns = grid.config.columns;
	gridColumns = gridColumns.filter(x=>x.hidden != true);

	gridColumns.forEach((column, i) => {
		colIdx[column.id] = i;
	});

	var spanInfo = [];
	var spans = grid.config.spans;
	spans.forEach(si => {
		var val = {
			firstRow : grid._getRowIndex(si.row),
			firstCol : colIdx[si.column]
		};

		if (val.firstRow != undefined && val.firstCol != undefined) {
			val.lastRow = val.firstRow + (fn_isNotNull(si.rowspan)?si.rowspan-1:0);
			val.lastCol = val.firstCol + (fn_isNotNull(si.colspan)?si.colspan-1:0);
			spanInfo.push(val);	
		}
	});

	return spanInfo;
}

/**
 * dhtmlx메세지 처리
 * @param text : 내용
 * @param messageType : error로 지정여부
 */
 function fn_s_message(text, messageType) {
	if (typeof messageType == "undefined") messageType = "";
	if (messageType == "error") {
		dhx.message({ 
		    text:text, 
		    icon:"dxi-clock", 
		    css:"dhx_message--error",
			position: "bottom-right", 
		    expire:3000
		});
	} else {
		dhx.message({ 
			text:text, 
		    icon:"dxi-clock", 
		    css:"dhx_message--success",
			position: "bottom-right", 
		    expire:3000
		});
	}
}

/**
 * dhtmlx 알림창 처리
 * @param text
 */
 function fn_s_alertMsg(text){
	var result = dhx.alert({
	    header:"<div style='text-align: center; color:#0288d1'>알림</div>",
	    text:text,
	    buttonsAlignment:"center",
	    buttons:["확인"],
		htmlEnable: true, // disables the HTML content
	});
	return result;
}

/**
 * dhtmlx 확인창 처리
 * @param text
 */
function fn_s_confirmMsg(text) {
    var result = dhx.confirm({
		header: "확인",
		text: text,
		buttons: ["취소", "확인"],
		buttonsAlignment: "center",
		escClose: true,
		htmlEnable: true, // disables the HTML content
		//css: "custom-class",
	});

	return result;
}

/**
 * 
 * @param {String} strDate 
 * @param {'D',""} type 
 * @returns 
 */
function fn_s_strDateFormat(strDate, type){
	function pad(num) {
		num = num + '';
		// 31 일 오류 (추후 버전 업시 변경 요망) - 20200915
		if(num == 31) num = '00';
			
		return num.length < 2 ? '0' + num : num;
	}
	if(fn_isNull(strDate)){
		return "";
	}

	var vDate = strDate.replace("-","");
	var strLength = vDate.length;
	var date;
	if(strLength < 8){
		console.log("형식에 맞지 않습니다. ");
		return false;
	}

	if(strLength == "8"){
		date = new Date(vDate.substring(0,4), vDate.substring(4,6), vDate.substring(6,8));
	} else {
		date = new Date(strDate);
	}

	var returnDate = date.getFullYear() + '-' + pad(date.getMonth()+1) 
    if(type == "D"){
        returnDate += '-' + pad(date.getDate());
    }
    
    return returnDate;

}

/**
 * dayJs null 대응 
 * @param {*} strDate // str 날짜데이터
 * @param {"N"} mode  // "N"이 들어오면 Null처리를 ""로 해주고 나머지는 오늘날짜를 리턴한다.
 * @returns 
 */
function fn_s_dayjs(strDate, mode){
    var result;
    if(fn_isNotNull(strDate)){
        result = dayjs(strDate);
    } else if(mode == "N"){
        result = "";
    } else {
		result = dayjs();
	}
    return result;
}

/**
 * 기간 달력 셋팅
 * @param form : 적용할 폼
 * @param obj
 * 			: calFromName -> from 값을 받을 name
 * 			: calToName -> to 값을 받을 name
 * 			: cboVal -> 선택 값 
 
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
*/

/**
 * dhtmlx메세지 처리
 * @param arrKeyAndValues : 전송파라미터
 * @param strAction : form action
 * @param strTarget : form target
 */
function goWithPostData(arrKeyAndValues, strAction, strTarget) {
	var id = "form" + $("form").length;
	
	var $form = $('<form id="' + id + '" method="post" />');
		$form.attr("action", strAction);
	
	if (strTarget) {
		$form.attr("target", strTarget);
	}
	
	if (Array.isArray(arrKeyAndValues) == false) {
		arrKeyAndValues = [ arrKeyAndValues ];
	}
		
	for (var i = 0; i < arrKeyAndValues.length; i++) {
		var $input = $('<input type="hidden" />');
			$input.attr("name", arrKeyAndValues[i]["KEY"]);
			$input.attr("id", arrKeyAndValues[i]["KEY"]);
			$input.attr("value", arrKeyAndValues[i]["VALUE"]);
		
		$form.append( $input );
	}
	
	$("body").append($form);
	
	$("#" + id).submit();
}

function fn_s_getRandomString() {
	const num = 6;
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < num; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	
	return fn_s_dayjs().format("YYYYMMDDHHmmss")+result;
  }
  
 // img 테그의 onerror 속성에 들어갈 내용 반환 
 function fn_s_getErrorImage(){
	return "this.src='\\\\images\\\\home\\\\sb_logo.jpg'; this.style.opacity='0.5'";
 } 

/**
 * 파일 다운로드 
 * @param {*} downUrl  // 파일 다운로드 URL
 * @param {*} fileName  // 다운로드되는 파일명, 없으면 Real failName
 */
function fn_s_downLoad(downUrl, fileName){
	var sOriginImgUrl = downUrl;
	var sSplitUrl = sOriginImgUrl.split("/");//   "/" 로 전체 url 을 나눈다
	var sUrlLength = sSplitUrl.length;
	var sFullFileName  =sSplitUrl[sUrlLength-1]; // 나누어진 배열의 맨 끝이 파일명이다
	var sSplitFileName = sFullFileName.split(".");  // 파일명을 다시 "." 로 나누면 파일이름과 확장자로 나뉜다
	var sFileName = sSplitFileName[0]; // 파일이름
	var sFileExtension = sSplitFileName[1] // 확장자

	if(fn_isNull(fileName)){
		fileName = sSplitFileName;
	}

	let link = document.createElement("a");

	link.setAttribute("href", downUrl);
	link.setAttribute("download", sFileName);

	document.body.appendChild(link);

	link.click();

	document.body.removeChild(link);
}

/**
 * masking function
 * fn_s_maskingFunc.email("dddd@dddd.co") 이런식으로 사용
 * 이메일, 휴대폰번호, 주민등록번호, 이름 
 */
let fn_s_maskingFunc = {
	checkNull : function (str){
		if(typeof str == "undefined" || str == null || str == ""){
			return true;
		}
		else{
			return false;
		}
	},
	/*
	※ 이메일 마스킹
	ex1) 원본 데이터 : abcdefg12345@naver.com
		 변경 데이터 : ab**********@naver.com
	ex2) 원본 데이터 : abcdefg12345@naver.com
	     변경 데이터 : ab**********@nav******
	*/
	email : function(str){
		let originStr = str;
		let emailStr = originStr.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		let strLength;
		
		if(this.checkNull(originStr) == true || this.checkNull(emailStr) == true){
			return originStr;
		}else{
			strLength = emailStr.toString().split('@')[0].length - 3;
			
			// ex1) abcdefg12345@naver.com => ab**********@naver.com
			// return originStr.toString().replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*');

			// ex2) abcdefg12345@naver.com => ab**********@nav******
			return originStr.toString().replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*').replace(/.{6}$/, "******");
		}
	},
	/* 
	※ 휴대폰 번호 마스킹
	ex1) 원본 데이터 : 01012345678, 변경 데이터 : 010****5678
	ex2) 원본 데이터 : 010-1234-5678, 변경 데이터 : 010-****-5678
	ex3) 원본 데이터 : 0111234567, 변경 데이터 : 011***4567
	ex4) 원본 데이터 : 011-123-4567, 변경 데이터 : 011-***-4567
	*/
	phone : function(str){
		let originStr = str;
		let phoneStr;
		let maskingStr;
		
		if(this.checkNull(originStr) == true){
			return originStr;
		}
		
		if (originStr.toString().split('-').length != 3)
		{ // 1) -가 없는 경우
			phoneStr = originStr.length < 11 ? originStr.match(/\d{10}/gi) : originStr.match(/\d{11}/gi);
			if(this.checkNull(phoneStr) == true){
				return originStr;
			}
			
			if(originStr.length < 11)
			{ // 1.1) 0110000000
				maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{3})(\d{4})/gi,'$1***$3'));
			}
			else
			{ // 1.2) 01000000000
				maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{4})(\d{4})/gi,'$1****$3'));
			}
		}else
		{ // 2) -가 있는 경우
			phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/gi);
			if(this.checkNull(phoneStr) == true){
				return originStr;
			}
			
			if(/-[0-9]{3}-/.test(phoneStr))
			{ // 2.1) 00-000-0000
				maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{3}-/g, "-***-"));
			} else if(/-[0-9]{4}-/.test(phoneStr))
			{ // 2.2) 00-0000-0000
				maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{4}-/g, "-****-"));
			}
		}
		
		return maskingStr;
	},
	/*
	※ 주민등록 번호 마스킹 (Resident Registration Number, RRN Masking)
	ex1) 원본 데이터 : 990101-1234567, 변경 데이터 : 990101-1******
	ex2) 원본 데이터 : 9901011234567, 변경 데이터 : 9901011******
	*/
	rrn : function(str){
		let originStr = str;
		let rrnStr;
		let maskingStr;
		let strLength;
		
		if(this.checkNull(originStr) == true){
			return originStr;
		}
		
		rrnStr = originStr.match(/(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4]{1}[0-9]{6}\b/gi);
		if(this.checkNull(rrnStr) == false){
			strLength = rrnStr.toString().split('-').length;
			maskingStr = originStr.toString().replace(rrnStr,rrnStr.toString().replace(/(-?)([1-4]{1})([0-9]{6})\b/gi,"$1$2******"));
		}else {
			rrnStr = originStr.match(/\d{13}/gi);
			if(this.checkNull(rrnStr) == false){
				strLength = rrnStr.toString().split('-').length;
				maskingStr = originStr.toString().replace(rrnStr,rrnStr.toString().replace(/([0-9]{6})$/gi,"******"));
			}else{
				return originStr;
			}
		}
		return maskingStr;
	},
	/*
	※ 이름 마스킹
	ex1) 원본 데이터 : 갓댐희, 변경 데이터 : 갓댐*
	ex2) 원본 데이터 : 하늘에수, 변경 데이터 : 하늘**
	ex3) 원본 데이터 : 갓댐, 변경 데이터 : 갓*
	*/
	name : function(str){
		let originStr = str;
		let maskingStr;
		let strLength;
		
		if(this.checkNull(originStr) == true){
			return originStr;
		}
		
		strLength = originStr.length;
		
		if(strLength < 3){
			maskingStr = originStr.replace(/(?<=.{1})./gi, "*");
		}else {
			maskingStr = originStr.replace(/(?<=.{2})./gi, "*");
		}
		
		return maskingStr;
	}
}

/**
 * 그리드 내 같은 값 끼리 rowSpan 처리
 * @param {*} grid 
 * @param {*} columnName : 기준 컬럼 이름
 * @param {*} subColumnName : 같이 병합할 컬럼 이름들 (배열)
 */
function fn_rowspanUpdate(grid, columnName, subColumnName) {
	var rowSpanData = [];
	var rowId = "";
	var dateInfo = "";
	var rowSpanCnt = 0;
	grid.data.forEach(row => {
		if (row[columnName] != dateInfo) {
			if (rowSpanCnt > 1) {
				rowSpanData.push({
					row:rowId,
					column:columnName,
					rowspan: rowSpanCnt
				});
				if (subColumnName) {
					subColumnName.forEach(subColumn => {
						rowSpanData.push({
							row:rowId,
							column:subColumn,
							rowspan: rowSpanCnt
						});	
					})
				}
			}
			dateInfo = row[columnName];
			rowSpanCnt = 1;
			rowId = row.id;
		} else {
			rowSpanCnt++;
		}
	});
	if (rowSpanCnt > 1) {
		rowSpanData.push({
			row:rowId,
			column:columnName,
			rowspan: rowSpanCnt
		});
		if (subColumnName) {
			subColumnName.forEach(subColumn => {
				rowSpanData.push({
					row:rowId,
					column:subColumn,
					rowspan: rowSpanCnt
				});	
			})
		}
	}

	rowSpanData.forEach(rowSpanInfo => {
		grid.addSpan(rowSpanInfo);
	});
}

// SR RootPath 설정하기
function fn_srRootPath() {
	var spRootPath = window.location.href;
	var srRootPath = "";
	if (spRootPath.indexOf("admin.stg-sp") > -1) { // stg
		srRootPath = "https://stg-msradm.istarbucks.co.kr:8080";
	} else if (spRootPath.indexOf("admin.sp") > -1) { // 운영
		srRootPath = "https://msradmin.istarbucks.co.kr:8080";
	} else { // dev, 로컬
		srRootPath = "https://dev-msradm.istarbucks.co.kr:8080";
	}
	return srRootPath;
}

// 팝업 띄우기
function fn_openPopup(popupUrl, popupWidth, popupHeight, popClose) {
	var popupX = (window.screen.width / 2) - (popupWidth / 2);
	var popupY = (window.screen.height / 2) - (popupHeight / 2);
	var wop = fn_openNewWindow(popupUrl, popupUrl, "height=" + popupHeight  + ", width=" + popupWidth  + ", left="+ popupX + ", top="+ popupY +",location=no, toolbar=no, menubar=no, scrollbars=yes, resizable=no, fullscreen=yes" );

	wop.onload = function() {
		var popLayoutMain = $(wop.document).find("[id='layoutMain']");
		wop.focus();
	};

	if(popClose) {
		window.onunload = function() {
			wop.close();
		}
	}
}

// customerId로 userNumber조회하기
function fn_getUserNumber(customerId) {
	var userNumber;

	fn_ajax({
		url: "/member/rest/userNumber"
		, param: { customerId }
		, type: "GET"
		, async: false
		, success: function(responseData) {
			userNumber = responseData.userNumber;
		}
	});
	return userNumber;
}

// cardRegNumber로 cardNumber 조회
function fn_getCardNumber(customerId, cardRegNumber) {
	var cardNumber;

	fn_ajax({
		url: `/card/rest/number/${cardRegNumber}`
		, param: { customerId }
		, type: "GET"
		, async: false
		, success: function(responseData) {
			cardNumber = responseData.cardNumber;
		}
	});
	return cardNumber;
}

/***
 * id : pagination id
 * currPage : 현재페이지
 * perPage : 1페이지 보여지는 데이터 수
 * totalCount : 총 데이터 건수
 * visiblePage : 한번에 보여지는 페이지 번호 수
 */
function fn_createPagination(id, currPage, perPage, totalCount, visiblePage){

	if(fn_isNull(id)) {
		console.log("fn_createPagination error : pagination의 Id를 입력해주세요.");
		return;
	}

	let $page;
	totalCount = fn_isNull(totalCount)? 0 : totalCount;
	perPage = fn_isNull(perPage)? 20 : perPage;
	visiblePage = fn_isNull(visiblePage)? 10 : visiblePage;
	let totPage = Math.ceil(totalCount/perPage) ;

	setTimeout(function(){
		$page = $('#'+id);
		$page.twbsPagination('destroy');
		$page.twbsPagination({
			totalPages: (totPage < 1)? 1 : totPage,	// 총 페이지 번호 수
			visiblePages: visiblePage,	// 하단에서 한번에 보여지는 페이지 번호 수
			startPage: currPage, // 시작시 표시되는 현재 페이지
			initiateStartPageClick: false,	// 플러그인이 시작시 페이지 버튼 클릭 여부 (default : true)
			first: "처음",	// 페이지네이션 버튼중 처음으로 돌아가는 버튼에 쓰여 있는 텍스트
			prev: "이전",	// 이전 페이지 버튼에 쓰여있는 텍스트
			next: "다음",	// 다음 페이지 버튼에 쓰여있는 텍스트
			last: "마지막",	// 페이지네이션 버튼중 마지막으로 가는 버튼에 쓰여있는 텍스트

			onPageClick: function (event, page) {
				// console.log("page event : ",event);
				fn_search(page);
			}
		}).on('page', function (event, page) {
			// console.log(page);
		});
	}, 100);

}