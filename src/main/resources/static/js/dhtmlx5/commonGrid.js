/*
 * dhtmlx의 grid관련 처리
 */

/**
 * grid 열 타입
 */

/**
 * grid를 초기화 한다.
 * @param grid
 */
function fn_initGrid(grid) {
	grid.init();
	
	var sColumnId   = "";
	var sColumnType = "";

	var sAlign = "";
	var tAlign = "";
	var cellAlign = grid.cellAlign; // 기존 align정보 가져옴

	var sSort = "";
	var tSort = "";
	var fldSort   = grid.fldSort;   // 기존 sort 정보 가져옴
	
	// 컬럼 특성 처리
	for(var iCol=0; iCol < grid.getColumnsNum(); iCol++){

		sColumnId   = grid.getColumnId(iCol);
		sColumnType = grid.getColType(iCol);

		// 숫자 처리
	    if(sColumnType == "edn" || sColumnType == "ron" ) {
		    grid.setNumberFormat("0,000", iCol);
	    }

	    // align처리
		switch (sColumnType) {
			case "edn" :
			case "ron" :
				tAlign = "right";
				break;
			case "ed" :
			case "ro" :
				tAlign = "center";
				break;
			default:
				tAlign = cellAlign[iCol];
				break;
		}
		
		sAlign = (iCol==0) ? tAlign : sAlign+","+tAlign;

	    // sort 처리
	    if (grid.sortDisable) {
	    	tSort = "na";
	    } else {
			switch (sColumnType) {
				case "edn" :
				case "ron" :
					tSort = "int";
					break;
				case "ed" :
				case "ro" :
					tSort = "str"
					break;
				default:
					tSort = fldSort[iCol];
					break;
			}

	    }
	    sSort  = (iCol==0) ? tSort  : sSort+","+tSort;
	}
	
	grid.setColAlign(sAlign);
	grid.setColSorting(sSort);
	grid.enableHeaderMenu();
	/*
	var gridContextMenu = new dhtmlXMenuObject();
	gridContextMenu.renderAsContextMenu();
	grid.enableContextMenu(gridContextMenu);
	gridContextMenu.loadStruct(rootPath + "/dhtmlx/data/gridContextMenu.xml?1");
	*/
}


/**
 * Grid에서 현재 지정된 Row삭제처리
 * @param dp
 * @param grid
 * @returns {Boolean}
 */
function fn_deleteRow(dp, grid) {
	var rowId = grid.getSelectedRowId().split(",");
	for(var i=0;i<rowId.length;i++){
	    if (dp.getState(rowId[i]) == 'deleted' ) {
	    	dp.setUpdated(rowId[i], false);
	    } else if (dp.getState(rowId[i]) == 'updated' ) {
	    	fn_alertMsg('수정중인 데이터는 삭제할 수 없습니다.');
	    	return false;
	    } else {
	    	grid.deleteRow(rowId[i]);	
	    }
	}
}


/**
 * 조회 조건으로 쓰기 위해 Grid에서 선택된 row의 값들을 가져옴..
 * @param grid
 * @returns {___anonymous5116_5117}
 */
function fn_getSearchParamFromGrid(grid) {
	var paramObj  = {};
	var iCols     = grid.getColumnsNum();
	var iRowId    = grid.getSelectedRowId();
	
	var sColId;
	var iColIndex;
	var sColValue;
	for(var iCol=0; iCol<iCols; iCol++) {
		
		sColId = grid.getColumnId(iCol);
		iColIndex = grid.getColIndexById(sColId);
		sColValue = grid.cells(iRowId, iColIndex).getValue();
     
		//console.log("@@@ fn_getSearchParamFromGrid : " + sColId + " = " + sColValue);
		paramObj[sColId] = sColValue;
	}
	
	return paramObj;
}

/**
 * Grid에서 변경된 데이터만 가져옴
 * @param grid
 * @param dp1
 * @returns {Array}
 */
