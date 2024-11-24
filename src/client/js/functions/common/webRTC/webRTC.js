// import { ws } from '../webSocket/webSocketHost.js'; // WebSocket 연결 설정
import errorModal from '../popup/errorModal.js';
import getUnicodePoints from '../unicode/getUnicodePoints.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';

export default function webRTC() {
  /**
   * WebSocket event
   */
  const SOCKET = new WebSocket('ws://61.36.169.20:8080');

  const CLIENT_ID = window.localStorage.getItem('clientId');
  if (!CLIENT_ID) return errorModal();
  const NICK_NAME = window.localStorage.getItem('nickName');
  if (!NICK_NAME) return errorModal();

  const DECODE_NICK_NAME = fromUnicodePoints(NICK_NAME.split(',').map(Number));

  if (SOCKET.readyState === WebSocket.OPEN) {
    // WebSocket이 이미 열린 경우 바로 전송
    SOCKET.send(
      JSON.stringify({
        type: 'game',
        gameName: 'taptap',
        clientId: CLIENT_ID,
        nickname: DECODE_NICK_NAME,
      }),
    );
  } else {
    // WebSocket이 열려 있지 않은 경우 open 이벤트 기다리기
    SOCKET.addEventListener(
      'open',
      () => {
        SOCKET.send(
          JSON.stringify({
            type: 'game',
            gameName: 'taptap',
            clientId: CLIENT_ID,
            nickname: DECODE_NICK_NAME,
          }),
        );
      },
      { once: true },
    ); // 한 번만 실행되도록 이벤트 리스너 설정
  }

  /**
   * webRCT event
   */
  let localConnection, remoteConnection;
  let localDataChannel, remoteDataChannel;

  // websocket 연결 종료하기
  function disconnectedWebSocket() {
    if (SOCKET.readyState === WebSocket.OPEN || SOCKET.readyState === WebSocket.CONNECTING) {
      SOCKET.close(); // WebSocket 연결 종료
      console.log('WebSocket 연결 종료됨');
    } else {
      console.log('WebSocket이 이미 종료됨');
    }
  }

  // 메시지 전송 함수
  function sendMessageEvent() {
    if (localDataChannel && localDataChannel.readyState === 'open') {
      // Sending message from local
      console.log('Sending tap from local');
      localDataChannel.send('rtc btn click...');
    }
  }

  // ICE 후보를 다른 브라우저로 전송 (같은 방 안에서만 전송)
  function sendCandidateToRemoteBrowser(_candidate) {
    SOCKET.send(JSON.stringify({ _candidate }));
  }

  // 양쪽 브라우저에서 P2P 연결을 초기화
  async function startConnection() {
    // 로컬 데이터 채널 생성
    localConnection = new RTCPeerConnection();
    localDataChannel = localConnection.createDataChannel('sendChannel');

    localDataChannel.onopen = () => {
      // Local data channel opened.
      console.log('Local data channel opened.');
      const RTC_BRN = document.querySelector('rtc-btn');
      RTC_BRN.addEventListener('click', sendMessageEvent);
    };
    localDataChannel.onclose = () => {
      // Local data channel colsed...
      console.log('Local data channel colsed...');
    };
    localDataChannel.onmessage = (event) => {
      // Received message on local data channel: event.data
      console.log('Received message on local data channel:', event.data);
    };

    // 원격 데이터 채널 처리
    remoteConnection = new RTCPeerConnection();

    remoteConnection.ondatachannel = (_event) => {
      remoteDataChannel = _event.channel;

      remoteDataChannel.onopen = () => {
        // Remote data channel opened.
        console.log('Remote data channel opened.');
        const RTC_BRN = document.querySelector('rtc-btn');
        RTC_BRN.addEventListener('click', sendMessageEvent);
      };
      remoteDataChannel.onclose = () => {
        // Remote data channel colsed...
        console.log('Remote data channel colsed...');
      };
      remoteDataChannel.onmessage = (event) => {
        // Received message on remote data channel: event.data
        console.log('Received message on remote data channel:', event.data);
      };
    };

    // ICE 후보 처리 및 신호 전송
    /*
    localConnection.onicecandidate = (_event) => {
      if (_event.candidate) {
        sendCandidateToRemoteBrowser(_event.candidate);
      }
    };
    remoteConnection.onicecandidate = (_event) => {
      if (_event.candidate) {
        sendCandidateToLocalBrowser(_event.candidate);
      }
    };
    */
  }

  // 연결 시작 (브라우저 1)
  startConnection();
}
