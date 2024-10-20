export default function createModal(_type, _className) {
  const MODAL_POP_WRAP = document.createElement("div");
  const CONTAINER_EL = document.createElement("div");
  const HEADER_EL = document.createElement("div");
  const TITLE_EL = document.createElement("span");
  const BODY_EL = document.createElement("div");
  const FOOTER_EL = document.createElement("div");
  const MODAL_OK = document.createElement("button");
  const MODAL_CANCLE = document.createElement("button");
  const CLOSE_BTN_EL = document.createElement("button");
  const POPUP_BG_EL = document.createElement("div");

  MODAL_POP_WRAP.classList.add("modal-popup");
  MODAL_POP_WRAP.classList.add(_className);
  POPUP_BG_EL.classList.add("modal-bg");
  CONTAINER_EL.classList.add("modal-container");
  HEADER_EL.classList.add("modal-header");
  TITLE_EL.classList.add("modal-title");
  CLOSE_BTN_EL.classList.add("modal-close");
  BODY_EL.classList.add("modal-body");
  FOOTER_EL.classList.add("modal-footer");
  MODAL_OK.classList.add("modal-ok");
  MODAL_CANCLE.classList.add("modal-cancle");

  HEADER_EL.appendChild(TITLE_EL);
  if (_type === "default") {
    FOOTER_EL.appendChild(MODAL_OK);
  } else if (_type === "ok_cancle") {
    HEADER_EL.appendChild(CLOSE_BTN_EL);
    FOOTER_EL.appendChild(MODAL_OK);
    FOOTER_EL.appendChild(MODAL_CANCLE);
  }
  CONTAINER_EL.appendChild(HEADER_EL);
  CONTAINER_EL.appendChild(BODY_EL);
  CONTAINER_EL.appendChild(FOOTER_EL);
  MODAL_POP_WRAP.appendChild(POPUP_BG_EL);
  MODAL_POP_WRAP.appendChild(CONTAINER_EL);

  document.body.appendChild(MODAL_POP_WRAP);

  return {
    MODAL_POP_WRAP,
    POPUP_BG_EL,
    CONTAINER_EL,
    HEADER_EL,
    TITLE_EL,
    CLOSE_BTN_EL,
    BODY_EL,
    FOOTER_EL,
    MODAL_OK,
    MODAL_CANCLE,
  };
}
