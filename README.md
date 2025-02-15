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
- npm install lit <!-- html vanilla component module -->

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
- plantUML
- File Tree Generator

# build
- npm start -> HMR local 작업환경
- npm run build -> 서버에 올릴 build 파일

# 진행상태
- 241220 오후:
  - gameState - 'waitEnemy', 'count', 'playing', 'gameOver' - 별로 실행 함수 나눌 것
  - 정상진입 단계와 gameState별로 새로고침 시 단계 정의할 것
  - 정의한 단계별로 나눈 실행함수를 실행할 것

# FOLDER TREE
webgame  
├─ .vscode  
├─ src  
│  ├─ client  
│  │  ├─ assets  
│  │  │  ├─ images  
│  │  │  └─ scss  
│  │  │     ├─ common  
│  │  │     ├─ game  
│  │  │     │  └─ taptap  
│  │  │     ├─ main  
│  │  │     ├─ selectGame  
│  │  │     └─ selectUser  
│  │  ├─ components  
│  │  │  ├─ popup  
│  │  │  └─ waitUser  
│  │  ├─ js  
│  │  │  ├─ common  
│  │  │  ├─ module  
│  │  │  ├─ view  
│  │  │  │  ├─ game  
│  │  │  │  │  └─ taptap  
│  │  │  │  ├─ main  
│  │  │  │  ├─ selectGame  
│  │  │  │  └─ selectUser  
│  │  │  ├─ webPack  
│  │  │  └─ webRTC  
│  │  ├─ store  
│  │  ├─ views  
│  │  │  ├─ game  
│  │  │  │  └─ taptap  
│  │  │  ├─ selectGame  
│  │  │  └─ selectUser  
│  │  └─ index.html  
│  └─ server  
│     ├─ cluster_master.js  
│     ├─ server_webrtc.js  
│     └─ server_websocket.js  
├─ package.json  
├─ package-lock.json  
└─ webpack.config.js  
