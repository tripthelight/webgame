import storageDataStore, { updateLocalStorageData } from '../../../../store/storageData.js';

export default function saveLocalStorage() {
  // localStorage의 모든 키-값 쌍을 저장할 객체 생성
  const localStorageData = {};
  // localStorage를 순회하여 모든 키-값을 객체에 저장
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i); // 현재 키 가져오기
    const value = localStorage.getItem(key); // 현재 키에 해당하는 값 가져오기
    localStorageData[key] = value; // 객체에 키-값 쌍 추가
  }
  storageDataStore.dispatch(updateLocalStorageData({ localStorageData: localStorageData }));
}
