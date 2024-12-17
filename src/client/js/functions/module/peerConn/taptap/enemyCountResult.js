import tabGraph from '../../../../game/taptap/tabGraph.js';
import storageMethod from '../../../common/storage/storageMethod.js';

export default (count) => {
  storageMethod('s', 'SET_ITEM', 'enemyCount', count);
  document.querySelector('.tap-top .tap-count').value = count;
  tabGraph.tap();
};
