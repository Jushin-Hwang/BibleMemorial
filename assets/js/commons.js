// 공통 정보 설정

var url = new URL(document.URL);

// URL에 맞는 문제 객체 생성
var qObj = setObj(url);

// 기본 변수 설정
var qPyun = qObj.pyun;
var qTitle = qObj.title;
var qIndex = qObj.index;
var qSize = qObj.size;
var qAnswer = qObj.answer;
var qQuiz = qObj.quiz;

// 정답 Map
var answerMap = new Map();

// 보기 선택 Stack
var clickStack = [];

// 현재 포커스된 문제 div index
var nowFocusDivIndex;

// 힌트 아이템 세팅
var hintItemCnt = localStorage.getItem("hintItemCnt");
if(hintItemCnt == null) {
  // 처음 힌트 제공 개수
  hintItemCnt = 3;
  localStorage.setItem("hintItemCnt", hintItemCnt);
}


// console.log(qObj);

// 초기 화면 세팅 함수 호출
setInit(qPyun, qTitle, qIndex, qSize, qAnswer,timerCallback);

// 초기 화면 세팅 함수
function setInit(qPyun, qTitle, qIndex, qSize, qAnswer, callback) {
  $("#qPyun").text("유스워십 전도축제 " + qPyun + "번 문제");

  // qIndex li 동적 생성
  var tmpIndexLi = "";
  for(var i = 1; i < Number(qSize)+1; i++) {
	  if(qIndex == i) {
		  tmpIndexLi += '<li class="on"></li>';
	  } else {
		  tmpIndexLi += '<li></li>';
	  }
  }
  $("#qIndex").html(tmpIndexLi);
  $("#qTitle").text(qTitle);
  $("#qAnswer").text(qAnswer);
  $("#talentP").text(hintItemCnt);
  $("#answerTitle").text(qTitle);
  $("#answerText").text(qAnswer);

  callback();
}

// 초기 완료 세팅 후 타이머 콜백 함수
function timerCallback() {
  var num = 4
  var timer = setInterval(function(){
    if(num == 0) {
    //if(num == 4) {
      clearInterval(timer);
      // 타이머 끝난 후 동작 함수 호출$
      $("#textDiv").hide();
      $("#timerDiv").hide();
      $("#contentDiv").show();
      $(".talent_box").show();
      setQuiz();
    } else {
      $("#timerSec").text(num);
      num--;
    }
  }, 1000)
}



// URL로 해당 문제 객체 생성 및 반환
function setObj(url) {

  // URL 에서 편수 받아오기
  var pyun = url.searchParams.get("pyun");
  var qIndex = url.searchParams.get("index");

  // URL 유효성 체크
  // pyun이 없거나 리스트 이상의 값이 들어오는지 체크
  if(pyun == null || pyun > pyunList.length || pyun < 1 || isNaN(pyun)) {
    alert("잘못된 접근입니다");
    history.back();
  }

  // qIndex가 없거나 리스트 이상의 값이 들어오면 1로 초기화
  if(qIndex == null || qIndex > pyunList[pyun-1].quizlist.length || qIndex < 1 || isNaN(qIndex)) {
    qIndex = 1;
  }

  // 문제 객체 생성 및 리턴
  var qObject = pyunList[pyun-1].quizlist[qIndex-1];

  return qObject;

}


// 힌트 모달 창 오픈
function openHintModal() {
  if(hintItemCnt == 0) {
    $("#hintWordModalP").text("남은 힌트가 없습니다.");
    $("#hintWordModal").fadeIn();
  } else {
    $("#hintModal").fadeIn();
  }
}

function closeModal() {
  $("div.modal_wrap").fadeOut();
}

// 모달 팝업 밖에 클릭 시 모달 창 닫히도록 설정
$("div.modal_wrap").on("click", function(event) {
  if($(event.target).hasClass("modal_wrap")) {
    closeModal();
  }
})