function fn_getPostParamFromGrid(grid, dp1) {
	grid.editStop();

	var paramArray = new Array();
	var paramObj;
	var iParamArrayCount = 0;
	
	var iRows  = grid.getRowsNum();
	var iCols  = grid.getColumnsNum();

	var iRowIndex;
	var iRowId;

	var sColId;
	var sColValue;

	var iColIndex;

	var sState = "";

	var iRow;
	var iCol;
	//console.log("s====fn_getPostParamFromGrid=====================================");
	for(iRow = 1; iRow<=iRows; iRow++) {

		iRowIndex = iRow-1;
		iRowId    = grid.getRowId(iRowIndex);
		sState    = dp1.getState(iRowId);

		if (sState != "") { // 상태값이 변한 경우만 사용
			paramObj = {};
			for (iCol = 0; iCol < iCols; iCol++) {
				console.log("----------------------------------");

				sColId = grid.getColumnId(iCol);
				// console.log("sColId = " + sColId);

				iColIndex = grid.getColIndexById(sColId);
				// console.log("iColIndex = " + iColIndex);

				// 달력 '-' 구분자 빼기
				if (grid.getColType(iColIndex) == "dhxCalendar") {
					sColValue = grid.cells(iRowId, iColIndex).getValue().replace(/\-/g, "");

				// 2015.05.29 숫자형 값에 null값이 들어가면 0으로 변경함
				} else if (grid.getColType(iColIndex) == "ron" || grid.getColType(iColIndex) == "edn") {
					sColValue = grid.cells(iRowId, iColIndex).getValue();
					if (fn_isNull(sColValue)) sColValue = 0;

				} else {
					sColValue = grid.cells(iRowId, iColIndex).getValue();
				}

				console.log(sColId + " = " + sColValue);

				paramObj[sColId] = sColValue;

			}
			paramObj["!nativeeditor_status"] = sState; // 상태값 저장.(inserted,updated ,deleted)
			paramArray[iParamArrayCount] = paramObj;
			iParamArrayCount++;
		}
		// console.log("e=========================================");
	}
	
	return paramArray;
}


/**
 * Grid에서 변경된 데이터만 가져온 후 Form의 값들을 추가함
 *  - 저장할때 특정폼의 정보를 추가하고 싶다. 
 *  - 동일변수명이 있으면 Form의 값으로 엎는다.
 * @param grid
 * @param dp1
 * @param form
 * @returns {Array}
 */
function fn_getPostParamFromGridAndForm(grid, dp1, form) {
	
	var paramArray = fn_getPostParamFromGrid(grid, dp1);
	var paramObj;
	for(var i=0;i<paramArray.length;i++) {
		paramObj = paramArray[i];
		
		form.forEachItem(function(name) {

			if (form.getItemType(name) == "calendar") {
				paramObj[name] = form.getCalendar(name).getFormatedDate("%Y%m%d");
				//console.log(name + ", " + form.getCalendar(name).getFormatedDate("%Y%m%d"));
			} else if (form.getItemType(name) != "label") {
				paramObj[name] = form.getItemValue(name);
				console.log(name + ", " + form.getItemValue(name));
			}
		});
		paramArray[i] = paramObj;
	}
	return paramArray;
}

/**
 * Grid의 체크컬럼(0번)의 값이 1인(체크됨)인 경의 row data를 추출들(데이터를 CHK된거만 가져옴)
 * @param grid
 * @returns {Array}
 */
