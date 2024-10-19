import store from "../../../../store/storageEvent.js";

export default function consoleLocalStorage() {
  // 원래의 메서드를 저장
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  const originalClear = localStorage.clear;

  // setItem 방지
  const handleSetItemExecution = (target, thisArg, argumentsList) => {
    if (store.getState().storageEvent.preventSetItemExecution) {
      return; // localStorage.setItem 명령이 먹이지 않음
    }
    return Reflect.apply(target, thisArg, argumentsList); // localStorage.setItem 명령이 먹힘
  };

  // setItem에 대한 Proxy 설정
  localStorage.setItem = new Proxy(originalSetItem, {apply: handleSetItemExecution});
  localStorage.__proto__.setItem = new Proxy(originalSetItem, {apply: handleSetItemExecution});

  // removeItem 방지
  const handleRemoveItemExecution = (target, thisArg, argumentsList) => {
    if (store.getState().storageEvent.preventRemoveItemExecution) {
      return;
    }
    return Reflect.apply(target, thisArg, argumentsList);
  };

  // removeItem에 대한 Proxy 설정
  localStorage.removeItem = new Proxy(originalRemoveItem, {apply: handleRemoveItemExecution});
  localStorage.__proto__.removeItem = new Proxy(originalRemoveItem, {apply: handleRemoveItemExecution});

  // clear 방지
  const handleClearExecution = (target, thisArg, argumentsList) => {
    if (store.getState().storageEvent.preventClearExecution) {
      return;
    }
    return Reflect.apply(target, thisArg, argumentsList);
  };

  // clear에 대한 Proxy 설정
  localStorage.clear = new Proxy(originalClear, {apply: handleClearExecution});
  localStorage.__proto__.clear = new Proxy(originalClear, {apply: handleClearExecution});
}
