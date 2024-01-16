/*
 * dhtmlx UI의 validation 처리용
 * 
 * Form설정 : var formData = [{type: "input", label: "Number", validate:"ValidNumeric"}]; 
 *          var formData = [{type: "input", label: "Number", validate:"fn_isGreater100"}]; 
 * 
 * dhtmlx form Standard rules
		Empty;
		ValidBoolean;
		ValidEmail;
		ValidInteger;
		ValidNumeric;
		ValidAplhaNumeric;
		ValidDatetime;
		ValidDate;
		ValidTime;
		ValidIPv4;
		ValidCurrency;
		ValidSSN;
		ValidSIN. Rules
 * 
 * dhtmlx form custom rule sample
 *      fn_isGreater100
 * 
 */



/**
 * validation 예제함수(100보다 큰가?)
 * @param data
 * @returns {Boolean}
 */
function fn_isGreater100(data){
    if (data=="") return true;// returns 'true' if a cell is empty
    return (data>100);
};

/**
 * Form내부 필수 체크
 * @param form
 * @returns {Boolean}
 */
function fn_validateForm(form) {
	var bValid = true;
	if (!form.validate()) {
		fn_alertMsg('유효하지 않은 항목이 있습니다.');
		bValid = false;
	}
	return bValid;
	
}


/**
 * Grid에 연결된 dataProcessor를 이용하여 validation체크
 * ex) 빈값체크 설정 
	    dpDetail = new dataProcessor(" ");
	    dpDetail.setVerificator(1,fn_dpValidNotEmpty);
	    dpDetail.setVerificator(2,fn_dpValidNotEmpty);
	    fn_initDP(dpDetail, grdDetail);
 * 최대 길이 체크는 colMaxLength설정을 이용하여 자동체크(fn_dpValidMaxLength)
 * @param dp1
 * @returns {Boolean}
 */
function fn_validateGrid(dp1) {

	var grid   = dp1.obj;
	var bValid = true;
	dp1.messages = [];

	var iRows  = grid.getRowsNum();
	for(var iRow = 0; iRow<iRows; iRow++) {

		var iRowId    = grid.getRowId(iRow);
		var sState    = dp1.getState(iRowId);
        /*console.log("iRow      = " + iRow);
        console.log("iRowId    = " + iRowId);
        console.log("sState    = " + sState);*/
        if ( (sState == "inserted") || (sState == "updated") ) { // 상태값이 변한 경우만 사용
        	bValid&=fn_checkBeforeUpdate(dp1, iRowId);
        }
	}
    
    if (!bValid) {
		//fn_alertMsg('필수항목이 있습니다.');
		fn_alertMsg(dp1.messages);
	}
	return bValid;
}

/**
 * 해당 updatedRow의 입력값 체크
 * @param dp
 * @param updatedRow
 * @returns {Boolean}
 */
function fn_checkBeforeUpdate(dp, updatedRow) {
	var valid     = true; 
	var c_invalid = [];
	var colMaxLengths = [];
	
	/*
	console.log("fn_checkBeforeUpdate" );
	console.log("colMaxLength = " + dp.obj.colMaxLength );
	console.log("typeof dp.obj._validators = " + typeof dp.obj.colMaxLength );
	*/
	
	var bLengthCheck = false; 
	if (typeof dp.obj.colMaxLength != "undefined"){
		bLengthCheck = true;
		colMaxLengths = dp.obj.colMaxLength.split(",");
	}
	
	console.log("bLengthCheck = " + bLengthCheck);
	
	var res;
	for (var i=0; i<dp.obj._cCount; i++) {
		// 먼가 체크 함수가 지정된 경우
		if (dp.mandatoryFields[i]){
			res=dp.mandatoryFields[i].call(dp.obj, dp.obj, dp.obj.cells(updatedRow,i).getValue(), updatedRow, i);
			//console.log("res == " +  res);
			if (typeof res == "string"){
				dp.messages.push(res);
				valid = false;
			} else {
				// 추가로 max length 체크
				if (bLengthCheck) {
					if ( (i <= colMaxLengths.length) && (colMaxLengths[i] != "") ) {
						//console.log("필수 길이 체크.");
						res= fn_dpValidMaxLength(dp.obj, dp.obj.cells(updatedRow,i).getValue(), updatedRow, i, colMaxLengths[i]);
						if (typeof res == "string"){
							dp.messages.push(res);
							valid = false;
						}
					}
				}
			}
		} else {
			// 체크 함수가 없어도 추가로 max length 체크
			if (bLengthCheck) {
				if ( (i <= colMaxLengths.length) && (colMaxLengths[i] != "") ) {
					res= fn_dpValidMaxLength(dp.obj, dp.obj.cells(updatedRow,i).getValue(), updatedRow, i, colMaxLengths[i]);
					if (typeof res == "string"){
						dp.messages.push(res);
						valid = false;
					} else {
						valid&=res;
						c_invalid[i]=!res;
					}
				}
			}
		}
	}
	
	if (!valid){
		dp.set_invalid(updatedRow,"invalid",c_invalid);
		dp.setUpdated(updatedRow,false);
	}
	return valid;
}

/**
 * Grid 입력항목의 빈값 체크
 * @param grid
 * @param value
 * @param id
 * @param ind
 * @returns
 */
function fn_dpValidNotEmpty(grid, value, id, ind) {
	//console.log("fn_dpValidNotEmpty start");
	if (value=="") {
		//return (grid.getRowIndex(id) + 1) + "번째 " + grid.getColLabel(ind) + "은(는) 필수";
		//return "Line " + (grid.getRowIndex(id) + 1) + "-Column " + grid.getColLabel(ind);
		return "No" + (grid.getRowIndex(id) + 1) + ":" + grid.getColLabel(ind) + " is Null  ";
	}
	return true;
}

/**
 * Grid 입력항목의 길이 제한 체크함수
 * @param grid
 * @param value
 * @param id
 * @param ind
 * @param maxLength
 * @returns
 */
function fn_dpValidMaxLength(grid, value, id, ind, maxLength){
	if (value.length > maxLength) {
		return "No" + (grid.getRowIndex(id) + 1) + ":" + grid.getColLabel(ind) + " Max Length is " +  maxLength +"  ";
		//return (grid.getRowIndex(id) + 1) + ":" + grid.getColLabel(ind) + "의 최대길이 = " +  maxLength;
	}
	return true;
}