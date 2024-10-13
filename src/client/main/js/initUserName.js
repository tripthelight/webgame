import fromUnicodePoints from "../../functions/common/unicode/fromUnicodePoints.js";
import getUnicodePoints from "../../functions/common/unicode/getUnicodePoints.js";

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
    window.localStorage.setItem("userName", RESULT);
  }
}
