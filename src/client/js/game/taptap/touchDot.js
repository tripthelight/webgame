import touchDotEnd from './touchDotEnd.js';

// + SCREEN TAP DOT ANIMATION
export default (e) => {
  if (!document.querySelector('.touch-dot')) {
    const TAP_AREA = document.getElementById('gameScene');
    let dotEl = document.createElement('div');
    let inner1 = document.createElement('span');
    let inner2 = document.createElement('span');
    let inner3 = document.createElement('span');
    dotEl.classList.add('touch-dot');
    dotEl.appendChild(inner1);
    dotEl.appendChild(inner2);
    dotEl.appendChild(inner3);
    if (e.clientY <= TAP_AREA.querySelector('.tap-top').clientHeight) {
      dotEl.classList.add('tap-dot-top');
    } else {
      dotEl.classList.add('tap-dot-bottom');
    }
    TAP_AREA.appendChild(dotEl);
    dotEl.style.left = e.clientX - dotEl.clientWidth / 2 + 'px';
    dotEl.style.top = e.clientY - dotEl.clientHeight / 2 + 'px';
    touchDotEnd(dotEl);
  }
};