function fn_getPostParamFromGridChk(grid) {
	var paramArray = new Array();
	var paramObj;
	var iParamArrayCount = 0;
	
	var iRows  = grid.getRowsNum();
	var iCols  = grid.getColumnsNum();

	var iRowIndex;
	var iRowId;

	var sColId;
	var sColValue;

	var iColIndex;

	var sChk = "";
 
	var iRow;
	var iCol;
	for(iRow = 1; iRow<=iRows; iRow++) {

		iRowIndex = iRow-1;
		iRowId    = grid.getRowId(iRowIndex);
		
		sChk      = grid.cells(iRowId, 0).getValue();
		
		/*
		console.log("s====fn_getPostParamFromGridChk=====================================");
		console.log("iRow      = " + iRow);
		console.log("iRowIndex = " + iRowIndex);
		console.log("iRowId    = " + iRowId);
		console.log("sChk      = " + sChk);
		*/
		if (sChk == "1") { // chk값이 1일때만 모은다.
			paramObj = {};
			for (iCol = 0; iCol < iCols; iCol++) {
				// console.log("----------------------------------");

				sColId = grid.getColumnId(iCol);
				// console.log("sColId = " + sColId);

				iColIndex = grid.getColIndexById(sColId);
				// console.log("iColIndex = " + iColIndex);

				// 달력 '-' 구분자 빼기
				if (grid.getColType(iColIndex) == "dhxCalendar") {
					sColValue = grid.cells(iRowId, iColIndex).getValue().replace(/\-/g, "");

					// 2015.05.29 숫자형 값에 null값이 들어가면 0으로 변경함
				} else if (grid.getColType(iColIndex) == "ron" || grid.getColType(iColIndex) == "edn") {
					sColValue = grid.cells(iRowId, iColIndex).getValue();
					if (fn_isNull(sColValue)) sColValue = 0;

				} else {
					sColValue = grid.cells(iRowId, iColIndex).getValue();
				}

				// console.log("sColValue = " + sColValue);

				paramObj[sColId] = sColValue;
			}
			paramArray[iParamArrayCount] = paramObj;
			iParamArrayCount++;
		}
/*
 * console.log("e====fn_getPostParamFromGridChk=====================================");
 * console.log(" "); console.log(" ");
 */
	}
	
	return paramArray;
}

/**
 * Grid의 모든 데이터를 배열로 추출
 * @param grid
 * @param dp1
 * @returns {Array}
 */
function fn_getPostParamFromGridAll(grid, dp1) {
	var paramArray = new Array();
	var paramObj;
	
	var iRows  = grid.getRowsNum();
	var iCols  = grid.getColumnsNum();

	var iRowIndex;
	var iRowId;

	var sColId;
	var sColValue;

	var iColIndex;

	var sState = "";

	var iRow;
	var iCol;
	//console.log("s========fn_getPostParamFromGridAll=================================");

	for(iRow = 1; iRow<=iRows; iRow++) {

		iRowIndex = iRow - 1;
		iRowId = grid.getRowId(iRowIndex);
		if (typeof dp1 != "undefined")
			sState = dp1.getState(iRowId);

		/*
		 * console.log("iRow = " + iRow); console.log("iRowIndex = " +
		 * iRowIndex); console.log("iRowId = " + iRowId); console.log("sState = " +
		 * sState);
		 */
		paramObj = {};
		for (iCol = 0; iCol < iCols; iCol++) {
			//console.log("----------------------------------");

			sColId = grid.getColumnId(iCol);
			iColIndex = grid.getColIndexById(sColId);
			// sColValue = grid.cells(iRowId, iColIndex).getValue();
			// 달력 '-' 구분자 빼기
			if (grid.getColType(iColIndex) == "dhxCalendar") {
				sColValue = grid.cells(iRowId, iColIndex).getValue().replace(/\-/g, "");

				// 2015.05.29 숫자형 값에 null값이 들어가면 0으로 변경함
			} else if (grid.getColType(iColIndex) == "ron" || grid.getColType(iColIndex) == "edn") {
				sColValue = grid.cells(iRowId, iColIndex).getValue();
				if (fn_isNull(sColValue)) sColValue = 0;

			} else {
				sColValue = grid.cells(iRowId, iColIndex).getValue();
			}

			// console.log("sColId / sColValue = " + sColId + "/"+ sColValue);

			paramObj[sColId] = sColValue;
		}
		if (typeof dp1 != "undefined") paramObj["!nativeeditor_status"] = sState; // 상태값 저장.(inserted
														// ,updated ,deleted)
		paramArray[iRow - 1] = paramObj;
	}
	//console.log("e========fn_getPostParamFromGridAll=================================");
	
	return paramArray;
}

/**
 * Grid의 모든 데이터를 배열로 추출하는데 삭제건은 제외함
 * 	- 엑셀데이터 tmp테이블에 저장시
 * @param grid
 * @param dp1
 * @returns {Array}
 */
