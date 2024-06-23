import {isMobile, ELEMENT_STATE} from "../comnFns.js";
import {lastMoveX, lastMoveY, ballDistance, ballAngleRad, distanceFactor, velocityX, velocityY, ballSpeed, moveBall} from "./movingBall.js";

// common variable
let arrowElem = document.querySelector(".drag-arrow");
let dragType = "default";
let sPos = {x: 0, y: 0};
let mPos = {x: 0, y: 0};
let aPos = {x: 0, y: 0};
let currentRotation = 0;
let initialHeight = arrowElem.clientHeight;
let isDragging = false;
let finalHeight = initialHeight;

// common functions
function removeStyle(_elem) {
  if (_elem.style.removeProperty) {
    _elem.style.removeProperty("opacity");
    _elem.style.removeProperty("height");
    _elem.style.removeProperty("transform");
    _elem.style.removeProperty("transform-origin");
  } else {
    _elem.style.removeAttribute("opacity");
    _elem.style.removeAttribute("height");
    _elem.style.removeAttribute("transform");
    _elem.style.removeAttribute("transform-origin");
  }
}

const TRANSLATE_VALUE = () => {
  let value = {
    translate: "",
    origin: "",
  };
  if (dragType === "center") {
    value.translate = "-50%, 0";
    value.origin = "center top";
  } else {
    value.translate = "-50%, -50%";
    value.origin = "center center";
  }
  return {
    translate: value.translate,
    origin: value.origin,
  };
};

const TRANSLATE_MOVE_VALUE = _elem => {
  const STYLE = window.getComputedStyle(_elem);
  const TRANSFORM = STYLE.transform;
  const VALUES = TRANSFORM.match(/matrix.*\((.+)\)/)[1].split(", ");
  aPos.x = parseFloat(VALUES[4]);
  aPos.y = parseFloat(VALUES[5]);
  if (dragType === "center") {
    aPos.y = parseFloat(VALUES[5]) + arrowElem.clientWidth / 2;
  }
};

// mobile ===================================
function dragArrowMoStart(_event) {
  initialHeight = arrowElem.clientHeight;
  finalHeight = initialHeight;
  _event.target.style.opacity = 1;
  const {touches, changeTouches} = _event.originalEvent ?? _event;
  const TOUCH = touches[0] ?? changeTouches[0];
  sPos.x = TOUCH.clientX;
  sPos.y = TOUCH.clientY;
  TRANSLATE_MOVE_VALUE(_event.target);
}

function dragArrowMoMove(_event) {
  const {touches, changeTouches} = _event.originalEvent ?? _event;
  const TOUCH = touches[0] ?? changeTouches[0];
  mPos.x = TOUCH.clientX - sPos.x;
  mPos.y = TOUCH.clientY - sPos.y;

  let angle = Math.round(Math.atan2(mPos.x, mPos.y) * (180 / Math.PI));
  currentRotation = -angle;
  _event.target.style.transformOrigin = `${TRANSLATE_VALUE().origin}`;
  _event.target.style.transform = `translate(${aPos.x}px, ${aPos.y}px) rotate(${currentRotation}deg)`;

  let distance = Math.sqrt(mPos.x * mPos.x + mPos.y * mPos.y);
  finalHeight = Math.round(initialHeight + distance);
  _event.target.style.height = `${finalHeight}px`;

  lastMoveX.x = mPos.x;
  lastMoveY.y = mPos.y;

  _event.preventDefault();
}

function dragArrowMoEnd(_event) {
  // start move ball
  distanceFactor.setValue = finalHeight / initialHeight;
  ballDistance.setValue = Math.sqrt(lastMoveX.x * lastMoveX.x + lastMoveY.y * lastMoveY.y) * distanceFactor.getValue * ballSpeed;
  ballAngleRad.setValue = Math.atan2(lastMoveY.y, lastMoveX.x);
  velocityX.x = -ballDistance.getValue * Math.cos(ballAngleRad.getValue);
  velocityY.y = -ballDistance.getValue * Math.sin(ballAngleRad.getValue);
  moveBall();

  // reset
  sPos.x = 0;
  sPos.y = 0;
  mPos.x = 0;
  mPos.y = 0;
  removeStyle(_event.target);

  if (!_event.target.classList.contains("moving")) {
    _event.target.classList.add("moving");
  }
}

