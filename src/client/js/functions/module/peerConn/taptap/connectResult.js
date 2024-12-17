import pageAccessedByReload from "../../client/common/pageAccessedByReload.js";
import refreshEvent from "../../../refresh/taptap/taptap.js";
import LOADING from "../../client/common/loading.js";
import { gameState as setSocketGameState } from "../../../js/socket/taptap/setSocket.js";
import screenClickEvent from "../../client/taptap/screenClickEvent.js";
import gameState from "../../../gameState/taptap.js";

export default () => {
  if (pageAccessedByReload) {
    if (window.sessionStorage.gameState === "gameOver") {
      refreshEvent.tapGraph();
    } else if (window.sessionStorage.gameState === "count") {
      LOADING.show();
      console.log("count >>>>> ");
      if (window.sessionStorage.count) {
        let cnt = Number(window.sessionStorage.count);
        if (cnt > 0) {
          const CNT_INTERVAL = setInterval(() => {
            console.log("interval >>> ");
            if (cnt <= 0) {
              clearInterval(CNT_INTERVAL);
              window.sessionStorage.removeItem("count");
              window.sessionStorage.setItem("gameState", "playing");
              setSocketGameState("playing");
            }
            cnt--;
            window.sessionStorage.setItem("count", cnt);
          }, 1000);
        } else {
          window.sessionStorage.removeItem("count");
          window.sessionStorage.setItem("gameState", "playing");
          setSocketGameState("playing");
        }
      }
      // window.sessionStorage.count
    } else if (window.sessionStorage.gameState === "playing") {
      // setSocketGameState("playing");
      window.sessionStorage.removeItem("count");
      refreshEvent.tapGraph();
      screenClickEvent.tap();
    } else {
      refreshEvent.tapGraph();
    }
  } else {
    gameState.waitEnemy();
    sessionStorage.setItem("tap-count", 0);
  }
};
