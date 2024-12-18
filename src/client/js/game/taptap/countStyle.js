import cowndown from './cowndown.js';
import { timeInterval_1000, timeInterval_2000, timeInterval_3000, timeInterval_4000 } from '../../functions/common/variable.js';
import gameState from '../../gameState/taptap.js';
import taptapRes from './taptapRes.js';
import storageMethod from '../../functions/common/storage/storageMethod.js';

const COUNT_DURATION = 10; // 4초
const TIMER_KEY = 'countdown_end_time';

// 현재 시간을 기준으로 남은 시간을 계산
function getRemainingTime() {
  const endTime = sessionStorage.getItem(TIMER_KEY);
  if (!endTime) {
    return 0; // 초기 값이 없으면 남은 시간을 0으로 설정
  }
  const now = Date.now();
  return Math.max(0, Math.floor((parseInt(endTime, 10) - now) / 1000));
}

// 카운트다운 시작
function startCountdown(innerEl) {
  let remainingTime = getRemainingTime();

  // sessionStorage에 남은 시간이 없으면 새로 설정
  if (remainingTime === 0) {
    const endTime = Date.now() + COUNT_DURATION * 1000;
    storageMethod('s', 'SET_ITEM', TIMER_KEY, endTime);
    remainingTime = COUNT_DURATION;
  }

  // 타이머 업데이트
  updateTimer(innerEl);
}

// 타이머를 화면에 표시
function updateTimer(innerEl) {
  const remainingTime = getRemainingTime();

  // 화면에 남은 시간 표시
  innerEl.innerText = remainingTime;

  if (remainingTime > 0) {
    setTimeout(updateTimer, 1000, innerEl); // 1초 후 다시 업데이트
  } else {
    // 타이머가 끝났을 때 sessionStorage에서 제거
    storageMethod('s', 'REMOVE_ITEM', TIMER_KEY);
    cowndown.hide(document.querySelector('.count'));
    taptapRes.count();
  }
}

export default (innerEl) => {
  let ww = window.innerWidth;
  let wh = window.innerHeight;
  let res = 0;
  if (ww <= wh) res = ww - 100;
  else res = wh - 100;
  innerEl.style.width = innerEl.style.height = res + 'px';
  innerEl.style.fontSize = res / 1.5 + 'px';
  startCountdown(innerEl);
  /*
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
  */
};
