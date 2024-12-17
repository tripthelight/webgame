// import errorComn from "../common/errorComn.js";
import { comnText } from '../../functions/module/client/common/language.js';
import screenClickEvent from './screenClickEvent.js';
import setStorageGameResult from '../../functions/module/client/common/setStorageGameResult.js';

export default (_result) => {
  // _result: true => 이김
  // _result: false => 짐
  const GAME_RESULT_POPUP = document.querySelector('.game-result-popup');
  if (GAME_RESULT_POPUP) return;
  const POPUP = document.createElement('div');
  const BG = document.createElement('div');
  const INNER = document.createElement('span');
  const BTN_WRAP = document.createElement('div');
  const BTN_HOME = document.createElement('a');
  const BTN_REPLAY = document.createElement('a');
  BTN_WRAP.classList.add('btn-wrap');
  BTN_HOME.classList.add('btn-move-home');
  BTN_REPLAY.classList.add('btn-replay');
  BTN_HOME.setAttribute('href', 'javascript:viod(0);');
  BTN_REPLAY.setAttribute('href', 'javascript:viod(0);');
  BG.classList.add('bg');
  POPUP.classList.add('game-result-popup');
  BTN_HOME.innerHTML = 'GO HOME';
  BTN_REPLAY.innerHTML = 'REPLAY';
  BTN_HOME.setAttribute('title', 'move page');
  BTN_REPLAY.setAttribute('title', 'move page');
  INNER.innerHTML = _result ? comnText.win : comnText.die;
  BTN_WRAP.appendChild(BTN_REPLAY);
  BTN_WRAP.appendChild(BTN_HOME);
  POPUP.appendChild(BG);
  POPUP.appendChild(INNER);
  POPUP.appendChild(BTN_WRAP);
  const CONTAINER = document.getElementById('container');
  // if (!CONTAINER) errorComn();
  CONTAINER.appendChild(POPUP);

  BTN_HOME.onclick = () => {
    window.sessionStorage.clear();
    location.replace('/');
  };
  BTN_REPLAY.onclick = () => {
    window.sessionStorage.clear();
    location.replace('/taptap');
  };

  setStorageGameResult('taptap', _result);
};
