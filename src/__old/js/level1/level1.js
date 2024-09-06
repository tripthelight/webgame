import {dragArrowInit} from "./dragArrow.js";
import {movingBallInit} from "./movingBall.js";
import {init} from "./init.js";

export function level1() {
  init();
  dragArrowInit();
  movingBallInit();

  // center mark
  const CENTER_MART = document.createElement("div");
  // CENTER_MART.classList.add("center-mark");
  // const LEVEL1_ELEM = document.getElementById("LEVEL1");
  // LEVEL1_ELEM.appendChild(CENTER_MART);
}
