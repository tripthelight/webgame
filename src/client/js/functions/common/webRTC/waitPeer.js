import { timeInterval_1, timeInterval_500 } from '../variable.js';
import { LOADING_EVENT } from '../loading.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';

let dotAni = null;
let matching = true;

// ENEMY DOT ANIMATION
const enemyDotAni = () => {
  const ENEMY_DOT_L = document.querySelector('.wait .enemy .dot-l');
  const ENEMY_DOT_R = document.querySelector('.wait .enemy .dot-r');
  if (!ENEMY_DOT_L || !ENEMY_DOT_R) return;
  dotAni = setInterval(function () {
    ENEMY_DOT_L.innerText += '.';
    ENEMY_DOT_R.innerText += '.';
    if (ENEMY_DOT_L.innerText.length == 4) ENEMY_DOT_L.innerText = '';
    if (ENEMY_DOT_R.innerText.length == 4) ENEMY_DOT_R.innerText = '';
    if (!matching) clearInterval(dotAni);
  }, timeInterval_500);
};

// WAIT ENEMY SHOW/HIDE
const WAIT_ENEMY = {
  show: (player) => {
    const CONTAINER = document.getElementById('container');
    const WAIT = document.querySelector('.wait');
    if (!WAIT && CONTAINER) {
      let waitEl = document.createElement('div');
      let playerEl = document.createElement('span');
      let enemyEl = document.createElement('span');
      let enemyName = document.createElement('en');
      let enemyDotL = document.createElement('em');
      let enemyDotR = document.createElement('em');
      playerEl.classList.add('player');
      enemyEl.classList.add('enemy');
      enemyName.classList.add('enemy-name');
      enemyDotL.classList.add('dot-l');
      enemyDotR.classList.add('dot-r');
      enemyEl.appendChild(enemyName);
      enemyEl.insertBefore(enemyDotL, enemyEl.firstChild);
      enemyEl.appendChild(enemyDotR);
      playerEl.innerText = player;

      const YOUR_NAME = sessionStorage.getItem('yourName');
      if (YOUR_NAME) {
        const DECODE_YOUR_NAME = fromUnicodePoints(
          YOUR_NAME.replace(/"/g, '')
            .split(',')
            .map((s) => s.trim()),
        );
        enemyName.innerText = DECODE_YOUR_NAME;
      } else {
        enemyName.innerText = 'OPPONENT';
      }

      waitEl.classList.add('wait');
      waitEl.appendChild(playerEl);
      waitEl.appendChild(enemyEl);
      CONTAINER.appendChild(waitEl);
      setTimeout(() => {
        LOADING_EVENT.hide();
      }, timeInterval_1);
    }
  },
  hide: () => {
    if (document.querySelector('.wait')) {
      document.querySelector('.wait').remove();
      setTimeout(() => {
        // LOADING_EVENT.hide();
      }, timeInterval_1);
    }
  },
};

export default function waitPeer(len, nickName) {
  // WAIT ENEMY
  switch (len) {
    case 1:
      // wait Enemy
      WAIT_ENEMY.show(nickName);
      enemyDotAni();
      break;
    case 2:
      // wait end Enemy
      clearInterval(dotAni);
      matching = false;
      WAIT_ENEMY.hide();
      break;
    default:
      // error
      alert(text.err);
      // socket.disconnect();
      window.location.href = '/';
      break;
  }
}
