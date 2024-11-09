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

- 241019 오후:

  - redux에서 전역변수를 만들어 storage의 악의적인 수정 시도 문제 해결

- 241020 오전:

  - 브라우저를 2개 띄우면 2번째 접속자의 정보를 server에서 못받는 오류 발생중

- 241026 오전:

  - 브라우저에서 새로고침 시 websocket 연결이 끊기는 문제가 발생
  - socket.io와 reconnecting-websocket 두 모듈 중 고민하다가
  - reconnecting-websocket 을 사용함
  - change name을 하면, 이전에 바꾸기 전 이름이 사라지지 않는 문제발생\*\*\*\*\*

- 241027 오전:

  - 브라우저에서 연속 새로고침 시 socket에 접속된 다른 브라우저에 불필요한 요청과 응답이 발생
  - main.js에서 beforeunload를 사용해 봤지만 ios 사파리 브라우저에서 적용 안됨
  - server의 "ws.on('close', () => {})" 이 부분을 활용할 필요가 있음

- 2411102 오전:

  - window.addEventListener('pagehide', (event) => {}) 로 모든 브라우저에서 새로고침 여부 확인 가능해짐
  - init() 함수내의 함수 순서를 재조정해서 ul.user-list 를 다시 그릴지 말지 여부 판단 필요

- 2411103 오전:

  - 브라우저에서 새로고침 하면 socket 통신이 끊김
  - initUserName.js 의 if (BROWSER_RELOAD && BROWSER_RELOAD === 'true') {} 이 부분을 다시 확인해 볼 것

- 2411109 오전:
  - 브라우저에서 새로고침 시 서버에 connect/disconnect를 컨트롤 하는 것을 불가능 한 것으로 결론
  - 우선 socket 기능은 구현했으니, 메인화면부터 만들 것
