import '../../functions/common/common.js';
import { LOADING_EVENT } from '../../functions/common/loading.js';
import webSocketMessage from '../../functions/common/webSocket/webSocketMessage.js';
import webSocketConnect from '../../functions/common/webSocket/webSocketConnect.js';
import webRTC from '../../functions/common/webRTC/webRTC.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('tap tap init..');

    // webSocketMessage();
    // webSocketConnect();
    webRTC();

    LOADING_EVENT.hide();
  }
};
