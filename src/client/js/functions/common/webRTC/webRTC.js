import { ws } from '../webSocket/webSocketHost.js'; // WebSocket 연결 설정

export default function webRTC() {
  let localConnection, remoteConnection;
  let localDataChannel, remoteDataChannel;

  // WebSocket 메시지 수신 핸들러
  ws.onmessage = async (event) => {
    console.log('on message...');

    let messageData;
    if (typeof event.data === 'string') {
      messageData = event.data;
    } else if (event.data instanceof Blob) {
      messageData = await event.data.text();
    }

    handleMessageFromRemote(messageData);
  };

  // Offer를 다른 브라우저로 전송
  function sendOfferToRemoteBrowser(offer) {
    ws.send(JSON.stringify({ offer }));
  }

  // Answer를 다른 브라우저로 전송
  function sendAnswerToLocalBrowser(answer) {
    ws.send(JSON.stringify({ answer }));
  }

  // ICE 후보를 다른 브라우저로 전송 (같은 방 안에서만 전송)
  function sendCandidateToRemoteBrowser(candidate) {
    ws.send(JSON.stringify({ candidate }));
  }

  // ICE 후보를 같은 방 안의 다른 브라우저로 전송
  function sendCandidateToLocalBrowser(candidate) {
    ws.send(JSON.stringify({ candidate }));
  }

  // 양쪽 브라우저에서 P2P 연결을 초기화
  async function startConnection() {
    // 로컬 데이터 채널 생성
    localConnection = new RTCPeerConnection();
    localDataChannel = localConnection.createDataChannel('sendChannel');

    localDataChannel.onopen = () => {
      console.log('Local data channel opened.');
      // document.addEventListener('click', sendTapEvent);
      const RTC_BTN = document.querySelector('.rtc-btn');
      RTC_BTN.addEventListener('click', sendTapEvent);
    };

    localDataChannel.onclose = () => {
      console.log('Local data channel closed.');
    };

    localDataChannel.onmessage = (event) => {
      console.log('Received message on local data channel:', event.data);
    };

    // 원격 데이터 채널 처리
    remoteConnection = new RTCPeerConnection();

    remoteConnection.ondatachannel = (event) => {
      remoteDataChannel = event.channel;

      remoteDataChannel.onopen = () => {
        console.log('Remote data channel opened.');
        // document.addEventListener('click', sendTapEvent);
        const RTC_BTN = document.querySelector('.rtc-btn');
        RTC_BTN.addEventListener('click', sendTapEvent);
      };

      remoteDataChannel.onclose = () => {
        console.log('Remote data channel closed.');
      };

      remoteDataChannel.onmessage = (event) => {
        console.log('Received message on remote data channel:', event.data);
      };
    };

    // ICE 후보 처리 및 신호 전송
    localConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendCandidateToRemoteBrowser(event.candidate);
      }
    };

    remoteConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendCandidateToLocalBrowser(event.candidate);
      }
    };

    // Offer 생성 및 전송 (양쪽 브라우저에서 연결을 시도)
    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    sendOfferToRemoteBrowser(offer);
  }

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
      if (remoteConnection.remoteDescription) {
        await remoteConnection.addIceCandidate(candidate);
      } else {
        await localConnection.addIceCandidate(candidate);
      }
    }
  };

  // 메시지 전송 함수
  const sendTapEvent = () => {
    if (localDataChannel && localDataChannel.readyState === 'open') {
      localDataChannel.send('tap from local');
      console.log('Sending tap from local');
    } else {
      console.error('Local data channel is not open. Current state:', localDataChannel.readyState);
    }

    if (remoteDataChannel && remoteDataChannel.readyState === 'open') {
      remoteDataChannel.send('tap from remote');
      console.log('Sending tap from remote');
    } else {
      // console.error('Remote data channel is not open or undefined.');
    }
  };

  // 연결 시작 (브라우저 1)
  startConnection();
}
