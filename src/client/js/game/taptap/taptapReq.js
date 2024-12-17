import gameState from '../../gameState/taptap.js';
import cowndown from './cowndown.js';
import countStyle from './countStyle.js';
import taptapRes from './taptapRes.js';
import screenClickEvent from './screenClickEvent.js';
import enemyCountResult from '../../functions/module/peerConn/taptap/enemyCountResult.js';

export default function taptapReq(message) {
  if (message.type === 'gameState') {
    const STATE = window.sessionStorage.getItem('gameState');
    const ORDER_STATE = message.data;
    if (STATE === ORDER_STATE) {
      if (STATE === 'waitEnemy' && ORDER_STATE === 'waitEnemy') {
        // waitEnemy => count start
        gameState.count();
        cowndown.show(countStyle);
      }
      if (STATE === 'count' && ORDER_STATE === 'count') {
        // count => playing start
        gameState.playing();
        screenClickEvent.tap();
      }
      if (STATE === 'playing' && ORDER_STATE === 'playing') {
        // playing =>
      }
    } else {
      setTimeout(taptapRes.gameState, 100);
    }
  }

  if (message.type === 'enemyCount') {
    enemyCountResult(message.count);
  }
}
