/**
 * NETWORK : ONLINE || OFFLONE
 */
const OFFLINE_STATE = {
  show: () => {
    if (!document.querySelector('.offline')) {
      if (document.getElementById('container')) document.getElementById('container').classList.add('hide');
      let elem = document.createElement('div');
      let inner = document.createElement('div');
      elem.classList.add('offline');
      inner.classList.add('inner');
      inner.innerText = 'OFFLINE';
      elem.appendChild(inner);
      document.body.appendChild(elem);
    }
  },
  hide: () => {
    if (document.querySelector('.offline')) {
      if (document.getElementById('container')) document.getElementById('container').classList.remove('hide');
      if (document.querySelector('.offline')) {
        let removeEl = document.querySelector('.offline');
        if (document.body.classList.contains('IE')) {
          removeEl.parentNode.removeChild(removeEl);
        } else {
          removeEl.remove();
        }
      }
    }
  },
};

window.addEventListener('online', () => {
  OFFLINE_STATE.hide();
  location.reload();
});
window.addEventListener('offline', () => {
  OFFLINE_STATE.show();
});
