import { text } from './language.js';
import { onDataChannel } from '../../../common/webRTC/webRTC.js';
import gameResponse from '../../peerConn/gameResponse.js';

export default (_errTxt) => {
  if (onDataChannel && onDataChannel.readyState === 'open') {
    alert(_errTxt ? _errTxt : text.err);
    gameResponse.errorCommon();
  } else {
    alert(text.leaveRoom);
  }
  window.location.href = '/';
};
