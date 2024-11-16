import '../functions/common/common.js';
import gameName from './gameName.js';
import { LOADING_EVENT } from '../functions/common/loading.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('selectGame init..');
    gameName();
    LOADING_EVENT.hide();
  }
};

/*
// promise 테스트
const p1 = () => {
  return new Promise((resolve, reject) => {
    console.log('p1 시작');
    setTimeout(() => {
      resolve('p1 끝');
    }, 3000);
  });
};
const p2 = (_message) => {
  return new Promise((resolve, reject) => {
    console.log(_message + ' ' + 'p2 시작');
    setTimeout(() => {
      resolve('p2 끝');
    }, 2000);
  });
};
const p3 = (_message) => {
  return new Promise((resolve, reject) => {
    console.log(_message + ' ' + 'p3 시작');
    setTimeout(() => {
      resolve('p3 끝');
    }, 1000);
  });
};

// p1().then((_message) => {
//   p2(_message).then((_message) => {
//     p3(_message).then(console.log);
//   });
// });
p1().then(p2).then(p3).then(console.log);
*/
