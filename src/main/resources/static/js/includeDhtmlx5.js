
// Grid내 헤더의 표현 스타일정의
var hStyleR = "color:#ff186a;"; // 빨강
var hStyleE = "color:#3b5ef7;"; // 파랑
var hStyleP = " <i class='fa fa-external-link'/>"; // 팝업링크 컬럼 표시

document.write("<link id='cssTemplate' rel='stylesheet' type='text/css' href='"+rootPath+"/css/jquery-ui-1.10.4.custom.min.css'>");
document.write("<link id='cssFontAs'   rel='stylesheet' type='text/css' href='"+rootPath+"/dhtmlx/codebase/fonts/font_awesome/css/font-awesome.min.css'>	");
document.write("<link id='cssDhtmlx'   rel='stylesheet' type='text/css' href='"+rootPath+"/dhtmlx/codebase/fonts/font_roboto/roboto.css'>                   ");
document.write("<link id='cssDhtmlx'   rel='stylesheet' type='text/css' href='"+rootPath+"/dhtmlx/codebase/dhtmlxvault.css'>                                ");
document.write("<link id='cssDhtmlx'   rel='stylesheet' type='text/css' href='"+rootPath+"/css/bootstrap.min.css'>");
document.write("<link id='cssDhtmlx'   rel='stylesheet' type='text/css' href='"+rootPath+"/css/tabbar.css'>");

document.write("<script type='text/javascript' src='"+rootPath+"/dhtmlx/codebase/dhtmlx.js'></script>      		      	");
document.write("<script type='text/javascript' src='"+rootPath+"/dhtmlx/codebase/dhtmlxvault.js'></script>      	  	");
document.write("<script type='text/javascript' src='"+rootPath+"/dhtmlx/codebase/ext/swfobject.js'></script>      		  	");
document.write("<script type='text/javascript' src='"+rootPath+"/js/jquery/jquery-3.6.0.min.js'></script>");
document.write("<script type='text/javascript' src='"+rootPath+"/js/jquery/jquery-ui-1.10.4.custom.min.js'></script>  	");
document.write("<script type='text/javascript' src='"+rootPath+"/js/json2.js'></script>  							  	");
document.write("<script type='text/javascript' src='"+rootPath+"/js/bootstrap.min.js'></script>");
document.write("<script type='text/javascript' src='"+rootPath+"/js/jquery.twbsPagination.min.js'></script>");

/*
 * 필수요소 정의
 * 		그외 페이징(commonPaging), 첨부파일처리(commonAttach), 리포트폼호출(commonReport)은 페이지 내 개별 선언
 */
document.write("<script type='text/javascript' src='"+rootPath+"/js/dhtmlx5/common.js'></script>             ");
document.write("<script type='text/javascript' src='"+rootPath+"/js/dhtmlx5/commonGrid.js?20200513'></script>");
document.write("<script type='text/javascript' src='"+rootPath+"/js/dhtmlx5/commonMsg.js'></script>          ");
document.write("<script type='text/javascript' src='"+rootPath+"/js/dhtmlx5/commonPopup.js'></script>   		");
document.write("<script type='text/javascript' src='"+rootPath+"/js/dhtmlx5/commonTransaction.js'></script>  ");
document.write("<script type='text/javascript' src='"+rootPath+"/js/dhtmlx5/commonValidation.js'></script>   ");
document.write("<script type='text/javascript' src='"+rootPath+"/js/commonUtils.js'></script>        ");
document.write("<script type='text/javascript' src='"+rootPath+"/js/commonVariable.js'></script>        ");


// 조회폼 영역의 가로 디자인 설정(한줄에 조회항목이 3개 ~ 4개 인 경우 구분)
var SearchFormStyle3 = { type:"settings", position:"label-left", labelWidth:"115", inputWidth:"285", offsetLeft:"10", offsetTop:"1"};
var SearchFormStyle4 = { type:"settings", position:"label-left", labelWidth:"115", inputWidth:"172", offsetLeft:"10", offsetTop:"1"};


// 등록폼 영역의 너비값 정보를 저장한 배열
var RegisterFormWidth = [    0
					    ,  420
						,  670
						,  970
					   ];


//등록폼 영역의 가로 디자인 설정(한줄에 입력 항목이 1개 ~ 3개 인 경우 구분)
var RegisterFormStyle1 = { type:"settings", position:"label-left", labelWidth:"120", inputWidth:"200", offsetLeft:"10", offsetTop:"1"  };
var RegisterFormStyle2 = { type:"settings", position:"label-left", labelWidth:"120", inputWidth:"150", offsetLeft:"10", offsetTop:"1"  };
var RegisterFormStyle3 = { type:"settings", position:"label-left", labelWidth:"120", inputWidth:"150", offsetLeft:"10", offsetTop:"1"  };



/**
   시스템 사용 스킨 설정
 * 1. 기존 디자인(dhtmlx 4.4 스킨) 대신 스벅용 새로운 디자인 적용
 */
var dhtmlx_skin = "dhx_skyblue";
var css_ref     = rootPath + "/dhtmlx/codebase/dhtmlx_5.css?v=202302";
var dhtmlx_image_path  = rootPath + "/dhtmlx/codebase/imgs/";   
var toolbar_icons_path = rootPath + "/images/dhtmlx/toolbar/dhx_skyblue/";


/**
 * 2. dhtmlx 5.2의 기본 스킨("material")
var dhtmlx_skin = "";   // material는 기본값이라 설정을 하지 말아야 함
var css_ref     = "/dhtmlx/codebase/dhtmlx.css";
var dhtmlx_image_path  = "/dhtmlx/codebase/imgs/";   
var toolbar_icons_path = "/images/dhtmlx/toolbar/dhx_material/";
 */

/**
   시스템 사용 스킨 설정
 * 3. dhtmlx 5.2의 확장 스킨("web")

var dhtmlx_skin = "web";
var css_ref     = "/dhtmlx/skins/"+dhtmlx_skin+"/dhtmlx_long.css";
var dhtmlx_image_path  = "/dhtmlx/skins/"+dhtmlx_skin+"/imgs/";   
var toolbar_icons_path = "/images/dhtmlx/toolbar/dhx_"+dhtmlx_skin+"/";
dhtmlx_skin     = "dhx_"+dhtmlx_skin;
 */

/*document.write("<link id='cssTemplate' rel='stylesheet' type='text/css' href='/css/layout_long.css'>");*/
document.write("<link id='cssTemplate' rel='stylesheet' type='text/css' href='"+rootPath+"/css/dhtmlx5App.css'>");
document.write("<link id='cssDhtmlx'   rel='stylesheet' type='text/css' href='"+css_ref+"'>");
document.write("<link id='cssDhtmlx' rel='stylesheet' type='text/css' href='"+rootPath+"/dhtmlx/codebase/dhtmlx.css'>");

// 조회폼 영역의 높이값 정보를 저장한 배열
var SearchFormHeight = [    0
						,  72
						,  103
						, 134
					   ];

document.addEventListener('contextmenu', event => event.preventDefault());
