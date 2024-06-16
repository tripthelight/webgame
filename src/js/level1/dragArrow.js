import { isMobile, ELEMENT_STATE } from "../comnFns.js";
import {
  lastMoveX,
  lastMoveY,
  ballDistance,
  ballAngleRad,
  distanceFactor,
  velocityX,
  velocityY,
  ballSpeed,
  moveBall,
} from "./movingBall.js";

// common variable
let dragType = "default";
let sPos = { x: 0, y: 0 };
let mPos = { x: 0, y: 0 };
let currentRotation = 0;
let initialHeight = 50;
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
    value.translate = "-50%, 0%";
    value.origin = "center top";
  } else {
    value.translate = "-50%, 50%";
    value.origin = "center center";
  }
  return {
    translate: value.translate,
    origin: value.origin,
  };
};

// mobile ===================================
function dragArrowMoStart(_event) {
  _event.target.style.opacity = 1;
  const { touches, changeTouches } = _event.originalEvent ?? _event;
  const TOUCH = touches[0] ?? changeTouches[0];
  sPos.x = TOUCH.clientX;
  sPos.x = TOUCH.clientY;
}

function dragArrowMoMove(_event) {
  const { touches, changeTouches } = _event.originalEvent ?? _event;
  const TOUCH = touches[0] ?? changeTouches[0];
  mPos.x = TOUCH.clientX - sPos.x;
  mPos.y = TOUCH.clientY - sPos.y;

  let angle = Math.atan2(mPos.x, mPos.y) * (180 / Math.PI);
  currentRotation = -angle;
  _event.target.style.transformOrigin = `${TRANSLATE_VALUE().origin}`;
  _event.target.style.transform = `translate(${
    TRANSLATE_VALUE().translate
  }) rotate(${currentRotation}deg)`;

  let distance = Math.sqrt(mPos.x * mPos.x + mPos.y + mPos.y);
  finalHeight = initialHeight + distance;
  _event.target.style.height = `${finalHeight}px`;

  lastMoveX.value = mPos.x;
  lastMoveY.value = mPos.y;

  _event.preventDefault();
}

function dragArrowMoEnd(_event) {
  // start move ball
  distanceFactor.value = finalHeight / initialHeight;
  ballDistance.value =
    Math.sqrt(
      lastMoveX.value * lastMoveX.value + lastMoveY.value * lastMoveY.value
    ) *
    distanceFactor.value *
    ballSpeed;
  ballAngleRad.value = Math.atan2(lastMoveY.value, lastMoveX.value);
  velocityX.value = -ballDistance.value * Math.cos(ballAngleRad.value);
  velocityY.value = -ballDistance.value * Math.sin(ballAngleRad.value);
  moveBall();

  // reset
  sPos.x = 0;
  sPos.y = 0;
  mPos.x = 0;
  mPos.y = 0;
  removeStyle(_event.target);
}

// PC =======================================
function startInteraction(_x, _y) {
  sPos.x = _x;
  sPos.y = _y;
  isDragging = true;
}

function moveInteraction(_x, _y, _elem) {
  // const APP_ELEM = document.getElementById("app");
  // if (!APP_ELEM) return;
  // const LEVEL1_ELEM = APP_ELEM.getElementById("LEVEL1");
  // if (!LEVEL1_ELEM) return;
  // const ARROW_ELEM = LEVEL1_ELEM.querySelector("drag-arrow");
  // if (!ARROW_ELEM) return;
  if (ELEMENT_STATE("#app", "#LEVEL1", ".drag-arrow")) return;
  mPos.x = _x - sPos.x;
  mPos.y = _y - sPos.y;

  // ///////////////
  let angle = Math.atan2(mPos.x, mPos.y) * (180 / Math.PI);
  currentRotation = -angle;
  _elem.style.transformOrigin = `${TRANSLATE_VALUE().origin}`;
  _elem.style.transform = `translate(${
    TRANSLATE_VALUE().translate
  }) rotate(${currentRotation}deg)`;

  let distance = Math.sqrt(mPos.x * mPos.x + mPos.y + mPos.y);
  finalHeight = initialHeight + distance;
  _elem.style.height = `${finalHeight}px`;
}

function endInteraction(_elem) {
  isDragging = false;
  removeStyle(_elem);
}

function dragArrowPcStart(_event) {
  _event.target.style.opacity = 1;
  const IMG = new Image();
  IMG.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  _event.dataTransfer.setDragImage(IMG, 0, 0);
  _event.dataTransfer.setData("text/plain", "Dragging element");
  _event.target.classList.add("dragging");
  _event.dataTransfer.effectAllowed = "move";
  startInteraction(_event.clientX, _event.clientY);
}

function dragArrowPcMove(_event) {
  moveInteraction(_event.clientX, _event.clientY, _event.target);
}

function dragArrowPcEnd(_event) {
  _event.target.classList.remove("dragging");
  endInteraction(_event.target);
}

function dragArrow(_type) {
  if (ELEMENT_STATE("#app", "#LEVEL1", ".drag-arrow")) return;
  const ARROW_ELEM = document.querySelector(".drag-arrow");

  if (_type) {
    dragType = _type;
  }

  if (isMobile()) {
    // mobile
    ARROW_ELEM.addEventListener("touchstart", dragArrowMoStart, false);
    ARROW_ELEM.addEventListener("touchmove", dragArrowMoMove, false);
    ARROW_ELEM.addEventListener("touchend", dragArrowMoEnd, false);
  } else {
    // PC
    ARROW_ELEM.addEventListener("dragstart", dragArrowPcStart, false);
    ARROW_ELEM.addEventListener("drag", dragArrowPcMove, false);
    ARROW_ELEM.addEventListener("dragend", dragArrowPcEnd, false);
  }
}

// INIT
export function dragArrowInit() {
  if (ELEMENT_STATE("#app", "#LEVEL1", ".drag-arrow")) return;
  const ARROW_ELEM = document.querySelector(".drag-arrow");
  if (isMobile()) {
    // mobile
    ARROW_ELEM.removeAttribute("draggable");
    ARROW_ELEM.removeEventListener("dragstart", dragArrowPcStart, false);
    ARROW_ELEM.removeEventListener("drag", dragArrowPcMove, false);
    ARROW_ELEM.removeEventListener("dragend", dragArrowPcEnd, false);
  } else {
    // PC
    ARROW_ELEM.setAttribute("draggable", "true");
    ARROW_ELEM.removeEventListener("touchstart", dragArrowMoStart, false);
    ARROW_ELEM.removeEventListener("touchmove", dragArrowMoMove, false);
    ARROW_ELEM.removeEventListener("touchend", dragArrowMoEnd, false);
  }

  // init function
  dragArrow("center");
}
