// import { tapCount } from "../../../js/socket/taptap/setSocket.js";
import taptapRes from './taptapRes.js';

export default (count) => {
  let cnt = Number(count.value);
  count.value = ++cnt;
  sessionStorage.setItem('tap-count', count.value);
  // tapCount(count);
  taptapRes.tapCount(count.value);
};
