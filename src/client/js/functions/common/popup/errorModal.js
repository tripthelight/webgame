import createModal from './createModal.js';
import msg_str from '../msg_str.js';

export default function errorModal() {
  const MODAL_POPUP = document.querySelector('.error-modal');
  if (MODAL_POPUP) return;

  const { MODAL_POP_WRAP, TITLE_EL, BODY_EL, MODAL_OK } = createModal('default', 'error-modal');

  const MODAL_FROM_WRAP = document.createElement('div');

  MODAL_FROM_WRAP.classList.add('modal-form-wrap');

  TITLE_EL.innerHTML = msg_str('error_title');
  MODAL_OK.innerHTML = msg_str('ok');

  const CONTEXT_EL = document.createElement('div');

  CONTEXT_EL.innerHTML = msg_str('error_text');

  MODAL_FROM_WRAP.appendChild(CONTEXT_EL);
  BODY_EL.appendChild(MODAL_FROM_WRAP);

  MODAL_OK.addEventListener('click', () => {
    MODAL_POP_WRAP.remove();
    location.href = '/';
  });
}
