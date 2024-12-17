import LOADING from "../../client/common/loading.js";
import gameState from "../../../gameState/taptap.js";
import { gameState as setSocketGameState } from "../../../js/socket/taptap/setSocket.js";

export default (data) => {
  LOADING.show();
  if (data.users.length == 2) {
    gameState.count();
    setSocketGameState("count");
  }
};
