
/**
 * Form내부 필수 체크
 * @param form
 * @returns {Boolean}
 */
function fn_s_validateForm(form) {
	var bValid = true;
	if (!form.validate()) {
		fn_s_alertMsg('필수항목이 있습니다.');
		bValid = false;
	}
	return bValid;
	
}

// 자연수(양의 int 범위) 유효성 체크
function fn_numberValidation(value) {
	if(!/^[0-9]+$/.test(value)) {
		return false;
	}
	if (value < 0 || value > 2147483647) {
		return false;
	}
	return true;
}

// 백분율 체크 (0 ~ 100, 소수점 5자리까지 허용)
function fn_percentValidation(value) {
	if (!/^[\d]*\.?[\d]{0,5}$/.test(value)) {
		return false;
	}

	if (value < 0 || value > 100) {
		return false;
	}

	return true;
}