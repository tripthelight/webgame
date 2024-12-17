import msg_str from '../functions/common/msg_str.js';
import errorModal from '../functions/common/popup/errorModal.js';
import storageMethod from '../functions/common/storage/storageMethod.js';

export default function storageInit() {
  window.sessionStorage.clear();
  storageMethod('s', 'REMOVE_ALL');
}
