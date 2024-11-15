import '../functions/common/common.js';
import { LOADING_EVENT } from '../functions/common/loading.js';
import initNickName from './modal/initNickName.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('main ...');
    initNickName();
    LOADING_EVENT.hide();
  }
};
