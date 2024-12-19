import gameState from '../../gameState/taptap.js';
import cowndown from './cowndown.js';
import countStyle from './countStyle.js';
import taptapRes from './taptapRes.js';
import screenClickEvent from './screenClickEvent.js';
import enemyCountResult from '../../functions/module/peerConn/taptap/enemyCountResult.js';
import gameResult from './gameResult.js';
import taptapRe from '../../refresh/taptap/taptapRe.js';
import LOADING from '../../functions/module/client/common/loading.js';

export default function taptapReq(message) {
  if (message.type === 'gameState') {
    const STATE = window.sessionStorage.getItem('gameState');
    const ORDER_STATE = message.data;
    if (STATE === ORDER_STATE) {
      if (STATE === 'waitEnemy' && ORDER_STATE === 'waitEnemy') {
        console.log('step 3 ::: ');
        // waitEnemy => count start
        gameState.count();
        cowndown.show(countStyle);
      }
      if (STATE === 'count' && ORDER_STATE === 'count') {
        console.log('step 4 ::: ');
        // count => playing start
        taptapRes.endCount();
        console.log('send endCount 1 >>>>>>>>>>>>>>>');
        gameState.playing();
        screenClickEvent.tap();
      }
      if (STATE === 'playing' && ORDER_STATE === 'playing') {
        // console.log('step 4 ::: ');
        // gameState.playing();
        // screenClickEvent.tap();
      }
    } else {
      setTimeout(taptapRes.gameState, 100);
    }
  }

  if (message.type === 'endCount') {
    console.log('receive endCount 2 >>>>>>>>>>>>>>>');

    LOADING.hide();
    gameState.playing();
    screenClickEvent.tap();
  }

  if (message.type === 'enemyCount') {
    enemyCountResult(message.count);
  }

  if (message.type === 'gameOver') {
    gameResult(message.result);
  }

  if (message.type === 'gameStateRe') {
    const receive = () => {
      const STATE = window.sessionStorage.getItem('gameState');
      const ORDER_STATE = message.gameState;

      if (STATE === ORDER_STATE) {
        if (STATE === 'count' && ORDER_STATE === 'count') {
          return 'sameCount';
        }
        if (STATE === 'playing' && ORDER_STATE === 'playing') {
          return 'samePlaying';
        }
        if (STATE === 'gameOver' && ORDER_STATE === 'gameOver') {
          return 'sameGameOver';
        }
      } else {
        if (STATE === 'count') {
          if (ORDER_STATE === 'playing') {
            return 'stepMovePlaying';
          }
          if (ORDER_STATE === 'gameOver') {
            return 'stepMoveGameOver';
          }
        }
        if (STATE === 'playing') {
          if (ORDER_STATE === 'count') {
            return 'stepMovePlayingOther';
          }
          if (ORDER_STATE === 'gameOver') {
            return 'stepMoveGameOver';
          }
        }
        if (STATE === 'gameOver') {
          if (ORDER_STATE === 'count') {
            return 'stepMoveGameOverOther';
          }
          if (ORDER_STATE === 'playing') {
            return 'stepMovePlayingOther';
          }
        }
      }
      return '';
    };
    taptapRe(receive());
  }
}
