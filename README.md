# webpack

- npm install webpack webpack-cli --save-dev
- npm install babel-loader @babel/core @babel/preset-env sass sass-loader css-loader style-loader --save-dev
- npm install webpack-dev-server --save-dev
- npm install --save-dev html-webpack-plugin
- npm install html-loader --save-dev
- npm install html-loader mini-css-extract-plugin clean-webpack-plugin --save-dev
- npm install html-loader clean-webpack-plugin html-webpack-plugin --save-dev
- npm install html-loader mini-css-extract-plugin clean-webpack-plugin html-webpack-plugin --save-dev
- npm install html-loader mini-css-extract-plugin clean-webpack-plugin html-webpack-plugin --save-dev
- npm install mini-css-extract-plugin clean-webpack-plugin html-webpack-plugin sass-loader sass css-loader babel-loader @babel/core @babel/preset-env --save-dev
- npm install sass-loader sass webpack --save-dev
- npm audit fix

- npm i -D cluster
- npm i redux
- npm install @reduxjs/toolkit
- npm install -g nodemon

- webpack
  - npm i -D webpack webpack-cli
  - npm i -D babel-loader @babel/preset-env @babel/core
  - npm i -D style-loader css-loader sass-loader sass
  - npm i -D mini-css-extract-plugin
  - npm i -D html-loader
  - npm i -D html-webpack-plugin
  - npm i -D copy-webpack-plugin image-webpack-loader file-loader
  - npm i -D url-loader
  - npm i -D webpack-dev-server

# VSCODE EXTENSION

- live server
- todo highlight
- Live Sass Compiler
- Material theme
- Material icon theme
- Prettier
- bracket pair colorizer
- Indent-rainbow
- Auto rename tag
- Markdown All in One

# build

- npm start -> HMR local 작업환경
- npm run build -> 서버에 올릴 build 파일

# 진행상태

- 241219 오후:
  - gameState - 'waitEnemy', 'count', 'playing', 'gameOver' - 별로 실행 함수 나눌 것
  - webRTC Peer 사이에 이루어 지는 모든 통신은 promise 시킬 것
  - signaling server와 client 간의 모든 요청과 응답은 promise 시킬 것
  - 정상진입 단계와 gameState별로 새로고침 시 단계 정의할 것
  - 정의한 단계별로 나눈 실행함수를 실행할 것
