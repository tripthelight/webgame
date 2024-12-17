import gameState from "../../../gameState/taptap.js";
import cowndown from "../../client/taptap/cowndown.js";
import countStyle from "../../client/taptap/countStyle.js";
import screenClickEvent from "../../client/taptap/screenClickEvent.js";
import { gameState as setSocketGameState } from "../../../js/socket/taptap/setSocket.js";
import LOADING from "../../client/common/loading.js";

export default (_data) => {
  console.log("_data.state >>> ", _data.state);
  const MY_STATE = window.sessionStorage.gameState;
  const STATE = _data.state.toString();
  if (MY_STATE === STATE) {
    LOADING.hide();
    switch (STATE) {
      case "count":
        gameState.count();
        // countdown
        cowndown.show(countStyle);
        break;
      case "playing":
        gameState.playing();
        window.sessionStorage.removeItem("count");
        // screen tap event
        screenClickEvent.tap();
        break;
      default:
        break;
    }
  } else {
    setTimeout(setSocketGameState, 100, MY_STATE);
  }
};
