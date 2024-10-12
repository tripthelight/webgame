import {LOADING_EVENT} from "../../functions/common/loading.js";
import onlyOneCheckbox from "../../functions/common/onlyOneCheckbox.js";
import initUserName from "./initUserName.js";
import changeUserName from "./changeUserName.js";

function init() {
  console.log("main init...");
  onlyOneCheckbox(".main .user-list");
  initUserName(12);
  changeUserName();
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
