import storageMethod from '../../functions/common/storage/storageMethod.js';

export default function refreshEvent() {
  // 새로고침 여부 확인
  if (sessionStorage.getItem('reloaded') === 'true') {
    // console.log('페이지가 새로고침되었습니다.');
    // storageMethod('s', 'REMOVE_ITEM', 'reloaded');
  } else {
    // console.log('직접 방문했습니다.');
  }
}
