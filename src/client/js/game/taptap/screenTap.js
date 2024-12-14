// import { tapCount } from "../../../js/socket/taptap/setSocket.js";

export default (count) => {
  let cnt = Number(count.value);
  count.value = ++cnt;
  sessionStorage.setItem('tap-count', count.value);
  // tapCount(count);
};
