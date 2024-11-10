import '../../common.js';
import gameName from './gameName.js';

document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('selectGame init');
    gameName();
  }
};
