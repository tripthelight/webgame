import storageMethod from '../functions/common/storage/storageMethod.js';

export default {
  waitEnemy: () => {
    storageMethod('s', 'SET_ITEM', 'gameState', 'waitEnemy');
  },
  count: () => {
    storageMethod('s', 'SET_ITEM', 'gameState', 'count');
  },
  playing: () => {
    storageMethod('s', 'SET_ITEM', 'gameState', 'playing');
  },
  gameOver: () => {
    storageMethod('s', 'SET_ITEM', 'gameState', 'gameOver');
  },
};
