import LOADING from "../../client/common/loading.js";

export default () => {
  if (window.sessionStorage.gameState === "count") {
  } else {
    LOADING.hide();
  }
};
