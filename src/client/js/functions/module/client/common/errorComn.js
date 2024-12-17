import namespace from "../../socket/namespace.js";
import { text } from "./language.js";

export default (_errTxt) => {
  let ns = namespace || null;
  if (ns && ns.nsp === window.location.pathname) {
    alert(_errTxt ? _errTxt : text.err);
    namespace.emit("errorCommon", {
      room: window.sessionStorage.roomName,
      err: true,
    });
  } else {
    alert(text.leaveRoom);
  }
  window.location.href = "/";
};
