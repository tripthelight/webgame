import '../../functions/common/common.js';
import { LOADING_EVENT } from '../../functions/common/loading.js';
import webRTC from '../../functions/common/webRTC/webRTC.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('tap tap init..');

    webRTC('taptap');

    // LOADING_EVENT.hide();
  }
};
