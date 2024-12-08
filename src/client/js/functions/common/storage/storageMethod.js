import storageEventStore, { updateStorageEvent } from '../../../../store/storageEvent.js';
import saveLocalStorage from './save/saveLocalStorage.js';
import saveSessionStorage from './save/saveSessionStorage.js';

export default function storageMethod(_storage, _method, _key, _value) {
  storageEventStore.dispatch(updateStorageEvent({ value: false }));
  switch (_method) {
    case 'SET_ITEM':
      if (_storage === 'l') {
        localStorage.setItem(_key, _value);
        saveLocalStorage();
      } else if (_storage === 's') {
        sessionStorage.setItem(_key, _value);
        saveSessionStorage();
      }
      break;
    case 'REMOVE_ITEM':
      if (_storage === 'l') {
        localStorage.removeItem(_key);
        saveLocalStorage();
      } else if (_storage === 's') {
        sessionStorage.removeItem(_key);
        saveSessionStorage();
      }
      break;
    default:
      break;
  }

  storageEventStore.dispatch(updateStorageEvent({ value: true }));
}
