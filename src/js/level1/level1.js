import { dragArrowInit } from "./dragArrow.js";
import { movingBallInit } from "./movingBall.js";
import { init } from "./init.js";

export function level1() {
  init();
  dragArrowInit();
  movingBallInit();
}
