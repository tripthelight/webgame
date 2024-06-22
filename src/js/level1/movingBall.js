import { isMobile, ELEMENT_STATE } from "../comnFns.js";

// common variable
export const lastMoveX = {
  value: 0,
  get x() { return this.value; },
  set x(_x) { this.value = _x; },
};
export const lastMoveY = {
  value: 0,
  get y() { return this.value; },
  set y(_y) { this.value = _y; },
};
export const ballDistance = {
  value: 0,
  get getValue() { return this.value; },
  set setValue(_val) { this.value = _val; },
};
export const ballAngleRad = {
  value: 0,
  get getValue() { return this.value; },
  set setValue(_val) { this.value = _val; },
};
export const distanceFactor = {
  value: 0,
  get getValue() { return this.value; },
  set setValue(_val) { this.value = _val; },
};
export const velocityX = {
  value: 0,
  get x() { return this.value; },
  set x(_x) { this.value = _x; },
};
export const velocityY = {
  value: 0,
  get y() { return this.value; },
  set y(_y) { this.value = _y; },
};
export const ballSpeed = 0.1;
let ballX = window.innerWidth / 2;
let ballY = window.innerHeight / 2;
let ballW = 0;
let ballH = 0;
let ballElement = new Object();
let arrowElement = new Object();
let windowInitialW = 0;
let windowInitialH = 0;

// common functions
function findTransform (_elem) {
  const style = window.getComputedStyle(_elem);
  const transform = style.transform;
  let translateX = 0;
  let translateY = 0;
  if (transform !== 'none') {
    const values = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
    translateX = parseFloat(values[4]);
    translateY = parseFloat(values[5]);
  }
  return {
    x: translateX,
    y: translateY
  }
}

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
  `
  arrowElement.style.transform = result;
  ballElement.style.transform = result;

  setTimeout(() => {
    windowInitialW = window.innerWidth;
    windowInitialH = window.innerHeight;
  }, 1);
}

// mobile ===================================
export function moveBall() {
  ballW = ballElement.clientWidth / 2;
  ballH = ballElement.clientHeight / 2;
  ballElement.classList.add("moving");

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
    ballElement.style.transform = `translate(${Math.floor(ballX - ballW)}px, ${ Math.floor(ballY - ballH) }px)`;
    if (Math.abs(velocityX.x) > 0.5 || Math.abs(velocityY.y) > 0.5) {
      requestAnimationFrame(animateBall);
    } else {
      arrowElement.style.transform = `translate(${Math.floor(ballX - ballW)}px, ${ Math.floor(ballY - ballH) }px)`;
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
  // .drag-arrow
  if (ELEMENT_STATE("#app", "#LEVEL1", ".drag-arrow")) return;
  arrowElement = document.querySelector(".drag-arrow");

  // .ball
  if (ELEMENT_STATE("#app", "#LEVEL1", ".ball")) return;
  ballElement = document.querySelector(".ball");
  ballX -= (ballElement.clientWidth / 2);
  ballY -= (ballElement.clientHeight / 2);

  windowInitialW = window.innerWidth;
  windowInitialH = window.innerHeight;
}

window.addEventListener('resize', () => {
  // ball 의 위치 비율
  if (
    arrowElement.classList.contains("moving") &&
    ballElement.classList.contains("moving")
  ) adjustBallPosition();
})
