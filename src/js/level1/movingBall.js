import {isMobile, ELEMENT_STATE, findTransform} from "../comnFns.js";

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
const LEVEL1_ELEM = document.getElementById("LEVEL1");
const BALL_ELEM = LEVEL1_ELEM.querySelector(".ball");
const ARROW_ELEM = LEVEL1_ELEM.querySelector(".drag-arrow");
let ballX = window.innerWidth / 2 - BALL_ELEM.clientWidth / 2;
let ballY = window.innerHeight / 2 - BALL_ELEM.clientHeight / 2;
let ballW = 0;
let ballH = 0;

// common functions

// mobile ===================================
export function moveBall() {
  ballW = BALL_ELEM.clientWidth / 2;
  ballH = BALL_ELEM.clientHeight / 2;
  if (!BALL_ELEM.classList.contains("moving")) {
    BALL_ELEM.classList.add("moving");
    ballX = window.innerWidth / 2;
    ballY = window.innerHeight / 2;
  }
  if (LEVEL1_ELEM.classList.contains("moving")) {
    ballX = findTransform(BALL_ELEM).x + ballW;
    ballY = findTransform(BALL_ELEM).y + ballH;
  }

  function animateBall() {
    ballX += velocityX.x;
    ballY += velocityY.y;

    if (ballX < ballW) {
      ballX = ballW;
      velocityX.x = -velocityX.x;
    }
    if (ballX + ballW > window.innerWidth) {
      ballX = window.innerWidth - ballW;
      velocityX.x = -velocityX.x;
    }
    if (ballY < ballH) {
      ballY = ballH;
      velocityY.y = -velocityY.y;
    }
    if (ballY + ballH > window.innerHeight) {
      ballY = window.innerHeight - ballH;
      velocityY.y = -velocityY.y;
    }

    velocityX.x = velocityX.x * 0.98;
    velocityY.y = velocityY.y * 0.98;
    BALL_ELEM.style.transform = `translate(${Math.floor(ballX - ballW)}px, ${Math.floor(ballY - ballH)}px)`;
    if (Math.abs(velocityX.x) > 0.5 || Math.abs(velocityY.y) > 0.5) {
      requestAnimationFrame(animateBall);
    } else {
      if (!LEVEL1_ELEM.classList.contains("moving")) LEVEL1_ELEM.classList.add("moving");
      ARROW_ELEM.style.transform = `translate(${Math.floor(ballX - ballW)}px, ${Math.floor(ballY - ballH)}px)`;
      lastMoveX.x = 0;
      lastMoveY.y = 0;
      ballDistance.setValue = 0;
      ballAngleRad.setValue = 0;
      distanceFactor.setValue = 0;
      velocityX.x = 0;
      velocityY.y = 0;
    }
  }
  requestAnimationFrame(animateBall);
}

// PC =======================================

// INIT
export function movingBallInit() {
  //
}
