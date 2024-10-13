import createModal from "../../functions/common/popup/createModal.js";
import msg_str from "../../functions/common/msg_str.js";
import fromUnicodePoints from "../../functions/common/unicode/fromUnicodePoints.js";
import getUnicodePoints from "../../functions/common/unicode/getUnicodePoints.js";

export default function changeUserName() {
  const MAIN_ELEM = document.querySelector(".main");
  if (!MAIN_ELEM) return;

  const USER_NAME_ELEM = MAIN_ELEM.querySelector(".user-name");
  if (!USER_NAME_ELEM) return;

  const INIT_NAME_ELEM = USER_NAME_ELEM.querySelector(".init-name");
  if (!INIT_NAME_ELEM) return;

  const CHANGE_NAME_BTN = USER_NAME_ELEM.querySelector(".btn-change-name");
  if (!CHANGE_NAME_BTN) return;

  const ERROR_NAME_EVENT = (_bodyElem, _txt) => {
    const INFO_TEXT_EL = document.querySelector(".info-change-name");
    if (INFO_TEXT_EL) return;

    const INFO_EL = document.createElement("div");
    INFO_EL.classList.add("info-change-name");
    INFO_EL.classList.add("error");
    INFO_EL.innerHTML = msg_str(_txt);
    _bodyElem.appendChild(INFO_EL);
  };

  CHANGE_NAME_BTN.addEventListener("click", () => {
    const MODAL_POPUP = document.querySelector(".change-user-name");
    if (MODAL_POPUP) return;

    const {CHANGE_NAME_POP, POPUP_BG_EL, CONTAINER_EL, HEADER_EL, TITLE_EL, CLOSE_BTN_EL, BODY_EL, FOOTER_EL, MODAL_OK, MODAL_CANCLE} = createModal("ok_cancle", "change-user-name");

    const MODAL_FROM_WRAP = document.createElement("div");
    const BTN_DEL = document.createElement("button");

    MODAL_FROM_WRAP.classList.add("modal-form-wrap");
    BTN_DEL.classList.add("btn-delete");

    TITLE_EL.innerHTML = msg_str("change_name_title");
    MODAL_OK.innerHTML = msg_str("ok");
    MODAL_CANCLE.innerHTML = msg_str("cancle");

    const IPT_EL = document.createElement("input");
    IPT_EL.type = "text";
    IPT_EL.id = "IPT_CHANGE_NAME";
    IPT_EL.placeholder = msg_str("change_name_placeholder");
    IPT_EL.autocomplete = "off";
    IPT_EL.required = true;
    IPT_EL.value = "";
    // IPT_EL.setAttribute("maxlength", "20");

    MODAL_FROM_WRAP.appendChild(IPT_EL);
    MODAL_FROM_WRAP.appendChild(BTN_DEL);
    BODY_EL.appendChild(MODAL_FROM_WRAP);

    BTN_DEL.classList.add("hide");

    IPT_EL.addEventListener("input", _event => {
      const TARGET = _event.target;
      if (TARGET.value.length > 0) {
        const INFO_TEXT_EL = document.querySelector(".info-change-name");
        if (INFO_TEXT_EL) {
          INFO_TEXT_EL.remove();
        }

        // 띄어쓰기 방지
        TARGET.value = TARGET.value.replace(/\s+/g, "");

        // 20글자 이상 입력 시 입력 방지
        if (TARGET.value.length > 20) {
          TARGET.value = TARGET.value.slice(0, 20);
          ERROR_NAME_EVENT(BODY_EL, "change_name_error_full");
        }

        BTN_DEL.classList.remove("hide");
      } else {
        BTN_DEL.classList.add("hide");
      }
    });

    BTN_DEL.addEventListener("click", () => {
      IPT_EL.value = "";
      IPT_EL.focus();
      BTN_DEL.classList.add("hide");
    });

    MODAL_OK.addEventListener("click", () => {
      if (IPT_EL.value === "") {
        ERROR_NAME_EVENT(BODY_EL, "change_name_error_null");
      } else {
        const NAME_EL = document.querySelector(".init-name");
        if (!NAME_EL) return;

        const RESULT = getUnicodePoints(IPT_EL.value.replace(/\s+/g, ""));

        NAME_EL.innerHTML = fromUnicodePoints(RESULT);
        window.localStorage.setItem("userName", RESULT);
        CHANGE_NAME_POP.remove();
      }
    });

    MODAL_CANCLE.addEventListener("click", () => {
      CHANGE_NAME_POP.remove();
    });
    CLOSE_BTN_EL.addEventListener("click", () => {
      CHANGE_NAME_POP.remove();
    });
  });
}
