import msg_str from '../functions/common/msg_str.js';
import errorModal from '../functions/common/popup/errorModal.js';
import storageMethod from '../functions/common/storage/storageMethod.js';

export default function storageInit() {
  storageMethod('s', 'REMOVE_ITEM', 'roomName');
  storageMethod('s', 'REMOVE_ITEM', 'yourName');
  storageMethod('s', 'REMOVE_ITEM', 'gameName');
  storageMethod('s', 'REMOVE_ITEM', 'gameState');
}
