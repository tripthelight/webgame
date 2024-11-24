import '../../../scss/common.scss';
import { LOADING_EVENT } from './loading.js';
import storageEvent from '../../functions/common/storage/storageEvent.js';
import refreshEvent from './refreshEvent.js';
import appHeight from './appHeight.js';

console.log('common js ... ');

// 로딩화면 먼저 노출 - 로딩화면은 접속한 화면의 main evnet에서 제거
LOADING_EVENT.show();

// 사용자가 localSotrage, sessionSotrage 값 변경 방지
storageEvent();

// 브라우저 새로고침 이벤트
refreshEvent();

// 아이폰 사파리 하단 주소표시줄 대응
appHeight();

// 확대 기본 동작 방지
document.addEventListener('gesturestart', (event) => {
  event.preventDefault();
});
// 확대 기본 동작 방지
document.addEventListener('gesturechange', (event) => {
  event.preventDefault();
});
// 확대 기본 동작 방지
document.addEventListener('gestureend', (event) => {
  event.preventDefault();
});
