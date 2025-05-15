// 타이머 끝난 후 동작 함수
function setQuiz() {
  var tmpCount = 0;
  var tmpText = "";

  $("p.quiz_blank_info").text(qTitle);

  // 문제에서 정답 추출 후 input 태그 변환, HTML 태그 삽입
  for(var i = 1; i < Object.keys(qQuiz).length+1; i++) {

    // 임시 정답 List
    var tmpAnswerList = new Array();

    // quiz 하나 불러오기
    var rowText = qQuiz[i];

    // quiz용 html 동적 생성
    var tmpHtml = "<div class='line_flex'>";

    var tmpI = 0;
    var tmpFlag = false;
    var tmpAnswer = "";
    var tmpInnerText = "";
    while(tmpI < rowText.length) {

      if(!tmpFlag) {
        if(rowText[tmpI] == "{") {
          tmpFlag = true;
        } else {
        	if(rowText[tmpI] != " ") {
        		tmpInnerText += rowText[tmpI];
        	} else {
        		tmpHtml += "<div class='word'>"+tmpInnerText+"</div>";
        		tmpInnerText = "";
        	}
        }
      } else {
        if(rowText[tmpI] == "}") {
          tmpAnswerList.push(tmpAnswer);
          if(i == 1) {
            tmpHtml += "<div class='blank_shape on'></div>";
          } else {
            tmpHtml += "<div class='blank_shape'></div>";
          }
          tmpCount++;
          tmpAnswer = "";
          tmpFlag = false;

        } else {
          tmpAnswer += rowText[tmpI];
        }

      }


      tmpI++;
    }

    if(tmpInnerText != "") {
    	tmpHtml += "<div class='word'>"+tmpInnerText+"</div>";
  		tmpInnerText = "";
  	}

    answerMap.set(Number(i-1), tmpAnswerList);
    tmpHtml += "</div>"

    $("div.word_area").append(tmpHtml);


    // 문제 라인 번호 생성
    var tmpLineHtml = "";
    if(i == 1) {
    	tmpLineHtml += '<li class="line_num_item on">1</li>';
    } else {
    	tmpLineHtml += '<li class="line_num_item">'+i+'</li>';
    }

    $(".line_num_list").append(tmpLineHtml);

  }

  // 보기 생성
  makeExample(0);

  nowFocusDivIndex = 0;

  // 보기 보이기
  $("div.examples").show();
}

// 보기 생성 함수
function makeExample(index) {

  $("div.line_flex:eq("+index+")").children("div.blank_shape").addClass("on");

  // 보기 리스트 섞기
  var nowExampleList = new Array();

  for(var i = 0; i < answerMap.get(Number(index)).length; i++) {
    nowExampleList.push(answerMap.get(Number(index))[i]);
  }

  nowExampleList = shuffleList(nowExampleList);

  // 섞은 보기를 button으로 동적 할당
  var tmpHtml = "";

  for(var i = 0; i < 6; i++) {

    if(i%3 == 0) {
      tmpHtml += '<div class="answer_line">';
    }

    var tmpString = nowExampleList[i];
    if(tmpString === undefined || tmpString == null) {
      tmpHtml += '<div class="blank_shape empty"></div>';
    } else {
      tmpHtml += '<div class="blank_shape on" onclick="javascript:exampleBtnClick(this);">'+tmpString+'</div>';
    }

    if(i%3 == 0) {
      tmpHtml += '</div">';
    }
  }

  // 보기 HTML 삽입
  $("div.answer_line_area").children("div.answer_line").remove();
  $("div.answer_line_area").prepend(tmpHtml);

  // 라인번호 focus 변경
  if(index > 0) {
    $("ol.line_num_list").children("li").eq(index-1).removeClass("on");
    $("ol.line_num_list").children("li").eq(index).addClass("on");
  }

  $("div.line_flex:eq("+index+")").children("div.blank_shape.on").eq(0).addClass("focus");

}

