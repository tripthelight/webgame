import { isMobile, ELEMENT_STATE } from "../comnFns.js";

// common variable
let arrowElement = new Object();
let ballElement = new Object();
let wW = window.innerWidth;
let wH = window.innerHeight;

// common functions

// INIT
export function init () {
  // .drag-arrow
  if (ELEMENT_STATE("#app", "#LEVEL1", ".drag-arrow")) return;
  arrowElement = document.querySelector(".drag-arrow");

  // .ball
  if (ELEMENT_STATE("#app", "#LEVEL1", ".ball")) return;
  ballElement = document.querySelector(".ball");
}