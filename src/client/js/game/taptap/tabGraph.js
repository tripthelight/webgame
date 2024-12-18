import gameResult from './gameResult.js';
import gameState from '../../gameState/taptap.js';
import taptapRes from './taptapRes.js';

export default {
  tap: () => {
    const TOP_BLOCK = document.querySelector('.tap-top');
    const BOTTOM_BLOCK = document.querySelector('.tap-bottom');
    if (TOP_BLOCK && BOTTOM_BLOCK) {
      const TOP_COUNT = TOP_BLOCK.querySelector('.tap-top .tap-count');
      const BOTTOM_COUNT = BOTTOM_BLOCK.querySelector('.tap-bottom .tap-count');
      if (TOP_COUNT && BOTTOM_COUNT) {
        let topValue = parseInt(TOP_COUNT.value);
        let bottomValue = parseInt(BOTTOM_COUNT.value);
        TOP_BLOCK.style.height = 50 + Math.ceil(topValue - bottomValue) + '%';
        BOTTOM_BLOCK.style.height = 50 + Math.ceil(bottomValue - topValue) + '%';

        let tHeight = parseInt(TOP_BLOCK.style.height);
        let bHeight = parseInt(BOTTOM_BLOCK.style.height);

        // game result
        if (tHeight <= 0 || bHeight <= 0) {
          gameState.gameOver();
          if (tHeight <= 0) {
            taptapRes.gameOver('win');
            gameResult(true);
          }
          if (bHeight <= 0) {
            taptapRes.gameOver('die');
            gameResult(false);
          }
        }
      }
    }
  },
};
