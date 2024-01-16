
/**
 * post방식 윈도우 오픈 함수
 * @param target		팝업명
 * @param url			호출 url
 * @param option		window.open option
 * @param paramKey[]	파라미터 key
 * @param paramVal[]	파라미터 val
 */
function windowOpenPost(target, url, option, paramKey, paramVal){
	var paramLen	= paramKey.length;
	var frm = $('<form></form>');

	frm.attr('id', '_frm');
	frm.attr('action', rootPath+url);
	frm.attr('method', 'post');
	frm.attr('target', target);
	
	for(i=0 ; i < paramLen ; i++){
		frm.append($("<input type='hidden' value="+paramVal[i]+" name="+paramKey[i]+">"));
	}
	
	frm.appendTo('body');
	
	window.open("", target, option);
	frm.submit();
	$('#_frm').remove();
}

/**
 *  이미지 미리보기 modal
 * @param {"image path"} src
 * @param {String or null} title 
 * @returns 
 */
 function fn_s_imageShow(src, title, mode, imgWidth, imgHeight){
	const image = new Image();
	var imageHtml;
	if(fn_isNull(src)){
		alert("이미지 경로가 없습니다.");
		return false
	}

	image.src = src;
	if(fn_isNotNull(imgWidth) || fn_isNotNull(imgHeight)){
		var style = "";
		if(fn_isNotNull(imgWidth)){
			image.width = imgWidth;
			style += "width :"+imgWidth+"px;";
		}
		if(fn_isNotNull(imgHeight)){
			image.height = imgHeight;
			style += "height :"+imgHeight+"px;";
		}
		imageHtml = '<img src="'+src+'" style="'+style+'"/>';
	} else {
		imageHtml = '<img src="'+src+'"/>';
	}
	
    var dhxImageModal = new dhx.Window({
        title: fn_isNull(title) ? "이미지 미리보기" : title,
        //width: this.width,
        //height: this.height ,
        closable: true,
        resizable: true,
        //movable: true,
        modal: true,
		//viewportOverflow:true,
        html: imageHtml
    });
	
	var popWidth = this.innerWidth;
	var popHeight = this.innerHeight;

	image.onload = function() {
		var modalWidth = this.width + 60;
		var modalHeight = this.height + 110;
		
		console.log(this);
		console.log(this.width);

		var modalX ;
    	var modalY ;
		if(mode = "pop"){
			modalX = (popWidth/ 2) - (modalWidth / 2);
    		modalY = (popHeight / 2) - (modalHeight / 2);
		} else {
			modalX = (window.screen.width / 2) - (modalWidth / 2);
    		modalY = (window.screen.height / 2) - (modalHeight / 2);
		}
		
		dhxImageModal.setSize(parseInt(modalWidth, 10), parseInt(modalHeight, 10)); // 모달 크기 조정
		dhxImageModal.setPosition(parseInt(modalX, 10), parseInt(modalY, 10)); // 모달 기준점 조정
	}
	
	dhxImageModal.show();
    return dhxImageModal;
}

function fn_s_imageDivShow(src, title, mode, imgWidth, imgHeight, style = ""){
	const image = new Image();
	let imageHtml;
	if (fn_isNull(src)) {
		alert("이미지 경로가 없습니다.");
		return false
	}

	image.src = src;
	if (fn_isNotNull(imgWidth) || fn_isNotNull(imgHeight)) {
		if (fn_isNotNull(imgWidth)) {
			image.width = imgWidth;
			style += "width :"+imgWidth+"px;";
		}
		if (fn_isNotNull(imgHeight)) {
			image.height = imgHeight;
		}
		imageHtml = '<div style="overflow-x: hidden; overflow-y: auto"><img src="'+src+'" style="'+style+'"/></div>';
	} else {
		imageHtml = '<img src="'+src+'"/>';
	}

	const dhxImageModal = new dhx.Window({
		title: fn_isNull(title) ? "이미지 미리보기" : title,
		//width: this.width,
		//height: this.height ,
		closable: true,
		resizable: true,
		//movable: true,
		modal: true,
		//viewportOverflow:true,
		html: imageHtml
	});

	let popWidth = this.innerWidth;
	let popHeight = this.innerHeight;

	image.onload = function() {
		let modalWidth = this.width + 60;
		let modalHeight = this.height + 110;

		console.log(this);
		console.log(this.width);

		let modalX ;
		let modalY ;
		if(mode === "pop"){
			modalX = (popWidth/ 2) - (modalWidth / 2);
			modalY = (popHeight / 2) - (modalHeight / 2);
		} else {
			modalX = (window.screen.width / 2) - (modalWidth / 2);
			modalY = (window.screen.height / 2) - (modalHeight / 2);
		}

		dhxImageModal.setSize(parseInt(modalWidth, 10), parseInt(modalHeight, 10)); // 모달 크기 조정
		dhxImageModal.setPosition(parseInt(modalX, 10), parseInt(modalY, 10)); // 모달 기준점 조정
	}

	dhxImageModal.show();
	return dhxImageModal;
}

// 이 아래는 미구현!!
/**
 * 
 * @param {*} title 
 * @param {*} html 
 * @param {*} width 
 * @param {*} height 
 * @returns 
 */
 function modalShow(title, src, width, height){
	var strTitle = title;
	const image = new Image();
	if(fn_isNull(strTitle))(
		strTitle = "이미지 미리보기"
	);

	image.src = src;

	//console.log(image);
	//showImageSize(image);
	
	image.onload = function() {
		alert(this.width + 'x' + this.height);
		width = this.width;
		height = this.height;
	}

	var modalWidth = fn_isNull(width) ? 600 : width ;
	var modalHeight = fn_isNull(height) ? 520 : height ;

	var imageHtml = '<img src="'+src+'" width="'+(this.width)+' height="'+(this.width)+'""/>';
	

    var dhxwindow = new dhx.Window({
        title: fn_isNull(title) ? "이미지 미리보기" : title,
        width: this.width,
        height: this.height ,
        closable: true,
        resizable: true,
        movable: true,
        modal: true,
        html: imageHtml
    });

    return dhxwindow;
}

function showImageSize(img){
    var width, height; 
	
	  
    if(img.naturalWidth){
        width = img.naturalWidth;
        height = img.naturalHeight;
    } else {
        var tImg = new Image();
        tImg.src = img.src;
        width = tImg.width;
        height = tImg.height;
    }
    console.log("Image width:" + width + ", height:" + height);
}