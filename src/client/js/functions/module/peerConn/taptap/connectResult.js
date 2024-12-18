import pageAccessedByReload from '../../client/common/pageAccessedByReload.js';
import refreshEvent from '../../../../refresh/taptap/taptap.js';
import LOADING from '../../client/common/loading.js';
import taptapRes from '../../../../game/taptap/taptapRes.js';
import screenClickEvent from '../../../../game/taptap/screenClickEvent.js';
import storageMethod from '../../../common/storage/storageMethod.js';
import gameState from '../../../../gameState/taptap.js';

export default () => {
  if (pageAccessedByReload) {
    if (window.sessionStorage.gameState === 'gameOver') {
      refreshEvent.tapGraph();
    } else if (window.sessionStorage.gameState === 'count') {
      LOADING.show();
      console.log('count >>>>> ');
      if (window.sessionStorage.count) {
        let cnt = Number(window.sessionStorage.count);
        if (cnt > 0) {
          const CNT_INTERVAL = setInterval(() => {
            console.log('interval >>> ');
            if (cnt <= 0) {
              clearInterval(CNT_INTERVAL);
              storageMethod('s', 'REMOVE_ITEM', 'count');
              gameState.playing();
              taptapRes.playing();
            }
            cnt--;
            storageMethod('s', 'SET_ITEM', 'count', cnt);
          }, 1000);
        } else {
          storageMethod('s', 'REMOVE_ITEM', 'count');
          gameState.playing();
          taptapRes.playing();
        }
      }
      // window.sessionStorage.count
    } else if (window.sessionStorage.gameState === 'playing') {
      // setSocketGameState("playing");
      storageMethod('s', 'REMOVE_ITEM', 'count');
      refreshEvent.tapGraph();
      screenClickEvent.tap();
    } else {
      refreshEvent.tapGraph();
    }
  } else {
    console.log('step 2 ::: ');
    taptapRes.waitEnemy();
    storageMethod('s', 'SET_ITEM', 'tap-count', 0);
  }
};
