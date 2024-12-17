import { dotAni, matching } from "./variable.js";

export default () => {
  const ENEMY_DOT_L = document.querySelector(".wait .enemy .dot-l");
  const ENEMY_DOT_R = document.querySelector(".wait .enemy .dot-r");
  dotAni = setInterval(() => {
    ENEMY_DOT_L.innerText += ".";
    ENEMY_DOT_R.innerText += ".";
    if (ENEMY_DOT_L.innerText.length == 4) ENEMY_DOT_L.innerText = "";
    if (ENEMY_DOT_R.innerText.length == 4) ENEMY_DOT_R.innerText = "";
    if (!matching) clearInterval(dotAni);
  }, 500);
};
