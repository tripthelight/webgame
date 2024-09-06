import {isMobile, ELEMENT_STATE, findTransform} from "../comnFns.js";
import {ARROW_ELEM, BALLS, VELOCITIES, POSITIONS} from "./variables.js";

/**
 * common variable
 */
let windowInitialW = window.innerWidth;
let windowInitialH = window.innerHeight;
let resizeDelayTimer = 1;
let positions = [];

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
function adjustBallPosition(_ballAct) {
  const ballInitialX = findTransform(_ballAct).x;
  const ballInitialY = findTransform(_ballAct).y;
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
  ARROW_ELEM.el.style.transform = result;
  // BALLS.balls.forEach(_ball => {
  //   _ball.style.transform = result;
  // });
}

function getRandomPosition(_index, _ball) {
  return {
    x: _index === 0 ? window.innerWidth / 2 - _ball.clientWidth / 2 : Math.random() * (window.innerWidth - _ball.clientWidth),
    y: _index === 0 ? window.innerHeight / 2 - _ball.clientHeight / 2 : Math.random() * (window.innerHeight - _ball.clientHeight),
  };
}

function isOverlapping(pos, index) {
  for (let i = 0; i < positions.length; i++) {
    if (i !== index) {
      let dx = positions[i].x - pos.x;
      let dy = positions[i].y - pos.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        return true;
      }
    }
  }
  return false;
}

/**
 * INIT
 */
export function init() {
  // #LEVEL1
  if (ELEMENT_STATE("#app", "#LEVEL1")) return;
  // .drag-arrow
  if (ELEMENT_STATE("#app", "#LEVEL1", ".drag-arrow")) return;
  ARROW_ELEM.el = document.querySelector(".drag-arrow");

  // .ball
  if (ELEMENT_STATE("#app", "#LEVEL1", ".ball")) return;

  windowInitialW = window.innerWidth;
  windowInitialH = window.innerHeight;

  BALLS.balls = [document.getElementById("BALL1"), document.getElementById("BALL2")];
  VELOCITIES.value = BALLS.balls.map(() => ({x: 0, y: 0}));
  BALLS.balls.forEach((ball, index) => {
    let pos;
    do {
      pos = getRandomPosition(index, ball);
    } while (isOverlapping(pos, index));
    positions.push(pos);
  });
  POSITIONS.value = positions;

  BALLS.balls.forEach((_ball, _index) => {
    _ball.style.transform = `translate(${positions[_index].x}px, ${positions[_index].y}px)`;
    if (_index === 0) {
      ARROW_ELEM.el.style.transform = `translate(${positions[_index].x}px, ${positions[_index].y}px)`;
    }
  });
}

/**
 * window resize
 */
// window resize ing
window.addEventListener("resize", () => {
  // .ball, .drag-arrow 의 위치 비율
  const BALL_ACT = BALLS.balls.filter(ball => ball.classList.contains("active"))[0];
  if (ARROW_ELEM.el.classList.contains("moving") && BALL_ACT.classList.contains("moving")) {
    adjustBallPosition(BALL_ACT);
  }
});

// window resize end
window.addEventListener("resizeend", () => {
  // resizeend 이벤트가 끝난 후 실행할 코드를 여기에 작성
  console.log("Window resize event finished");
  windowInitialW = window.innerWidth;
  windowInitialH = window.innerHeight;
});
