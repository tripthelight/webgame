import { text } from "./language.js";

export const changeNickname = () => {
  let answer = prompt(text.nickInput, window.localStorage.getItem("nickname"));
  let response = "";
  let blank_pattern = /[\s]/g;

  if (answer === null) return;
  if (answer.length == 0) {
    response = text.nickErr0;
    alert(response);
  } else if (answer.length > 20) {
    response = text.nickErr20;
    alert(response);
  } else if (blank_pattern.test(answer) === true) {
    response = text.nickBlank;
    alert(response);
  } else {
    window.localStorage.setItem("nickname", answer);
    alert(text.nickOkFront + " " + answer + " " + text.nickOkBack);
  }
};
