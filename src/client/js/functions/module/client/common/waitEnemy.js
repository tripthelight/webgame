import WAIT_ENEMY from "./waitEnemyEvt.js";
import nickname from "./nickname.js";
import { matching, dotAni } from "./variable.js";
import { text } from "./language.js";
import enemyDotAni from "./enemyDotAni.js";

export default (len) => {
  switch (len) {
    case 1:
      // wait Enemy
      WAIT_ENEMY.show(nickname());
      enemyDotAni();
      break;
    case 2:
      // wait end Enemy
      clearInterval(dotAni);
      matching = false;
      WAIT_ENEMY.hide();
      break;
    default:
      // error
      alert(text.err);
      // socket.disconnect();
      window.location.href = "/";
      break;
  }
};
