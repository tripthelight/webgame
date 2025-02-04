import storageMethod from '../../functions/common/storage/storageMethod.js';

export default {
  show: (countStyle) => {
    if (!document.querySelector('.count')) {
      let countEl = document.createElement('div');
      let inner = document.createElement('span');
      storageMethod('s', 'SET_ITEM', 'count', 3);
      inner.innerText = '3';
      countEl.classList.add('count');
      countEl.appendChild(inner);
      const CONTAINER_EL = document.getElementById('container');
      if (CONTAINER_EL) {
        CONTAINER_EL.appendChild(countEl);
        countStyle(inner);
      }
    }
  },
  hide: (countEl) => {
    if (countEl) countEl.remove();
  },
};
