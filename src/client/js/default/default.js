// 기본 main 함수
import '../functions/common/common.js';

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('default ...');
  }
};
