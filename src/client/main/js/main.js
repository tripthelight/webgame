import { LOADING_EVENT } from '../../functions/common/loading.js';
import { userList } from './webSocket/userList.js';
import onlyOneCheckbox from '../../functions/common/onlyOneCheckbox.js';
import initUserName from './popup/modal/initUserName.js';
import changeUserName from './popup/modal/changeUserName.js';
import storageEvent from '../../functions/common/storage/storageEvent.js';
import storageMethod from '../../functions/common/storage/storageMethod.js';

function init() {
  console.log('main init...');
  initUserName();
  changeUserName();
  userList();
  // storageEvent(); // storage event는 마지막에 실행
  LOADING_EVENT.hide();
}

LOADING_EVENT.show();
document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    init();
  }
};

// TODO: 브라우저 새로고침 이벤트 진행 중************
// 모바일 ios 사파리 브라우저에서 beforeunload 적용 안됨
window.addEventListener('beforeunload', () => {
  storageMethod('s', 'SET_ITEM', 'reloaded', 'true');
});

window.addEventListener('load', () => {
  if (sessionStorage.getItem('reloaded') === 'true') {
    console.log('페이지가 새로고침되었습니다.');
    storageMethod('s', 'REMOVE_ITEM', 'reloaded');
  } else {
    console.log('직접 방문했습니다.');
  }
});
