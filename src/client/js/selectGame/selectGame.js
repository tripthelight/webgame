import '../functions/common/common.js';
import gameName from './gameName.js';
import { LOADING_EVENT } from '../functions/common/loading.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('selectGame init..');
    gameName();
    LOADING_EVENT.hide();
  }
};
