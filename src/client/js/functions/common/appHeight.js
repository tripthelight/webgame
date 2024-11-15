function setInnerHeight() {
  const { innerHeight } = window;
  document.documentElement.style.setProperty('--app-height', `${innerHeight}px`);
}

export default function appHeight() {
  // 아이폰 사파리 하단 주소표시줄 대응
  setInnerHeight();

  window.addEventListener('resize', () => {
    setInnerHeight();
  });
}
