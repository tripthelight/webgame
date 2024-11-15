import {LOADING_EVENT} from "../common/loading.js";
import msg_str from "../common/msg_str.js";

let localConnection, remoteConnection;
let localDataChannel, remoteDataChannel;
let room;

// WebSocket 연결 설정
const socket = new WebSocket("ws://localhost:8080");

// WebSocket 메시지 수신 핸들러
socket.onmessage = async event => {
  let messageData;
  if (typeof event.data === "string") {
    messageData = event.data;
  } else if (event.data instanceof Blob) {
    messageData = await event.data.text();
  }

  handleMessageFromRemote(messageData);
};

// Offer를 다른 브라우저로 전송
function sendOfferToRemoteBrowser(offer) {
  socket.send(JSON.stringify({offer}));
}

// Answer를 다른 브라우저로 전송
function sendAnswerToLocalBrowser(answer) {
  socket.send(JSON.stringify({answer}));
}

// ICE 후보를 다른 브라우저로 전송 (같은 방 안에서만 전송)
function sendCandidateToRemoteBrowser(candidate) {
  socket.send(JSON.stringify({candidate}));
}

// ICE 후보를 같은 방 안의 다른 브라우저로 전송
function sendCandidateToLocalBrowser(candidate) {
  socket.send(JSON.stringify({candidate}));
}

// 양쪽 브라우저에서 P2P 연결을 초기화
async function startConnection() {
  // 로컬 데이터 채널 생성
  localConnection = new RTCPeerConnection();
  localDataChannel = localConnection.createDataChannel("sendChannel");

  localDataChannel.onopen = () => {
    console.log("Local data channel opened.");
    LOADING_EVENT.hide();
    document.addEventListener("click", sendTapEvent);
  };

  localDataChannel.onclose = () => {
    console.log("Local data channel closed.");
    LOADING_EVENT.show(msg_str("reconnect"));
  };

  localConnection.oniceconnectionstatechange = () => {
    if (localConnection.iceConnectionState === "disconnected") {
      console.log("localConnection has disconnected");
      // 상대방이 연결을 끊었을 때 처리할 로직을 여기에 작성
      LOADING_EVENT.show(msg_str("left_user"));
    }
  };

  localDataChannel.onmessage = event => {
    console.log("Received message on local data channel:", event.data);
  };

  // 원격 데이터 채널 처리
  remoteConnection = new RTCPeerConnection();

  remoteConnection.ondatachannel = event => {
    remoteDataChannel = event.channel;

    remoteDataChannel.onopen = () => {
      console.log("Remote data channel opened.");
      LOADING_EVENT.hide();
      document.addEventListener("click", sendTapEvent);
    };

    remoteDataChannel.onclose = () => {
      console.log("Remote data channel closed.");
      LOADING_EVENT.show(msg_str("reconnect"));
    };

    remoteConnection.oniceconnectionstatechange = () => {
      if (remoteConnection.iceConnectionState === "disconnected") {
        console.log("remoteConnection has disconnected");
        // 상대방이 연결을 끊었을 때 처리할 로직을 여기에 작성
        LOADING_EVENT.show(msg_str("left_user"));
      }
    };

    remoteDataChannel.onmessage = event => {
      console.log("Received message on remote data channel:", event.data);
    };
  };

  // ICE 후보 처리 및 신호 전송
  localConnection.onicecandidate = event => {
    if (event.candidate) {
      sendCandidateToRemoteBrowser(event.candidate);
    }
  };

  remoteConnection.onicecandidate = event => {
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
const handleMessageFromRemote = async message => {
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
  if (localDataChannel && localDataChannel.readyState === "open") {
    localDataChannel.send("tap from local");
    console.log("Sending tap from local");
  } else {
    console.error("Local data channel is not open. Current state:", localDataChannel.readyState);
  }

  if (remoteDataChannel && remoteDataChannel.readyState === "open") {
    remoteDataChannel.send("tap from remote");
    console.log("Sending tap from remote");
  } else {
    console.error("Remote data channel is not open or undefined.");
  }
};

// 연결 시작 (브라우저 1)
startConnection();

// index.html에서 접속한 모든 사용자를 표시
// https://chatgpt.com/c/66fb67fb-d128-800f-98a5-7ac64761dbad
socket.addEventListener("message", event => {
  const data = JSON.parse(event.data);

  if (data.type === "userList") {
    console.log("data.users ::: ", data.users);
  }
});
