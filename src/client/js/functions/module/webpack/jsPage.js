import PAGES from './pages.js';

let jsArr = new Object();
let url = '';
for (let i = 0; i < PAGES.js.length; i++) {
  if (PAGES.js[i] === 'index') {
    url = './src/client/js/main/main.js';
  }
  if (PAGES.js[i] === 'selectGame') {
    url = './src/client/js/selectGame/selectGame.js';
  }
  if (PAGES.js[i] === 'taptap') {
    url = './src/client/js/game/taptap/taptap.js';
  }
  jsArr[PAGES.js[i]] = url;
}
const multipleJsPlugins = jsArr;

export default multipleJsPlugins;
