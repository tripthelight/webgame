import { text } from '../client/common/language.js';

export default function gameRequest(message) {
  if (message.type === 'errorCommon') {
    alert(text.leaveRoom);
    window.location.href = '/';
  }
}
