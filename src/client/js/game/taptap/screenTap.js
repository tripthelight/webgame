import taptapRes from './taptapRes.js';
import storageMethod from '../../functions/common/storage/storageMethod.js';

export default (count) => {
  console.log('1 :: ', count.value);

  let cnt = Number(count.value);
  console.log('2 :: ', cnt);
  count.value = ++cnt;
  console.log('3 :: ', count.value);
  storageMethod('s', 'SET_ITEM', 'tap-count', count.value);
  taptapRes.tapCount(count.value);
};
