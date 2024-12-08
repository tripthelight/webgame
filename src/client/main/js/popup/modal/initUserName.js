import { ws } from '../../webSocket/webSocketHost.js';
import { v4 as uuidv4 } from 'uuid';
import createModal from '../../../../functions/common/popup/createModal.js';
import msg_str from '../../../../functions/common/msg_str.js';
import errorNameEvent from '../errorNameEvent.js';
import fromUnicodePoints from '../../../../functions/common/unicode/fromUnicodePoints.js';
import getUnicodePoints from '../../../../functions/common/unicode/getUnicodePoints.js';
import storageMethod from '../../../../functions/common/storage/storageMethod.js';
import displayUsers from '../../displayUsers.js';
import storageDataStore, { updateLocalStorageData, updateSessionStorageData } from '../../../../store/storageData.js';
import saveLocalStorage from '../../../../functions/common/storage/save/saveLocalStorage.js';
import saveSessionStorage from '../../../../functions/common/storage/save/saveSessionStorage.js';

export default function initUserName() {
  const MAIN_ELEM = document.querySelector('.main');
  if (!MAIN_ELEM) return;

  const USER_NAME_ELEM = MAIN_ELEM.querySelector('.user-name');
  if (!USER_NAME_ELEM) return;

  const INIT_NAME_ELEM = USER_NAME_ELEM.querySelector('.init-name');
  if (!INIT_NAME_ELEM) return;

  const CLIENT_ID = localStorage.getItem('clientId') ? localStorage.getItem('clientId') : uuidv4();

  // localStorage의 userName은 string[] 로 저장됨
  const INIT_USER_NAME = localStorage.getItem('userName');

  const BROWSER_RELOAD = sessionStorage.getItem('reloaded');

  if (INIT_USER_NAME) {
    const userName = fromUnicodePoints(
      INIT_USER_NAME.replace(/"/g, '')
        .split(',')
        .map((s) => s.trim()),
    );
    INIT_NAME_ELEM.innerHTML = userName;

    // ===============================================================
    // 브라우저 새로고침 일 경우 return
    if (BROWSER_RELOAD && BROWSER_RELOAD === 'true') {
      // 새로고침 하기 전 localStorage 복원
      saveLocalStorage();
      // 새로고침 하기 전 sessionStorage 복원
      saveSessionStorage();

      // 새로고침을 인식하기 위해 sessionStorage에 추가했던 reloaded 삭제
      storageMethod('s', 'REMOVE_ITEM', 'reloaded');
      // return;
    }
    // ===============================================================

    if (ws.readyState === WebSocket.OPEN) {
      // WebSocket이 이미 열린 경우 바로 전송
      ws.send(JSON.stringify({ type: 'join', clientId: CLIENT_ID, userId: userName }));
    } else {
      // WebSocket이 열려 있지 않은 경우 open 이벤트 기다리기
      ws.addEventListener(
        'open',
        () => {
          ws.send(JSON.stringify({ type: 'join', clientId: CLIENT_ID, userId: userName }));
        },
        { once: true },
      ); // 한 번만 실행되도록 이벤트 리스너 설정
    }
  } else {
    const MODAL_POPUP = document.querySelector('.init-user-name');
    if (MODAL_POPUP) return;

    const { MODAL_POP_WRAP, TITLE_EL, BODY_EL, MODAL_OK } = createModal('default', 'init-user-name');

    const MODAL_FROM_WRAP = document.createElement('div');
    const BTN_DEL = document.createElement('button');

    MODAL_FROM_WRAP.classList.add('modal-form-wrap');
    BTN_DEL.classList.add('btn-delete');

    TITLE_EL.innerHTML = msg_str('init_name_title');
    MODAL_OK.innerHTML = msg_str('ok');

    const IPT_EL = document.createElement('input');
    IPT_EL.type = 'text';
    IPT_EL.id = 'IPT_INIT_NAME';
    IPT_EL.placeholder = msg_str('init_name_placeholder');
    IPT_EL.autocomplete = 'off';
    IPT_EL.required = true;
    IPT_EL.value = '';

    MODAL_FROM_WRAP.appendChild(IPT_EL);
    MODAL_FROM_WRAP.appendChild(BTN_DEL);
    BODY_EL.appendChild(MODAL_FROM_WRAP);

    BTN_DEL.classList.add('hide');

    IPT_EL.addEventListener('input', (_event) => {
      const TARGET = _event.target;
      if (TARGET.value.length > 0) {
        const INFO_TEXT_EL = document.querySelector('.info-change-name');
        if (INFO_TEXT_EL) {
          INFO_TEXT_EL.remove();
        }

        // 띄어쓰기 방지
        TARGET.value = TARGET.value.replace(/\s+/g, '');

        // 20글자 이상 입력 시 입력 방지
        if (TARGET.value.length > 20) {
          TARGET.value = TARGET.value.slice(0, 20);
          errorNameEvent(BODY_EL, 'change_name_error_full');
        }

        BTN_DEL.classList.remove('hide');
      } else {
        BTN_DEL.classList.add('hide');
      }
    });

    BTN_DEL.addEventListener('click', () => {
      IPT_EL.value = '';
      IPT_EL.focus();
      BTN_DEL.classList.add('hide');
    });

    MODAL_OK.addEventListener('click', () => {
      if (IPT_EL.value === '') {
        errorNameEvent(BODY_EL, 'change_name_error_null');
      } else {
        const NAME_EL = document.querySelector('.init-name');
        if (!NAME_EL) return;

        const RESULT = getUnicodePoints(IPT_EL.value.replace(/\s+/g, ''));

        const DE_RESULT = fromUnicodePoints(RESULT);
        NAME_EL.innerHTML = DE_RESULT;

        storageMethod('l', 'SET_ITEM', 'userName', RESULT);
        storageMethod('l', 'SET_ITEM', 'clientId', CLIENT_ID);

        MODAL_POP_WRAP.remove();

        if (ws.readyState === WebSocket.OPEN) {
          // WebSocket이 이미 열린 경우 바로 전송
          ws.send(JSON.stringify({ type: 'join', clientId: CLIENT_ID, userId: DE_RESULT }));
        } else {
          // WebSocket이 열려 있지 않은 경우 open 이벤트 기다리기
          ws.addEventListener(
            'open',
            () => {
              ws.send(JSON.stringify({ type: 'join', clientId: CLIENT_ID, userId: DE_RESULT }));
            },
            { once: true },
          ); // 한 번만 실행되도록 이벤트 리스너 설정
        }
      }
    });
  }
}
