import randomName from "./randomName.js";
export default () => {
  if (!window.localStorage.uid) window.localStorage.setItem("uid", randomName(10));
  return window.localStorage.uid;
};
