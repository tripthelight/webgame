import screenTap from './screenTap.js';
import touchDot from './touchDot.js';
import interaction from './interaction.js';
import tabGraph from './tabGraph.js';

export default {
  tap: () => {
    const TAP_AREA = document.getElementById('gameScene');
    if (TAP_AREA) {
      const TAP_BOTTOM_COUNT = TAP_AREA.querySelector('.tap-bottom .tap-count');
      if (TAP_BOTTOM_COUNT) {
        TAP_AREA.addEventListener('click', (e) => {
          if (window.sessionStorage.gameState !== 'playing') return;
          screenTap(TAP_BOTTOM_COUNT);
          touchDot(e);
          tabGraph.tap();
          interaction.show(Number(window.sessionStorage.getItem('tap-count')) - Number(window.sessionStorage.getItem('enemyCount')));
        });
      }
    }
  },
  untap: () => {
    const TAP_AREA = document.getElementById('gameScene');
    TAP_AREA.removeEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  },
};
