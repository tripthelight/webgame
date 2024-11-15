import storageEventStore from '../../../../../store/storageEvent.js';

export default function consoleSessionStorage() {
  // 원래의 메서드를 저장
  const originalSetItem = sessionStorage.setItem;
  const originalRemoveItem = sessionStorage.removeItem;
  const originalClear = sessionStorage.clear;

  // setItem 방지
  const handleSetItemExecution = (target, thisArg, argumentsList) => {
    if (storageEventStore.getState().storageEvent.preventSetItemExecution) {
      return; // sessionStorage.setItem 명령이 먹이지 않음
    }
    return Reflect.apply(target, thisArg, argumentsList); // sessionStorage.setItem 명령이 먹힘
  };

  // setItem에 대한 Proxy 설정
  sessionStorage.setItem = new Proxy(originalSetItem, { apply: handleSetItemExecution });
  sessionStorage.__proto__.setItem = new Proxy(originalSetItem, { apply: handleSetItemExecution });

  // removeItem 방지
  const handleRemoveItemExecution = (target, thisArg, argumentsList) => {
    if (storageEventStore.getState().storageEvent.preventRemoveItemExecution) {
      return;
    }
    return Reflect.apply(target, thisArg, argumentsList);
  };

  // removeItem에 대한 Proxy 설정
  sessionStorage.removeItem = new Proxy(originalRemoveItem, { apply: handleRemoveItemExecution });
  sessionStorage.__proto__.removeItem = new Proxy(originalRemoveItem, { apply: handleRemoveItemExecution });

  // clear 방지
  const handleClearExecution = (target, thisArg, argumentsList) => {
    if (storageEventStore.getState().storageEvent.preventClearExecution) {
      return;
    }
    return Reflect.apply(target, thisArg, argumentsList);
  };

  // clear에 대한 Proxy 설정
  sessionStorage.clear = new Proxy(originalClear, { apply: handleClearExecution });
  sessionStorage.__proto__.clear = new Proxy(originalClear, { apply: handleClearExecution });
}
