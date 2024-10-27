import { ws } from '../../webSocket/webSocketHost.js';
import createModal from '../../../../functions/common/popup/createModal.js';
import msg_str from '../../../../functions/common/msg_str.js';
import errorNameEvent from '../errorNameEvent.js';
import fromUnicodePoints from '../../../../functions/common/unicode/fromUnicodePoints.js';
import getUnicodePoints from '../../../../functions/common/unicode/getUnicodePoints.js';
import storageMethod from '../../../../functions/common/storage/storageMethod.js';

export default function changeUserName() {
  const MAIN_ELEM = document.querySelector('.main');
  if (!MAIN_ELEM) return;

  const USER_NAME_ELEM = MAIN_ELEM.querySelector('.user-name');
  if (!USER_NAME_ELEM) return;

  const INIT_NAME_ELEM = USER_NAME_ELEM.querySelector('.init-name');
  if (!INIT_NAME_ELEM) return;

  const CHANGE_NAME_BTN = USER_NAME_ELEM.querySelector('.btn-change-name');
  if (!CHANGE_NAME_BTN) return;

  CHANGE_NAME_BTN.addEventListener('click', () => {
    const MODAL_POPUP = document.querySelector('.change-user-name');
    if (MODAL_POPUP) return;

    const CLIENT_ID = window.localStorage.getItem('clientId');
    if (!CLIENT_ID) return;

    const { MODAL_POP_WRAP, POPUP_BG_EL, CONTAINER_EL, HEADER_EL, TITLE_EL, CLOSE_BTN_EL, BODY_EL, FOOTER_EL, MODAL_OK, MODAL_CANCLE } = createModal('ok_cancle', 'change-user-name');

    const MODAL_FROM_WRAP = document.createElement('div');
    const BTN_DEL = document.createElement('button');

    MODAL_FROM_WRAP.classList.add('modal-form-wrap');
    BTN_DEL.classList.add('btn-delete');

    TITLE_EL.innerHTML = msg_str('change_name_title');
    MODAL_OK.innerHTML = msg_str('ok');
    MODAL_CANCLE.innerHTML = msg_str('cancle');

    const IPT_EL = document.createElement('input');
    IPT_EL.type = 'text';
    IPT_EL.id = 'IPT_CHANGE_NAME';
    IPT_EL.placeholder = msg_str('change_name_placeholder');
    IPT_EL.autocomplete = 'off';
    IPT_EL.required = true;
    IPT_EL.value = '';
    // IPT_EL.setAttribute("maxlength", "20");

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

        MODAL_POP_WRAP.remove();

        if (ws.readyState === WebSocket.OPEN) {
          // WebSocket이 이미 열린 경우 바로 전송
          ws.send(JSON.stringify({ type: 'setUserName', clientId: CLIENT_ID, newUserId: DE_RESULT }));
        } else {
          // WebSocket이 열려 있지 않은 경우 open 이벤트 기다리기
          ws.addEventListener(
            'open',
            () => {
              ws.send(JSON.stringify({ type: 'setUserName', clientId: CLIENT_ID, newUserId: DE_RESULT }));
            },
            { once: true },
          ); // 한 번만 실행되도록 이벤트 리스너 설정
        }
      }
    });

    MODAL_CANCLE.addEventListener('click', () => {
      MODAL_POP_WRAP.remove();
    });
    CLOSE_BTN_EL.addEventListener('click', () => {
      MODAL_POP_WRAP.remove();
    });
  });
}
