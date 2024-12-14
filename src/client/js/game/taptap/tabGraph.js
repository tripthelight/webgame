// import { gameOver as setSocketGameOver } from "../../../js/socket/taptap/setSocket.js";
import gameResult from './gameResult.js';
import gameState from '../../../gameState/taptap.js';

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

        // console.log("TOP_BLOCK.style.height >>>>>> ", parseInt(TOP_BLOCK.style.height));
        // console.log(" BOTTOM_BLOCK.style.height >> ", parseInt(BOTTOM_BLOCK.style.height));

        let tHeight = parseInt(TOP_BLOCK.style.height);
        let bHeight = parseInt(BOTTOM_BLOCK.style.height);

        // game result
        if (tHeight <= 0 || bHeight <= 0) {
          gameState.gameOver();
          if (tHeight <= 0) {
            setSocketGameOver('win');
            gameResult(true);
          }
          if (bHeight <= 0) {
            setSocketGameOver('die');
            gameResult(false);
          }
        }
      }
    }
  },
};
