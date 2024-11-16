// 기본 main 함수
import '../functions/common/common.js';
import { LOADING_EVENT } from '../functions/common/loading.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('default ...');

    // common.js에서 생성한 로딩 제거
    LOADING_EVENT.hide();
  }
};
