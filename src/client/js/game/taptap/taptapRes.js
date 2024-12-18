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
  playing: () => {
    taptapRes.gameState();
  },
  tapCount: (count) => {
    if (onDataChannel && onDataChannel.readyState === 'open') {
      onDataChannel.send(
        JSON.stringify({
          type: 'enemyCount',
          count: count,
        }),
      );
    } else {
      otherLeavesComn();
    }
  },
  gameOver: (result) => {
    if (onDataChannel && onDataChannel.readyState === 'open') {
      onDataChannel.send(
        JSON.stringify({
          type: 'gameOver',
          result: result === 'win' ? true : false,
        }),
      );
    } else {
      otherLeavesComn();
    }
  },
};

export default taptapRes;
