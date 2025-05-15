/*
* 문제 리스트 html 동적 생성
*/

var listUrl = new URL(document.URL);

var nowType = listUrl.searchParams.get("type");

//console.log("nowType : " + nowType);

var endListJSON = '';

if(nowType == 'blank') {
  endListJSON = localStorage.getItem("endListBlank");
} else if(nowType == 'order') {
  endListJSON = localStorage.getItem("endListOrder");
} else {
  nowType = 'blank';
  endListJSON = localStorage.getItem("endListOrder");
}

// 풀이 완료 문제 localStorage 정보 가져오기
var endList = JSON.parse(endListJSON);

// 동적 html 생성 템플릿
var listTemplate = '<li class="question_item {endClass}"><a href="{url}?pyun={pyun}" onclick="trackClickLink(\'리스트\', \'{pType} {pyun}편\');"><span>{pyun}<span class="sr_only">편</span></span></a></li>';
var preTemplate = '<div class="swiper-slide"><ul class="question_category list_div">';
var afterTemplate = '</ul></div>';

var tmpHtml = '';

// type에 맞는 url 변경
if(nowType == 'blank') {
  listTemplate = listTemplate.replace('{url}', 'content_blank.html');
  listTemplate = listTemplate.replace('{pType}', '빈칸 채우기');
} else if(nowType == 'order') {
  listTemplate = listTemplate.replace('{url}', 'content_order.html');
  listTemplate = listTemplate.replace('{pType}', '순서 맞추기');
}

var totalCnt = 80;
var onePageCnt = 40;
for(var i = 0; i < 80; i++) {
  if(i % onePageCnt == 0) {
    if(i > 0) {
      tmpHtml += afterTemplate;
    }
    tmpHtml += preTemplate;
  }

  var replaceHtml = listTemplate;
  var nowPyun = i+1;

  // 풀이 완료 문제이면 {endClass} 를 on 으로, 아니면 빈값으로 변경
  if(endList != null && endList.includes(String(nowPyun))) {
    replaceHtml = replaceHtml.replace('{endClass}', 'on');
  } else {
    replaceHtml = replaceHtml.replace('{endClass}', '');
  }

  // 현재 편수 변경
  replaceHtml = replaceHtml.replace(/{pyun}/gi, nowPyun);

  tmpHtml += replaceHtml;
}

tmpHtml += afterTemplate;

// 동적 html 입력
$("div.swiper-wrapper").html(tmpHtml);



/*
* swiper 설정
*/
var swiper = new Swiper('.swiper', {
  pagination: {
    el: '.paging_area',
    clickable : true,
  }
});
