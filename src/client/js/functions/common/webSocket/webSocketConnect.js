import { ws } from './webSocketHost.js';
import errorModal from '../popup/errorModal.js';
import getUnicodePoints from '../unicode/getUnicodePoints.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';

export default function webSocketConnect() {
  // 연결 성공 시 실행
  ws.addEventListener('open', () => {
    console.log('Connection open.');

    const CLIENT_ID = localStorage.getItem('clientId');
    if (!CLIENT_ID) return errorModal();
    const NICK_NAME = localStorage.getItem('nickName');
    if (!NICK_NAME) return errorModal();

    const DECODE_NICK_NAME = fromUnicodePoints(NICK_NAME.split(',').map(Number));

    /*
    if (ws.readyState === WebSocket.OPEN) {
      // WebSocket이 이미 열린 경우 바로 전송
      ws.send(JSON.stringify({ type: 'join', clientId: CLIENT_ID, userId: DECODE_NICK_NAME }));
    } else {
      // WebSocket이 열려 있지 않은 경우 open 이벤트 기다리기
      ws.addEventListener(
        'open',
        () => {
          ws.send(JSON.stringify({ type: 'join', clientId: CLIENT_ID, userId: DECODE_NICK_NAME }));
        },
        { once: true },
      ); // 한 번만 실행되도록 이벤트 리스너 설정
    }
    */
  });

  // 연결이 닫힌 경우 자동으로 재연결
  ws.addEventListener('close', () => {
    console.log('Connection closed. Reconnecting...');
    // LOADING_EVENT.show();
  });

  ws.addEventListener('error', (error) => {
    console.error('WebSocket encountered an error:', error);
  });
}
