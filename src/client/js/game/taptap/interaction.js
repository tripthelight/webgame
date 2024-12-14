import IINTERACTION from "./IINTERACTION.js";
import showInter from "./showInter.js";
import { timeInterval_600 } from "../../../js/common/variable.js";

export default {
  show: (diff) => {
    switch (diff) {
      case 10:
        showInter(IINTERACTION[0]);
        break;
      case 11:
        showInter(IINTERACTION[1]);
        break;
      case 12:
        showInter(IINTERACTION[2]);
        break;
      case 13:
        showInter(IINTERACTION[3]);
        break;
      case 14:
        showInter(IINTERACTION[4]);
        break;
      case 15:
        showInter(IINTERACTION[5]);
        break;
      case 16:
        showInter(IINTERACTION[6]);
        break;
      case 17:
        showInter(IINTERACTION[7]);
        break;
      case 18:
        showInter(IINTERACTION[8]);
        break;
      default:
        break;
    }
  },
  hide: (interEl) => {
    setTimeout(() => {
      interEl.remove();
    }, timeInterval_600);
  },
};
