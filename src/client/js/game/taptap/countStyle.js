import cowndown from './cowndown.js';
import { timeInterval_1000, timeInterval_2000, timeInterval_3000, timeInterval_4000 } from '../../functions/common/variable.js';
import gameState from '../../gameState/taptap.js';
import taptapRes from './taptapRes.js';
import storageMethod from '../../functions/common/storage/storageMethod.js';

export default (innerEl) => {
  let ww = window.innerWidth;
  let wh = window.innerHeight;
  let res = 0;
  if (ww <= wh) res = ww - 100;
  else res = wh - 100;
  innerEl.style.width = innerEl.style.height = res + 'px';
  innerEl.style.fontSize = res / 1.5 + 'px';

  setTimeout(() => {
    storageMethod('s', 'SET_ITEM', 'count', 2);
    innerEl.innerText = '2';
  }, timeInterval_1000);
  setTimeout(() => {
    storageMethod('s', 'SET_ITEM', 'count', 1);
    innerEl.innerText = '1';
  }, timeInterval_2000);
  setTimeout(() => {
    innerEl.style.fontSize = res / 3 + 'px';
    innerEl.innerText = 'TAP!';
  }, timeInterval_3000);
  setTimeout(() => {
    window.sessionStorage.removeItem('count');
    cowndown.hide(document.querySelector('.count'));
    storageMethod('s', 'REMOVE_ITEM', 'count');
    // gameState.playing();
    taptapRes.count();
  }, timeInterval_4000);
};
