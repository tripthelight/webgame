import { v4 as uuidv4 } from 'uuid';
import createModal from '../../functions/common/popup/createModal.js';
import storageMethod from '../../functions/common/storage/storageMethod.js';
import errorNameEvent from './errorNameEvent.js';
import fromUnicodePoints from '../../functions/common/unicode/fromUnicodePoints.js';
import getUnicodePoints from '../../functions/common/unicode/getUnicodePoints.js';
import msg_str from '../../functions/common/msg_str.js';

export default function initNickName() {
  const CLIENT_ID = window.localStorage.getItem('clientId') ? window.localStorage.getItem('clientId') : uuidv4();

  // localStorage의 nickname은 string[] 로 저장됨
  const NICK_NAME = window.localStorage.getItem('nickName');

  if (NICK_NAME) {
    // nick이 있는 경우
  } else {
    // nick이 없는 경우
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
        // Unicode 배열 형식으로 변환
        const RESULT = getUnicodePoints(IPT_EL.value.replace(/\s+/g, ''));

        // // Unicode 배열 형식의 nick name을 문자로 변환
        // const DE_RESULT = fromUnicodePoints(RESULT);
        // NAME_EL.innerHTML = DE_RESULT;

        storageMethod('l', 'SET_ITEM', 'nickName', RESULT);
        storageMethod('l', 'SET_ITEM', 'clientId', CLIENT_ID);

        MODAL_POP_WRAP.remove();
      }
    });
  }
}
