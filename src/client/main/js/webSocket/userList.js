import { ws } from './webSocketHost.js';
import displayUsers from '../displayUsers.js';
import storageEventStore, { updateStorageEvent } from '../../../store/storageEvent.js';
import storageMethod from '../../../functions/common/storage/storageMethod.js';

export const userList = () => {
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('data :::::::: ', data);
    console.log('data.users :: ', data.users);

    if (data.users) {
      if (data.type === 'userList') {
        // displayUsers(data.users);
        storageMethod('s', 'SET_ITEM', 'userList', JSON.stringify(data.users));
        displayUsers();
      }
    } else {
      // socket에 접속한 사용자가 아무도 없을 경우
      // 화면에서 li list 제거
      const userList = document.querySelector('.user-list');
      if (!userList) return;

      const userLists = userList.querySelectorAll('li');
      if (!userLists) return;

      for (let i = 0; i < userLists.length; i++) {
        userLists[i].remove();
      }
    }
  };
};
