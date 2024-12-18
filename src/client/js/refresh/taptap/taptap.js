import tabGraph from '../../game/taptap/tabGraph.js';

export default {
  tapGraph: () => {
    const eNum = sessionStorage.getItem('enemyCount');
    const pNum = sessionStorage.getItem('tap-count');
    document.querySelector('.tap-bottom .tap-count').value = pNum ? Number(pNum) : 0;
    document.querySelector('.tap-top .tap-count').value = eNum ? Number(eNum) : 0;
    tabGraph.tap();
  },
};
