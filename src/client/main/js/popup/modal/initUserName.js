import {ws} from "../../webSocket.js";
import createModal from "../../../../functions/common/popup/createModal.js";
import msg_str from "../../../../functions/common/msg_str.js";
import errorNameEvent from "../errorNameEvent.js";
import fromUnicodePoints from "../../../../functions/common/unicode/fromUnicodePoints.js";
import getUnicodePoints from "../../../../functions/common/unicode/getUnicodePoints.js";
import storageMethod from "../../../../functions/common/storage/storageMethod.js";

export default function initUserName(_length) {
  const MAIN_ELEM = document.querySelector(".main");
  if (!MAIN_ELEM) return;

  const USER_NAME_ELEM = MAIN_ELEM.querySelector(".user-name");
  if (!USER_NAME_ELEM) return;

  const INIT_NAME_ELEM = USER_NAME_ELEM.querySelector(".init-name");
  if (!INIT_NAME_ELEM) return;

  // localStorage의 userName은 string[] 로 저장됨
  const INIT_USER_NAME = window.localStorage.getItem("userName");

  if (INIT_USER_NAME) {
    const userName = fromUnicodePoints(
      INIT_USER_NAME.replace(/"/g, "")
        .split(",")
        .map(s => s.trim())
    );
    INIT_NAME_ELEM.innerHTML = userName;
    console.log("userName ::::::::: ", userName);

    ws.send(JSON.stringify({type: "setUserName", userName}));
  } else {
    const MODAL_POPUP = document.querySelector(".init-user-name");
    if (MODAL_POPUP) return;

    const {MODAL_POP_WRAP, TITLE_EL, CLOSE_BTN_EL, BODY_EL, MODAL_OK} = createModal("default", "init-user-name");

    const MODAL_FROM_WRAP = document.createElement("div");
    const BTN_DEL = document.createElement("button");

    MODAL_FROM_WRAP.classList.add("modal-form-wrap");
    BTN_DEL.classList.add("btn-delete");

    TITLE_EL.innerHTML = msg_str("init_name_title");
    MODAL_OK.innerHTML = msg_str("ok");

    const IPT_EL = document.createElement("input");
    IPT_EL.type = "text";
    IPT_EL.id = "IPT_INIT_NAME";
    IPT_EL.placeholder = msg_str("init_name_placeholder");
    IPT_EL.autocomplete = "off";
    IPT_EL.required = true;
    IPT_EL.value = "";

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
          errorNameEvent(BODY_EL, "change_name_error_full");
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
        errorNameEvent(BODY_EL, "change_name_error_null");
      } else {
        const NAME_EL = document.querySelector(".init-name");
        if (!NAME_EL) return;

        const RESULT = getUnicodePoints(IPT_EL.value.replace(/\s+/g, ""));

        const DE_RESULT = fromUnicodePoints(RESULT);
        NAME_EL.innerHTML = DE_RESULT;

        storageMethod("SET_ITEM", "userName", RESULT);

        MODAL_POP_WRAP.remove();

        ws.send(JSON.stringify({type: "setUserName", userName: DE_RESULT}));
      }
    });

    CLOSE_BTN_EL.addEventListener("click", () => {
      MODAL_POP_WRAP.remove();
    });
  }

  /*
  const MAIN_ELEM = document.querySelector(".main");
  if (!MAIN_ELEM) return;

  const USER_NAME_ELEM = MAIN_ELEM.querySelector(".user-name");
  if (!USER_NAME_ELEM) return;

  const INIT_NAME_ELEM = USER_NAME_ELEM.querySelector(".init-name");
  if (!INIT_NAME_ELEM) return;

  // localStorage의 userName은 string[] 로 저장됨
  const INIT_USER_NAME = window.localStorage.getItem("userName");

  if (INIT_USER_NAME) {
    INIT_NAME_ELEM.innerHTML = fromUnicodePoints(
      INIT_USER_NAME.replace(/"/g, "")
        .split(",")
        .map(s => s.trim())
    );
  } else {
    const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < _length; i++) {
      const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
      result += CHARACTERS[randomIndex];
    }

    const RESULT = getUnicodePoints(`name-${result}`);

    INIT_NAME_ELEM.innerHTML = fromUnicodePoints(RESULT);
    storageMethod("SET_ITEM", "userName", RESULT);
  }
  */
}
