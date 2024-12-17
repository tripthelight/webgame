import { otherLeavesComn, onDataChannel } from '../../functions/common/webRTC/webRTC.js';

const taptapRes = {
  gameState: () => {
    if (onDataChannel && onDataChannel.readyState === 'open') {
      onDataChannel.send(
        JSON.stringify({
          type: 'gameState',
          data: window.sessionStorage.getItem('gameState'),
        }),
      );
    } else {
      otherLeavesComn();
    }
  },
  waitEnemy: () => {
    taptapRes.gameState();
  },
  count: () => {
    taptapRes.gameState();
  },
};

export default taptapRes;
