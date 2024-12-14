import '../../../scss/game/taptap/common.scss';
import '../../functions/common/common.js';
import { LOADING_EVENT } from '../../functions/common/loading.js';
import webRTC from '../../functions/common/webRTC/webRTC.js';

document.onreadystatechange = async () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('tap tap init..');

    // LOADING_EVENT.hide();

    webRTC('taptap');
  }
};
