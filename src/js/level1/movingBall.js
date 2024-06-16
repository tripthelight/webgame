import { isMobile, ELEMENT_STATE } from "../comnFns.js";

// common variable
export let lastMoveX = {
  value: 0,
  get getX() {
    return this.value;
  },
  set setX(_x) {
    this.value = _x;
  },
};
export let lastMoveY = {
  value: 0,
  get getY() {
    return this.value;
  },
  set setY(_y) {
    this.value = _y;
  },
};
export let ballDistance = {
  value: 0,
  get getDistance() {
    return this.value;
  },
  set setDistance(_val) {
    this.value = _val;
  },
};
export let ballAngleRad = {
  value: 0,
  get getAngleRad() {
    return this.value;
  },
  set setAngleRad(_val) {
    this.value = _val;
  },
};
export let distanceFactor = {
  value: 0,
  get getDistanceFactor() {
    return this.value;
  },
  set setDistanceFactor(_val) {
    this.value = _val;
  },
};
export let velocityX = {
  value: 0,
  get getX() {
    return this.value;
  },
  set setX(_x) {
    this.value = _x;
  },
};
export let velocityY = {
  value: 0,
  get getY() {
    return this.value;
  },
  set setY(_y) {
    this.value = _y;
  },
};
export let ballSpeed = 0.1;
let moveStartHeight = 0;
let moveStartRadius = 0;
let ballX = 0;
let ballY = 0;

// common functions

// mobile ===================================
export function moveBall() {
  if (ELEMENT_STATE("app", "LEVEL1", ".ball")) return;
  const BALL = document.querySelector(".ball");

  function animateBall() {
    ballX = BALL.offsetLeft + velocityX.value;
    ballY = BALL.offsetTop + velocity.value;

    if (ballX < 0 || ballX + BALL.clientWidth > window.innerWidth) {
      velocityX.setX(-velocityX);
      ballX = BALL.offsetLeft + velocityX.value;
    }
    if (ballY < 0 || ballY + BALL.clientHeight > window.innerHeight) {
      velocityY.setY(-velocityY);
      ballY = BALL.offsetTop + velocityY.value;
    }
    velocityX.value = velocityX.value * 0.98;
    velocityY.value = velocityY.value * 0.98;
    BALL.style.left = `${Math.max(
      0,
      Math.min(ballX, window.innerWidth - BALL.clientWidth)
    )}px`;
    BALL.style.top = `${Math.max(
      0,
      Math.min(ballY, window.innerHeight - BALL.clientHeight)
    )}px`;
    if (Math.abs(velocityX.value) > 0.5 || Math.abs(velocityY.value) > 0.5) {
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
