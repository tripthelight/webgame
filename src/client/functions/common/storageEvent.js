export default function storageEvent() {
  let previousKeys = Object.keys(localStorage); // 초기 상태 저장

  window.addEventListener("storage", event => {
    console.log(event);

    // console.warn(`localStorage가 변경되었습니다: ${event.key}`);
    // console.log(`새 값: ${event.newValue}, 이전 값: ${event.oldValue}`);

    // window.localStorage.removeItem(event.key);
    // window.localStorage.setItem(event.key, event.oldValue);

    // alert("STORAGE의 값을 바꿀 수 없습니다.");

    let currentKeys = Object.keys(localStorage); // 현재 상태

    // 키가 추가된 경우
    const addedKeys = currentKeys.filter(key => !previousKeys.includes(key));
    if (addedKeys.length > 0) {
      console.log("추가된 키:", addedKeys);
    }

    // 키가 삭제된 경우
    const removedKeys = previousKeys.filter(key => !currentKeys.includes(key));
    if (removedKeys.length > 0) {
      // console.log("삭제된 키:", removedKeys);
      window.localStorage.setItem(event.key, event.oldValue);
      previousKeys = Object.keys(localStorage);
      currentKeys = Object.keys(localStorage);
      previousKeys = currentKeys;
    }

    // 상태 업데이트
    previousKeys = currentKeys;
  });
}
