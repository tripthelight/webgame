import createModal from "../../functions/common/popup/createModal.js";

export default function changeUserName() {
  const MAIN_ELEM = document.querySelector(".main");
  if (!MAIN_ELEM) return;

  const USER_NAME_ELEM = MAIN_ELEM.querySelector(".user-name");
  if (!USER_NAME_ELEM) return;

  const INIT_NAME_ELEM = USER_NAME_ELEM.querySelector(".init-name");
  if (!INIT_NAME_ELEM) return;

  const CHANGE_NAME_BTN = USER_NAME_ELEM.querySelector(".btn-change-name");
  if (!CHANGE_NAME_BTN) return;

  CHANGE_NAME_BTN.addEventListener("click", () => {
    const MODAL_POPUP = document.querySelector(".change-user-name");
    if (MODAL_POPUP) return;

    const {CHANGE_NAME_POP, HEADER_EL, CONTAINER_EL, CLOSE_BTN_EL, POPUP_BG_EL} = createModal("change-user-name");

    console.log(CHANGE_NAME_POP);
  });
}
