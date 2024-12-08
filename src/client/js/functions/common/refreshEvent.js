import storageMethod from './storage/storageMethod.js';
import saveLocalStorage from './storage/save/saveLocalStorage.js';
import saveSessionStorage from './storage/save/saveSessionStorage.js';

export default function refreshEvent() {
  // 브라우저 새로고침 시 새로고침 여부 확인
  // pagehide는 beforeunload와 달리 모든 브라우저(모바일 포함)를 지원
  window.addEventListener('pagehide', (_event) => {
    console.log('unload or hidden.');
    storageMethod('s', 'SET_ITEM', 'reloaded', 'true');
  });

  const BROWSER_RELOAD = sessionStorage.getItem('reloaded');
  if (BROWSER_RELOAD && BROWSER_RELOAD === 'true') {
    // 새로고침 하기 전의 localStorage 값 복원
    saveLocalStorage();
    // 새로고침 하기 전의 sessionStorage 값 복원
    saveSessionStorage();

    const roomName = sessionStorage.getItem('roomName');
    const yourName = sessionStorage.getItem('yourName');
    const ROUTES = {
      taptap: '/game/taptap',
      indianPocker: '/game/indianPocker',
      blackAndWhite: '/game/blackAndWhite',
      findTheSamePicture: '/game/findTheSamePicture',
    };
    const routeKey = location.pathname.split('/').pop(); // '/game/...' 게임명을 추출

    // 게임 화면인데, roomName과 yourName이 있으면 둘이 입장한 상태임
    // 둘이 입장한 상태에서만 따발총 새로고침 delay
    if (ROUTES.hasOwnProperty(routeKey) && roomName && yourName) {
      // 게임 화면
      // 새로고침을 인식하기 위해 sessionStorage에 추가했던 reloaded 삭제
      setTimeout(() => {
        storageMethod('s', 'REMOVE_ITEM', 'reloaded');
      }, 500);
    } else {
      // 게임 화면 아님
      // 새로고침을 인식하기 위해 sessionStorage에 추가했던 reloaded 삭제
      storageMethod('s', 'REMOVE_ITEM', 'reloaded');
    }
  }
}
