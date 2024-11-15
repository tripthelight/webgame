import msg_str from '../functions/common/msg_str.js';

export default function gameName() {
  const GAME_LIST_EL = document.querySelector('.select-game');
  if (!GAME_LIST_EL) return;

  const GAME_LISTS_WRAP_EL = GAME_LIST_EL.querySelector('ul');
  if (GAME_LISTS_WRAP_EL) {
    GAME_LISTS_WRAP_EL.remove();
  }

  const GAME_LIST = JSON.parse(JSON.stringify(msg_str('gameName')));
  if (!GAME_LIST) return;

  const UL_EL = document.createElement('ul');
  for (const [index, [key, value]] of Object.entries(Object.entries(GAME_LIST))) {
    // console.log(`${index}: ${key} = ${value}`);
    const LI_EL = document.createElement('li');
    const A_EL = document.createElement('a');
    const SPAN_EL = document.createElement('span');
    A_EL.href = '#';
    SPAN_EL.innerHTML = value;
    A_EL.appendChild(SPAN_EL);
    LI_EL.appendChild(A_EL);
    UL_EL.appendChild(LI_EL);
  }
  GAME_LIST_EL.appendChild(UL_EL);
}
