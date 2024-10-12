export default function createModal(_className) {
  const CHANGE_NAME_POP = document.createElement("div");
  const HEADER_EL = document.createElement("div");
  const CONTAINER_EL = document.createElement("div");
  const CLOSE_BTN_EL = document.createElement("button");
  const POPUP_BG_EL = document.createElement("div");

  CHANGE_NAME_POP.classList.add("modal-popup");
  CHANGE_NAME_POP.classList.add(_className);
  HEADER_EL.classList.add("header");
  CONTAINER_EL.classList.add("container");
  CLOSE_BTN_EL.classList.add("close");
  POPUP_BG_EL.classList.add("bg");

  HEADER_EL.appendChild(CLOSE_BTN_EL);
  CHANGE_NAME_POP.appendChild(POPUP_BG_EL);
  CHANGE_NAME_POP.appendChild(HEADER_EL);
  CHANGE_NAME_POP.appendChild(CONTAINER_EL);

  document.body.appendChild(CHANGE_NAME_POP);

  return {
    CHANGE_NAME_POP,
    HEADER_EL,
    CONTAINER_EL,
    CLOSE_BTN_EL,
    POPUP_BG_EL,
  };
}
