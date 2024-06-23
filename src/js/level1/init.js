import {isMobile, ELEMENT_STATE, findTransform} from "../comnFns.js";

/**
 * common variable
 */
let arrowElement = new Object();
let ballElement = new Object();
let windowInitialW = window.innerWidth;
let windowInitialH = window.innerHeight;
let resizeDelayTimer = 1;

/**
 * common event
 */
// resize end event 등록
(function () {
  let resizeTimer;

  // window의 resize 이벤트 리스너를 등록
  window.addEventListener("resize", () => {
    // 기존 타이머가 있다면 지웁니다
    clearTimeout(resizeTimer);

    // 새로운 타이머를 설정합니다
    resizeTimer = setTimeout(() => {
      // 커스텀 이벤트 생성
      const resizeEndEvent = new Event("resizeend");
      window.dispatchEvent(resizeEndEvent);
    }, resizeDelayTimer); // resizeDelayTimer ms 후에 실행되도록 설정 (필요에 따라 조정 가능)
  });
})();

/**
 * common functions
 */
// window를 resize 할 때 event 함수
function adjustBallPosition() {
  const ballInitialX = findTransform(ballElement).x;
  const ballInitialY = findTransform(ballElement).y;
  const xRatio = ballInitialX / windowInitialW;
  const yRatio = ballInitialY / windowInitialH;
  const newWindowWidth = window.innerWidth;
  const newWindowHeight = window.innerHeight;
  const result = `
    translate(
      ${Math.floor(xRatio * newWindowWidth)}px,
      ${Math.floor(yRatio * newWindowHeight)}px
    )
  `;
  arrowElement.style.transform = result;
  ballElement.style.transform = result;
}

/**
 * INIT
 */
export function init() {
  // #LEVEL1
  if (ELEMENT_STATE("#app", "#LEVEL1")) return;
  // .drag-arrow
  if (ELEMENT_STATE("#app", "#LEVEL1", ".drag-arrow")) return;
  arrowElement = document.querySelector(".drag-arrow");

  // .ball
  if (ELEMENT_STATE("#app", "#LEVEL1", ".ball")) return;
  ballElement = document.querySelector(".ball");

  windowInitialW = window.innerWidth;
  windowInitialH = window.innerHeight;
}

/**
 * window resize
 */
// window resize ing
window.addEventListener("resize", () => {
  // .ball, .drag-arrow 의 위치 비율
  if (arrowElement.classList.contains("moving") && ballElement.classList.contains("moving")) {
    adjustBallPosition();
  }
});

// window resize end
window.addEventListener("resizeend", () => {
  // resizeend 이벤트가 끝난 후 실행할 코드를 여기에 작성
  console.log("Window resize event finished");
  windowInitialW = window.innerWidth;
  windowInitialH = window.innerHeight;
});
