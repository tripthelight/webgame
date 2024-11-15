import '../../../scss/common.scss';
import { LOADING_EVENT } from './loading.js';
import storageEvent from '../../functions/common/storage/storageEvent.js';
import storageMethod from '../../functions/common/storage/storageMethod.js';
import saveLocalStorage from './storage/save/saveLocalStorage.js';
import saveSessionStorage from './storage/save/saveSessionStorage.js';
import appHeight from './appHeight.js';

storageEvent();
LOADING_EVENT.show();
console.log('common js ... ');

const BROWSER_RELOAD = window.sessionStorage.getItem('reloaded');
if (BROWSER_RELOAD && BROWSER_RELOAD === 'true') {
  // 새로고침 하기 전의 localStorage 값 복원
  saveLocalStorage();
  // 새로고침 하기 전의 sessionStorage 값 복원
  saveSessionStorage();

  // 새로고침을 인식하기 위해 sessionStorage에 추가했던 reloaded 삭제
  storageMethod('s', 'REMOVE_ITEM', 'reloaded');
}

// 브라우저 새로고침 시 새로고침 여부 확인
// pagehide는 beforeunload와 달리 모든 브라우저(모바일 포함)를 지원
window.addEventListener('pagehide', (_event) => {
  console.log('unload or hidden.');
  storageMethod('s', 'SET_ITEM', 'reloaded', 'true');
});

// 아이폰 사파리 하단 주소표시줄 대응
appHeight();
