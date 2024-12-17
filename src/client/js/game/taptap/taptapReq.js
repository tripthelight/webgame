import gameState from '../../gameState/taptap.js';
import cowndown from './cowndown.js';
import countStyle from './countStyle.js';
import taptapRes from './taptapRes.js';

export default function taptapReq(message) {
  if (message.type === 'gameState') {
    const STATE = window.sessionStorage.getItem('gameState');
    const ORDER_STATE = message.data;
    if (STATE === ORDER_STATE) {
      if (STATE === 'waitEnemy' && ORDER_STATE === 'waitEnemy') {
        gameState.count();
        cowndown.show(countStyle);
      }
      if (STATE === 'count' && ORDER_STATE === 'count') {
        gameState.playing();
      }
    } else {
      setTimeout(taptapRes.gameState, 100);
    }
  }
}
