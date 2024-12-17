import HtmlWebpackPlugin from 'html-webpack-plugin';
import PAGES from './pages.js';

let url = {
  template: '',
  filename: '',
};

const multipleHtmlPlugins = PAGES.html.map((name) => {
  if (name === 'index') {
    url.template = './src/client/index.html';
    url.filename = 'index.html';
  }
  if (name === 'selectGame') {
    url.template = './src/client/views/selectGame.html';
    url.filename = 'views/selectGame.html';
  }
  if (name === 'taptap') {
    url.template = './src/client/views/game/taptap.html';
    url.filename = 'views/game/taptap.html';
  }
  return new HtmlWebpackPlugin({
    template: url.template,
    filename: url.filename,
    chunks: [`${name}`],
  });
});

export default multipleHtmlPlugins;