// 리스트 섞기 함수
function shuffleList(inList) {
  var a = inList, n = a.length;
  for(var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

// 보기 버튼 클릭 이벤트
function exampleBtnClick(btnObj) {
  if($(btnObj).text() == "" || $(btnObj).text() == null) {
    return;
  }
  clickStack.push(btnObj);
  $(btnObj).removeClass("on");
  $(btnObj).addClass("empty");
  var clickBtnChar = $(btnObj).text();
  $(btnObj).text("");
  makeSpanString(clickBtnChar);
}

// 지우기 버튼 클릭 이벤트
function erase() {

  if(clickStack.length > 0) {
    var recoveryObj = clickStack.pop();
    $(recoveryObj).show();
    $(recoveryObj).addClass("on");
    $(recoveryObj).removeClass("empty");
    var recoveryDiv = $("div.line_flex:eq("+nowFocusDivIndex+")").children("div.blank_shape").not('.on').last();
    $(recoveryObj).text(recoveryDiv.text());
    $("div.line_flex:eq("+nowFocusDivIndex+")").children("div.on").eq(0).removeClass("focus");
    recoveryDiv.addClass("on");
    recoveryDiv.addClass("focus");
    recoveryDiv.text("");
  }

}

// 보기 버튼 클릭 시 span 내용 변경 함수
function makeSpanString(inChar) {
  var completeFlag = false;

  var nowFocusDiv = $("div.line_flex:eq("+nowFocusDivIndex+")");

  var nowFocusSpans = nowFocusDiv.children("div.on");

  var nowFocusSpan = nowFocusSpans.eq(0);

  if(nowFocusSpans.length == 1) {
    completeFlag = true;
  } else {
    var nextFocusSpan = nowFocusSpans.eq(1);
    nextFocusSpan.addClass("focus");
  }

  nowFocusSpan.text(inChar);
  nowFocusSpan.removeClass("on");
  nowFocusSpan.removeClass("focus");

  // 마지막 보기 클릭 시 정답 체크
  if(completeFlag) {
    checkAnswer();
    clickStack = [];
  }

}

// 정답 체크 함수
function checkAnswer() {

  // 현재 focus 된 div의 정답 체크
  var nowFocusDiv = $("div.line_flex:eq("+nowFocusDivIndex+")").children("div.blank_shape");
  var nowAnswer = answerMap.get(nowFocusDivIndex);

  for(var i = 0; i < nowFocusDiv.length; i++) {
    var tmpSpan = nowFocusDiv.eq(i);
    var inAnswer = tmpSpan.text();
    if(inAnswer == nowAnswer[i]) {
      tmpSpan.addClass("done");
    } else {
      tmpSpan.addClass("error");
    }
  }

  if(nowFocusDivIndex == answerMap.size-1) {
    makeEndPage();
  } else {
    nowFocusDivIndex = Number(nowFocusDivIndex)+1
    makeExample(Number(nowFocusDivIndex));
  }

}

// 결과 페이지 생성 함수
function makeEndPage() {
  $("button.retry_btn").show();

  var textArea = $("p.biblical_verse");
  textArea.addClass("chek_txt");

  $("#qAnswer").show();

  // 정답 개수 체크
  var correctNum = $("div.blank_shape.done").length;
  var answerNum = 0;

  for(var i = 0; i < answerMap.size; i++) {
    answerNum += answerMap.get(i).length;
  }

  if(correctNum == answerNum) {
    $("#passModal").fadeIn();
    if(Number(hintItemCnt) < 99) {
      hintItemCnt = Number(hintItemCnt)+1;
      localStorage.setItem("hintItemCnt", hintItemCnt);
      $("#talentP").text(hintItemCnt);
    }
    var infoHtml = '<span class="icon_emoticon icon_03"></span>정답입니다.';
    $("p.quiz_blank_info").html(infoHtml);

  } else {
    var infoHtml = '<span class="icon_emoticon icon_04"></span>틀렸습니다.';
    $("#failModal").fadeIn();
    $("p.quiz_blank_info").html(infoHtml);
  }
  
  setTimeout(function() {
	  $(".modal_wrap").fadeOut();
  }, 1000);

  $("ol.line_num_list").hide();

  $("div.blank_test_bottom").hide();
  $("div.check_test_cont").show();
  $("#contentDiv").hide();
  
  var beforeWordAreaHtml = $("#beforeWordArea").html();
  $("#afterWordArea").html(beforeWordAreaHtml);
  
  
  // 편수의 마지막 문제인지 체크
  if(qIndex == qSize) {
    $("#nextQuizBtn").hide();
    
    if(qPyun < 80) {
    	$("#nextPyunBtn").show();
    }

    // 마지막 문제인 경우 로컬스토리지 히스토리 추가
    var endListOrderJSON = localStorage.getItem("endListOrder");
    var endListOrder = new Array();
    if(endListOrderJSON != null) {
      endListOrder = JSON.parse(endListOrderJSON);
    }
    if(!endListOrder.includes(qPyun)) {
      endListOrder.push(qPyun);
      localStorage.setItem("endListOrder", JSON.stringify(endListOrder));
    }
  }

}

function nextBtn() {
  location.href="content_order.html?pyun="+qPyun+"&index="+(Number(qIndex)+1);
}

function nextPyun() {
  location.href="content_order.html?pyun="+(Number(qPyun)+1);
}

// 힌트 제공
function checkHint() {
  var nowFocusDiv = $("div.line_flex:eq("+nowFocusDivIndex+")").children("div.blank_shape");
  var tmpQuizIndex = 0;
  for(var i = 0; i < nowFocusDiv.length; i++) {
    if(nowFocusDiv.eq(i).hasClass("focus")) {
      tmpQuizIndex = i;
      break;
    }
  }
  var hintText = answerMap.get(nowFocusDivIndex)[i];
  $("#hintWordModalP").text(hintText);
  $("#hintWordModal").fadeIn();
  $("#hintModal").hide();
  hintItemCnt = Number(hintItemCnt)-1;
  localStorage.setItem("hintItemCnt", hintItemCnt);
  $("#talentP").text(hintItemCnt);
}
