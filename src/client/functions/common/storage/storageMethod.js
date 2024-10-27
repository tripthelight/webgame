import store, { updateStorageEvent } from '../../../store/storageEvent.js';

export default function storageMethod(_storage, _method, _key, _value) {
  store.dispatch(updateStorageEvent({ value: false }));
  switch (_method) {
    case 'SET_ITEM':
      if (_storage === 'l') {
        window.localStorage.setItem(_key, _value);
      } else if (_storage === 's') {
        window.sessionStorage.setItem(_key, _value);
      }
      break;
    case 'REMOVE_ITEM':
      if (_storage === 'l') {
        window.localStorage.removeItem(_key);
      } else if (_storage === 's') {
        window.sessionStorage.removeItem(_key);
      }
      break;
    default:
      break;
  }
  store.dispatch(updateStorageEvent({ value: true }));
}
