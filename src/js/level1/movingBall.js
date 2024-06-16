import { isMobile, ELEMENT_STATE } from "../comnFns.js";

// common variable
export const lastMoveX = {
  value: 0,
  get x() {
    return this.value;
  },
  set x(_x) {
    this.value = _x;
  },
};
export const lastMoveY = {
  value: 0,
  get y() {
    return this.value;
  },
  set y(_y) {
    this.value = _y;
  },
};
export const ballDistance = {
  value: 0,
  get getValue() {
    return this.value;
  },
  set setValue(_val) {
    this.value = _val;
  },
};
export const ballAngleRad = {
  value: 0,
  get getValue() {
    return this.value;
  },
  set setValue(_val) {
    this.value = _val;
  },
};
export const distanceFactor = {
  value: 0,
  get getValue() {
    return this.value;
  },
  set setValue(_val) {
    this.value = _val;
  },
};
export const velocityX = {
  value: 0,
  get x() {
    return this.value;
  },
  set x(_x) {
    this.value = _x;
  },
};
export const velocityY = {
  value: 0,
  get y() {
    return this.value;
  },
  set y(_y) {
    this.value = _y;
  },
};
export const ballSpeed = 0.1;
let ballX = 0;
let ballY = 0;

// common functions

// mobile ===================================
export function moveBall() {
  if (ELEMENT_STATE("#app", "#LEVEL1", ".ball")) return;
  const BALL = document.querySelector(".ball");

  function animateBall() {
    ballX = BALL.offsetLeft + velocityX.x;
    ballY = BALL.offsetTop + velocityY.y;

    if (ballX < 0 || ballX + BALL.clientWidth > window.innerWidth) {
      velocityX.x = -velocityX.x;
      ballX = BALL.offsetLeft + velocityX.x;
    }
    if (ballY < 0 || ballY + BALL.clientHeight > window.innerHeight) {
      velocityY.y = -velocityY.y;
      ballY = BALL.offsetTop + velocityY.y;
    }
    velocityX.x = velocityX.x * 0.98;
    velocityY.y = velocityY.y * 0.98;
    BALL.style.left = `${Math.max(
      0,
      Math.min(ballX, window.innerWidth - BALL.clientWidth)
    )}px`;
    BALL.style.top = `${Math.max(
      0,
      Math.min(ballY, window.innerHeight - BALL.clientHeight)
    )}px`;
    if (Math.abs(velocityX.x) > 0.5 || Math.abs(velocityY.y) > 0.5) {
      requestAnimationFrame(animateBall);
    }
  }
  requestAnimationFrame(animateBall);
}

// PC =======================================

// INIT
function movingBallInit() {
  //
}
