import store, {updateStorageEvent} from "../../../store/storageEvent.js";

export default function storageMethod(_method, _key, _value) {
  store.dispatch(updateStorageEvent({value: false}));
  switch (_method) {
    case "SET_ITEM":
      window.localStorage.setItem(_key, _value);
      break;
    default:
      break;
  }
  store.dispatch(updateStorageEvent({value: true}));
}