function fn_getPostParamFromGridUse(grid, dp1) {

	grid.editStop();

	var paramArray = new Array();
	var paramObj;
	var iParamArrayCount = 0;
	
	var iRows  = grid.getRowsNum();
	var iCols  = grid.getColumnsNum();

	var iRowIndex;
	var iRowId;

	var sColId;
	var sColValue;

	var iColIndex;

	var sState = "";

	var iRow;
	var iCol;
	for(iRow = 1; iRow<=iRows; iRow++) {

		iRowIndex = iRow - 1;
		iRowId = grid.getRowId(iRowIndex);
		sState = dp1.getState(iRowId);
		/*
		console.log("s====fn_getPostParamFromGridUse=====================================");
		console.log("iRow      = " + iRow);
		console.log("iRowIndex = " + iRowIndex);
		console.log("iRowId    = " + iRowId);
		console.log("sState    = " + sState);
		*/
		if (sState != "deleted") { // 상태값이 deleted가 아닌항목들만
			paramObj = {};
			for (iCol = 0; iCol < iCols; iCol++) {
				console.log("----------------------------------");

				sColId = grid.getColumnId(iCol);
				console.log("sColId    = " + sColId);

				iColIndex = grid.getColIndexById(sColId);
				// console.log("iColIndex = " + iColIndex);

				// 달력 '-' 구분자 빼기
				if (grid.getColType(iColIndex) == "dhxCalendar") {
					sColValue = grid.cells(iRowId, iColIndex).getValue().replace(/\-/g, "");

					// 2015.05.29 숫자형 값에 null값이 들어가면 0으로 변경함
				} else if (grid.getColType(iColIndex) == "ron" || grid.getColType(iColIndex) == "edn") {
					sColValue = grid.cells(iRowId, iColIndex).getValue();
					if (fn_isNull(sColValue)) sColValue = 0;

				} else {
					sColValue = grid.cells(iRowId, iColIndex).getValue();
				}

				console.log("sColValue = " + sColValue);

				paramObj[sColId] = sColValue;
			}
			paramObj["!nativeeditor_status"] = sState; // 상태값 저장.(inserted
														// ,updated ,deleted)
			paramArray[iParamArrayCount] = paramObj;
			iParamArrayCount++;
		}
		/*
		console.log("e=========================================");
		console.log(" ");
		console.log(" ");
		*/
	}
	
	return paramArray;
}


/**
 * row 색상변경하기
 *  grd : 그리드네임
 *  colId : 비교해야할 컬럼 명
 *  target : 비교하는 값(level1,level2,level3,level4)
 *  color : 색상 
 * @param grd
 * @param colId
 */
function fn_setRowColor(grd, colId) {
	try{
		var level = Array("level1","level2","level3","level4");
		//var level = Array("CMMA0030","CMMA0060","CMSA0130","CMSY0030");
		var color_skyblue = Array("#faf9d0","#e0fb8c","#6bacda","#9985f1");
		var color_web = Array("#febd8d","#ff7d7d","#c94df1","#604db2");
		
		var colIndex = grd.getColIndexById(colId);
		if(typeof colIndex != "undefined"){
			grd.forEachRow(function(id){
				for(var i = 0; i<level.length; i++){
		 			if(grd.cells(id, colIndex).getValue() == level[i]){
		 				if(dhtmlx_skin == "dhx_skyblue"){
		 					grd.setRowColor(id, color_skyblue[i]);
		 				}else{
		 					grd.setRowColor(id, color_web[i]);
		 				}
		 				
		 			}
				}
	 		});
		}
	}catch (e) {
		console.log("e = "+e);
	} 
}
/**
 * 지정위치의 컬럼의 checkbox 값을 반대로 변경
 *   - 체크박스 처리(체크해제:0 ,체크:1)
 * @param grid
 * @param bCheck
 * @param iColIndex : 지정위치
 */
function fn_setGridChk(grid, rId, iColIndex) {
    if(grid.cells(rId, iColIndex).getValue() == "0") {
    	grid.cells(rId, iColIndex).setValue("1");
    }else{
    	grid.cells(rId, iColIndex).setValue("0");
    }
}

/**
 * 그리드 전체에서 지정위치의 컬럼이 enable 상태일때 값을 변경
 *   - 체크박스 처리 용(체크해제:0 ,체크:1)
 * @param grid
 * @param bCheck
 * @param iColIndex : 지정위치
 */
