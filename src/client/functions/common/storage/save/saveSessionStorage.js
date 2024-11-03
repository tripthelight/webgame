import storageDataStore, { updateSessionStorageData } from '../../../../store/storageData.js';

export default function saveSessionStorage() {
  // sessionStorage의 모든 키-값 쌍을 저장할 객체 생성
  const sessionStorageData = {};
  // sessionStorage를 순회하여 모든 키-값을 객체에 저장
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i); // 현재 키 가져오기
    const value = sessionStorage.getItem(key); // 현재 키에 해당하는 값 가져오기
    sessionStorageData[key] = value; // 객체에 키-값 쌍 추가
  }
  storageDataStore.dispatch(updateSessionStorageData({ sessionStorageData: sessionStorageData }));
}
