import { timeInterval_1 } from "../../../js/common/variable.js";
import LOADING from "./loading.js";

export default {
  show: (player) => {
    const CONTAINER = document.getElementById("container");
    const WAIT = document.querySelector(".wait");
    if (!WAIT && CONTAINER) {
      let waitEl = document.createElement("div");
      let playerEl = document.createElement("span");
      let enemyEl = document.createElement("span");
      let enemyName = document.createElement("en");
      let enemyDotL = document.createElement("em");
      let enemyDotR = document.createElement("em");
      playerEl.classList.add("player");
      enemyEl.classList.add("enemy");
      enemyName.classList.add("enemy-name");
      enemyDotL.classList.add("dot-l");
      enemyDotR.classList.add("dot-r");
      enemyEl.appendChild(enemyName);
      enemyEl.insertBefore(enemyDotL, enemyEl.firstChild);
      enemyEl.appendChild(enemyDotR);
      playerEl.innerText = player;
      enemyName.innerText = "OPPONENT";
      waitEl.classList.add("wait");
      waitEl.appendChild(playerEl);
      waitEl.appendChild(enemyEl);
      CONTAINER.appendChild(waitEl);
      setTimeout(() => {
        LOADING.hide();
      }, timeInterval_1);
    }
  },
  hide: () => {
    if (document.querySelector(".wait")) {
      document.querySelector(".wait").remove();
      setTimeout(() => {
        // LOADING.hide();
      }, timeInterval_1);
    }
  },
};
