import { deviceCheck } from "./deviceCheck.js";
/**
 * WINDOW RESIZE
 */
const resizeElem = () => {
  if (document.querySelector(".inner-square.active")) {
    document.querySelector(".inner-square.active").style.width = window.innerWidth - 80 + "px";
  }
};
window.addEventListener("resize", () => {
  deviceCheck();
  resizeElem();
});
