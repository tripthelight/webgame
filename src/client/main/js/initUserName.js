export default function initUserName(_length) {
  const MAIN_ELEM = document.querySelector(".main");
  if (!MAIN_ELEM) return;

  const USER_NAME_ELEM = MAIN_ELEM.querySelector(".user-name");
  if (!USER_NAME_ELEM) return;

  const INIT_NAME_ELEM = USER_NAME_ELEM.querySelector(".init-name");
  if (!INIT_NAME_ELEM) return;

  const INIT_USER_NAME = window.localStorage.getItem("userName");

  if (INIT_USER_NAME) {
    INIT_NAME_ELEM.innerHTML = INIT_USER_NAME;
  } else {
    const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < _length; i++) {
      const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
      result += CHARACTERS[randomIndex];
    }

    INIT_NAME_ELEM.innerHTML = `name-${result}`;
    window.localStorage.setItem("userName", `name-${result}`);
  }
}
