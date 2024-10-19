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
- Markdown Preview Enhanced

# build

- npm start -> HMR local 작업환경
- npm run build -> 서버에 올릴 build 파일

# 진행상태

- index.html에서 2명만 입장가능한 room을 만듬
- index.html에서 접속한 모든 사용자를 표시하기 위해 server.js를 수정중
- 241012:
  - index.html에서 접속한 모든 사용자를 표시하기 위한 작업 중
  - 내가 접속 했을 경우 이름을 바꾸기 위한 팝업 작업 중
  - index에서 접속한 user들을 보여주기 위한 socket server 제작 필요
- 241013:

  - localstorage에서 username 수정 불가능하게 하고 있었음
  - index에서 접속한 user들을 보여주기 위한 socket server 제작 필요

- 241019 오전:

  - localstorage에서 setItem, removeItem, clear 변경 수정 중 문제 발생
  - localStorage._proto_.setItem.call(localStorage, 'testKey', 'testValue')
  - 브라우저 Console에서 위 키를 입력 시 localStorage value가 변경됨
  - 그래서 indexedDB 테스트 중
  - re

- 241019 오후:
  - redux에서 전역변수를 만들어 storage의 악의적인 수정 시도 문제 해결