// PC =======================================
function startInteraction(_x, _y) {
  isDragging = true;
  sPos.x = _x;
  sPos.y = _y;
  TRANSLATE_MOVE_VALUE(arrowElem);
}

function moveInteraction(_x, _y) {
  if (!isDragging) return;
  mPos.x = _x - sPos.x;
  mPos.y = _y - sPos.y;

  let angle = Math.round(Math.atan2(mPos.x, mPos.y) * (180 / Math.PI));
  currentRotation = -angle;
  arrowElem.style.transformOrigin = `${TRANSLATE_VALUE().origin}`;

  arrowElem.style.transform = `translate(${aPos.x}px, ${aPos.y}px) rotate(${currentRotation}deg)`;

  let distance = Math.sqrt(mPos.x * mPos.x + mPos.y * mPos.y);
  finalHeight = Math.round(initialHeight + distance);
  arrowElem.style.height = `${finalHeight}px`;

  lastMoveX.x = mPos.x;
  lastMoveY.y = mPos.y;
}

function endInteraction() {
  isDragging = false;

  // start move ball
  distanceFactor.setValue = finalHeight / initialHeight;
  ballDistance.setValue = Math.sqrt(lastMoveX.x * lastMoveX.x + lastMoveY.y * lastMoveY.y) * distanceFactor.getValue * ballSpeed;
  ballAngleRad.setValue = Math.atan2(lastMoveY.y, lastMoveX.x);
  velocityX.x = -ballDistance.getValue * Math.cos(ballAngleRad.getValue);
  velocityY.y = -ballDistance.getValue * Math.sin(ballAngleRad.getValue);
  moveBall();

  // reset
  sPos.x = 0;
  sPos.y = 0;
  mPos.x = 0;
  mPos.y = 0;
  removeStyle(arrowElem);
}

function dragArrowPcStart(_event) {
  const IMG = new Image();
  IMG.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  _event.dataTransfer.setDragImage(IMG, 0, 0);
  _event.dataTransfer.setData("text/plain", "Dragging element");
  _event.dataTransfer.effectAllowed = "move";
  arrowElem.style.opacity = 1;
  arrowElem.classList.add("dragging");
  startInteraction(_event.clientX, _event.clientY);
}

function dragArrowPcMove(_event) {
  moveInteraction(_event.clientX, _event.clientY);
}

function dragArrowPcEnd(_event) {
  arrowElem.classList.remove("dragging");
  endInteraction();
  if (!arrowElem.classList.contains("moving")) {
    arrowElem.classList.add("moving");
  }
}

function dragArrow(_type) {
  if (_type) {
    dragType = _type;
  }

  if (isMobile()) {
    // mobile
    arrowElem.addEventListener("touchstart", dragArrowMoStart, false);
    arrowElem.addEventListener("touchmove", dragArrowMoMove, false);
    arrowElem.addEventListener("touchend", dragArrowMoEnd, false);
  } else {
    // PC
    arrowElem.addEventListener("dragstart", dragArrowPcStart, false);
    arrowElem.addEventListener("dragover", dragArrowPcMove, false);
    arrowElem.addEventListener("dragend", dragArrowPcEnd, false);
  }
}

// INIT
export function dragArrowInit() {
  if (isMobile()) {
    // mobile
    arrowElem.removeAttribute("draggable");
    arrowElem.removeEventListener("dragstart", dragArrowPcStart, false);
    arrowElem.removeEventListener("dragover", dragArrowPcMove, false);
    arrowElem.removeEventListener("dragend", dragArrowPcEnd, false);
  } else {
    // PC
    arrowElem.setAttribute("draggable", "true");
    arrowElem.removeEventListener("touchstart", dragArrowMoStart, false);
    arrowElem.removeEventListener("touchmove", dragArrowMoMove, false);
    arrowElem.removeEventListener("touchend", dragArrowMoEnd, false);
  }

  // init function
  dragArrow("center");
}

window.addEventListener("resize", () => {
  // arrow 의 위치 비율
  dragArrowInit();
});
