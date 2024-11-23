import { ws } from './webSocketHost.js';
import errorModal from '../popup/errorModal.js';
import getUnicodePoints from '../unicode/getUnicodePoints.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';
import storageMethod from '../storage/storageMethod.js';

export default function webSocketMessage() {
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('data :::::::: ', data);
    console.log('data.users :: ', data.users);

    if (data.users) {
      if (data.type === 'userList') {
        storageMethod('s', 'SET_ITEM', 'userList', JSON.stringify(data.users));
      }
    } else {
      // socket에 접속한 사용자가 아무도 없을 경우
    }
  };
}
