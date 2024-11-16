import '../functions/common/common.js';
import { LOADING_EVENT } from '../functions/common/loading.js';
import initNickName from './modal/initNickName.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('main ...');

    // 접속한 유저의 닉네임이 없으면 생성
    initNickName();

    // common.js에서 생성한 로딩 제거
    LOADING_EVENT.hide();
  }
};
