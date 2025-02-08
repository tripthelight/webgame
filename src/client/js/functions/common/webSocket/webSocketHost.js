import ReconnectingWebSocket from 'reconnecting-websocket';
import { LOADING_EVENT } from '../../../functions/common/loading.js';

// export const ws = new ReconnectingWebSocket('ws://localhost:8080', [], {
export const ws = new ReconnectingWebSocket('ws://58.72.192.17:8080', [], {
  reconnectInterval: 1000, // 1초 간격으로 재연결 시도
  maxRetries: 10, // 최대 재연결 시도 횟수
});

/*
// 연결 성공 시 실행
ws.addEventListener('open', () => {
  console.log('Connection open.');
});

// 연결이 닫힌 경우 자동으로 재연결
ws.addEventListener('close', () => {
  console.log('Connection closed. Reconnecting...');
  // LOADING_EVENT.show();
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket encountered an error:', error);
});
*/
