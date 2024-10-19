export default function storageEvent() {
  let previousKeys = Object.keys(localStorage); // 초기 상태 저장

  // 원래의 메서드를 저장
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  const originalClear = localStorage.clear;

  let preventSetItemExecution = true; // localStorage.setItem 실행 | 미실행
  let preventRemoveItemExecution = true; // localStorage.removeItem 실행 | 미실행
  let preventClearExecution = true; // localStorage.clear 실행 | 미실행

  // setItem에 대한 Proxy 설정
  localStorage.setItem = new Proxy(originalSetItem, {
    apply(target, thisArg, argumentsList) {
      if (preventSetItemExecution) {
        return; // localStorage.setItem 명령이 먹이지 않음
      }
      return Reflect.apply(target, thisArg, argumentsList); // localStorage.setItem 명령이 먹힘
    },
  });

  // removeItem에 대한 Proxy 설정
  localStorage.removeItem = new Proxy(originalRemoveItem, {
    apply(target, thisArg, argumentsList) {
      if (preventRemoveItemExecution) {
        return;
      }
      return Reflect.apply(target, thisArg, argumentsList);
    },
  });

  // clear에 대한 Proxy 설정
  localStorage.clear = new Proxy(originalClear, {
    apply(target, thisArg, argumentsList) {
      if (preventClearExecution) {
        return;
      }
      return Reflect.apply(target, thisArg, argumentsList);
    },
  });

  window.addEventListener("storage", event => {
    preventSetItemExecution = false; // localStorage.setItem 명령 막기
    preventRemoveItemExecution = false; // localStorage.removeItem 명령 막기
    preventClearExecution = false; // localStorage.clear 명령 막기

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
    let currentKeys = Object.keys(localStorage); // 현재 상태
    // 상태 업데이트
    previousKeys = currentKeys;

    preventSetItemExecution = true; // localStorage.setItem 명령 막기 취소
    preventRemoveItemExecution = true; // localStorage.removeItem 명령 막기 취소
    preventClearExecution = true; // localStorage.clear 명령 막기 취소
  });

  // indexedDB TEST *********************************************
  const request = indexedDB.open("MyDatabase", 2); // 버전을 2로 증가
  console.log("request :: ", request);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    console.log("db : ", db);

    // MyStore가 존재하면 삭제
    if (db.objectStoreNames.contains("NewStore")) {
      db.deleteObjectStore("NewStore");
      console.log("NewStore가 삭제되었습니다.");
    }

    if (!db.objectStoreNames.contains("DBStore")) {
      db.createObjectStore("DBStore", {keyPath: "id"});
      console.log("DBStore가 생성되었습니다.");
    }
  };

  // request.onsuccess = function (event) {
  //   const db = event.target.result;

  //   // Transaction을 시작하고 MyStore에 접근
  //   const transaction = db.transaction(["DBStore"], "readwrite");
  //   const store = transaction.objectStore("DBStore");

  //   // 데이터를 추가
  //   store.put({id: 1, name: "John", age: 30});
  // };
}
