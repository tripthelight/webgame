import {LOADING_EVENT} from "../../functions/common/loading.js";
import onlyOneCheckbox from "../../functions/common/onlyOneCheckbox.js";
import initUserName from "./initUserName.js";
import changeUserName from "./changeUserName.js";
import storageEvent from "../../functions/common/storage/storageEvent.js";

function init() {
  console.log("main init...");
  onlyOneCheckbox(".main .user-list");
  initUserName(12);
  changeUserName();
  storageEvent(); // storage event는 마지막에 실행
  LOADING_EVENT.hide();
}

LOADING_EVENT.show();
document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === "interactive") {
  } else if (state === "complete") {
    init();
  }
};
