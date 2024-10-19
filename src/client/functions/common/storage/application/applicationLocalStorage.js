import store, {updateStorageEvent} from "../../../../store/store.js";

export default function applicationLocalStorage() {
  window.addEventListener("storage", event => {
    if (event.storageArea === localStorage) {
      // 브라우저의 Application 탭에서 localStorage 변경
      store.dispatch(updateStorageEvent({value: false}));

      window.localStorage.removeItem(event.key);
      window.localStorage.setItem(event.key, event.oldValue);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        // 새로 생성되는 key는 값이 'null'이기 때문에 삭제 필요
        if (value === "null") {
          window.localStorage.removeItem(key);
        }
      }

      store.dispatch(updateStorageEvent({value: true}));
    } else if (event.storageArea === sessionStorage) {
      // 브라우저의 Application 탭에서 sessionStorage 변경
      store.dispatch(updateStorageEvent({value: false}));

      window.sessionStorage.removeItem(event.key);
      window.sessionStorage.setItem(event.key, event.oldValue);

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);

        // 새로 생성되는 key는 값이 'null'이기 때문에 삭제 필요
        if (value === "null") {
          window.sessionStorage.removeItem(key);
        }
      }

      store.dispatch(updateStorageEvent({value: true}));
    }
  });
}
