import '../../functions/common/common.js';
import { LOADING_EVENT } from '../../functions/common/loading.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('blackAndWhite init..');

    LOADING_EVENT.hide();
  }
};