function fn_setGridChkEnableAll(grid, bCheck, iColIndex) {
	var iRows  = grid.getRowsNum();
	var iValue;
	
    if(bCheck) {
        iValue = "1";
    }else{
        iValue = "0";
    }
    for(var iRow = 1; iRow<=iRows; iRow++) {
    	var iRowIndex = iRow-1;
        var iRowId    = grid.getRowId(iRowIndex);
        //현재 cell이 enable상태인지 판단
        if(!grid.cells(iRowId, iColIndex).isDisabled()){
        	grid.cells(iRowId, iColIndex).setValue(iValue);
        }
    }
}

/**
 * grid의 체크박스(0번 column(CHK))를 입력값으로 일괄처리
 * @param grid
 * @param bCheck
 */
function fn_setGridChkAll(grid, bCheck) {
	fn_setGridChkEnableAll(grid, bCheck, 0);
}

/**
 * Grid의 현재 Row의 지정컬럼명 값을 가져옴 
 * @param grid
 * @param colName
 * @returns {String}
 */
function fn_getGridValue(grid, colName) {
	var iRows  = grid.getRowsNum();
	var returnValue = "";
	if (iRows > 0) {
		var sid = grid.getSelectedId();
		if (sid == null) sid = 1;

		var curIndex   = grid.getRowIndex(sid);
		returnValue    = (curIndex > -1)?grid.cells(curIndex+1, grid.getColIndexById(colName)).getValue():"";
	}
	return returnValue;
}

/**
 * Grid의 선택된 Row의 지정컬럼에 값을 넣어줌 
 * @param grid
 * @param colName
 * @param colValue
 */
function fn_setGridValue(grid, colName, colValue) {
	if (grid.getSelectedRowId() != null) {
		grid.cells(grid.getSelectedRowId(), grid.getColIndexById(colName)).setValue(colValue);
	}
}


/**
 * Form 데이터를 Grid의 선택된 row로 복사
 * 	- TYPE이 edit와 callendar인 경우만 해당.
 * @param form
 * @param grid
 */
function fn_formToGrid(form,grid) {
	//console.log("grid.getSelectedRowId() == " + grid.getSelectedRowId());
	if (grid.getSelectedRowId() != null) {
		form.forEachItem(function(name){
			if (grid.getColIndexById(name) != undefined) {
				
				var sValue = form.getItemValue(name);

		        if(form.getItemType(name)=="input"){
		        	grid.cells(grid.getSelectedRowId(), grid.getColIndexById(name)).setValue(sValue);
		        } else if(form.getItemType(name)=="calendar"){
		        	sValue = fn_getStrFromDate(sValue,"-")  //날짜타입을 텍스트로 변경함
		        }

		        grid.cells(grid.getSelectedRowId(), grid.getColIndexById(name)).setValue(sValue);
				
			}
		});
	}
}

/**
 * grid의 지정 컬럼에 span적용
 * @param grid
 * @param aColId : 적용할 컬럼 id(0부터 시작함)
 */
function fn_setGridRowSpan(grid, aColId) {

	// 가능하게 일단 설정
	grid.enableRowspan();

    var pVal = ""; // 비교 기준이 되는 기존값
    var cVal = ""; // 현재값
    
    var startRowId   = 1;    // 시작점
    var rowSpanCount = 1;    // span count
    
    var iRows  = grid.getRowsNum();
    for(iRow = 0; iRow<iRows; iRow++) {

        iRowId = grid.getRowId(iRow);
        cVal   = grid.cells(iRowId, aColId).getValue();

        //console.log("iRow = "+iRow+" / iRowId = " + iRowId + " rowSpanCount = " + rowSpanCount);
        //console.log("pVal / cVal = " + pVal + " / " + cVal);
        
        if (pVal == cVal) {
        	rowSpanCount ++;
        } else {
        	if (rowSpanCount > 1) {
        		//console.log("iRow / rowSpanCount = " + iRow + " / " + rowSpanCount);
        			            	 
        		// span적용
        		grid.setRowspan(startRowId, aColId, rowSpanCount);
        		
        		// 적용하고 시작점과 span갯수를 다시 설정
        		startRowId   = iRowId;
        		rowSpanCount = 1;
        	}
        }
        pVal = cVal;
        // console.log("--------------------------------");
    }
    
    // 마지막으로 남은거 처리 
    if (rowSpanCount > 1) {
        grid.setRowspan(startRowId, aColId, rowSpanCount);
    }
}