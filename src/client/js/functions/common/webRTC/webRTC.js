// import { ws } from '../webSocket/webSocketHost.js'; // WebSocket 연결 설정
import errorModal from '../popup/errorModal.js';
import getUnicodePoints from '../unicode/getUnicodePoints.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';

export default function webRTC() {
  /**
   * WebSocket event
   */
  const SOCKET = new WebSocket('ws://61.36.169.20:8081');

  const CLIENT_ID = window.localStorage.getItem('clientId');
  if (!CLIENT_ID) return errorModal();
  const NICK_NAME = window.localStorage.getItem('nickName');
  if (!NICK_NAME) return errorModal();

  const DECODE_NICK_NAME = fromUnicodePoints(NICK_NAME.split(',').map(Number));

  /**
   * webRCT event
   */
  let localConnection, remoteConnection;
  let localDataChannel, remoteDataChannel;

  // websocket 연결 종료하기
  /*
  function disconnectedWebSocket() {
    if (SOCKET.readyState === WebSocket.OPEN || SOCKET.readyState === WebSocket.CONNECTING) {
      SOCKET.close(); // WebSocket 연결 종료
      console.log('WebSocket 연결 종료됨');
    } else {
      console.log('WebSocket이 이미 종료됨');
    }
  }
  */

  // 신호 메시지 처리
  const handleMessageFromRemote = async (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.offer) {
      await remoteConnection.setRemoteDescription(new RTCSessionDescription(parsedMessage.offer));
      const answer = await remoteConnection.createAnswer();
      await remoteConnection.setLocalDescription(answer);
      sendAnswerToLocalBrowser(answer);
    } else if (parsedMessage.answer) {
      await localConnection.setRemoteDescription(new RTCSessionDescription(parsedMessage.answer));
    } else if (parsedMessage.candidate) {
      const candidate = new RTCIceCandidate(parsedMessage.candidate);

      if (localConnection.remoteDescription) {
        await localConnection.addIceCandidate(candidate);
      } else if (remoteConnection.remoteDescription) {
        await remoteConnection.addIceCandidate(candidate);
      }
    }
  };

  // WebSocket 메시지 수신 핸들러
  SOCKET.onmessage = async (event) => {
    let messageData;
    if (typeof event.data === 'string') {
      messageData = event.data;
    } else if (event.data instanceof Blob) {
      messageData = await event.data.text();
    }

    handleMessageFromRemote(messageData);
  };

  // 메시지 전송 함수
  function sendMessageEvent() {
    if (localDataChannel && localDataChannel.readyState === 'open') {
      // Sending message from local
      console.log('Sending tap from local');
      localDataChannel.send('local rtc btn click...');
    }

    if (remoteDataChannel && remoteDataChannel.readyState === 'open') {
      remoteDataChannel.send('remote rtc btn click...');
    }
  }

  // Offer를 다른 브라우저로 전송
  function sendOfferToRemoteBrowser(offer) {
    SOCKET.send(JSON.stringify({ offer }));
  }

  // Answer를 다른 브라우저로 전송
  function sendAnswerToLocalBrowser(answer) {
    SOCKET.send(JSON.stringify({ answer }));
  }

  // ICE 후보를 다른 브라우저로 전송 (같은 방 안에서만 전송)
  function sendCandidateToRemoteBrowser(candidate) {
    SOCKET.send(JSON.stringify({ candidate }));
  }

  // ICE 후보를 같은 방 안의 다른 브라우저로 전송
  function sendCandidateToLocalBrowser(candidate) {
    SOCKET.send(JSON.stringify({ candidate }));
  }

  // 양쪽 브라우저에서 P2P 연결을 초기화
  async function startConnection() {
    // 로컬 데이터 채널 생성
    localConnection = new RTCPeerConnection();
    localDataChannel = localConnection.createDataChannel('sendChannel');

    localDataChannel.onopen = () => {
      // Local data channel opened.
      console.log('Local data channel opened.');
      const RTC_BTN = document.querySelector('.rtc-btn');
      RTC_BTN.addEventListener('click', sendMessageEvent);
    };
    localDataChannel.onclose = () => {
      // Local data channel colsed...
      console.log('Local data channel colsed...');
    };
    localDataChannel.onmessage = (event) => {
      // Received message on local data channel: event.data
      console.log('Received message on local data channel:', event.data);
    };

    // ICE 후보 처리 및 신호 전송
    localConnection.onicecandidate = (_event) => {
      if (_event.candidate) {
        sendCandidateToRemoteBrowser(_event.candidate);
      }
    };

    // 원격 데이터 채널 처리
    remoteConnection = new RTCPeerConnection();

    remoteConnection.ondatachannel = (_event) => {
      remoteDataChannel = _event.channel;

      remoteDataChannel.onopen = () => {
        // Remote data channel opened.
        console.log('Remote data channel opened.');
        const RTC_BTN = document.querySelector('.rtc-btn');
        RTC_BTN.addEventListener('click', sendMessageEvent);
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

    remoteConnection.onicecandidate = (_event) => {
      if (_event.candidate) {
        sendCandidateToLocalBrowser(_event.candidate);
      }
    };

    // Offer 생성 및 전송 (양쪽 브라우저에서 연결을 시도)
    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    sendOfferToRemoteBrowser(offer);
  }

  // 연결 시작 (브라우저 1)
  startConnection();
}
