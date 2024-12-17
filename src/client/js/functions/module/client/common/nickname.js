import randomName from "./randomName.js";
export default () => {
  if (!window.localStorage.nickname) window.localStorage.setItem("nickname", randomName(10));
  return window.localStorage.nickname;
};
