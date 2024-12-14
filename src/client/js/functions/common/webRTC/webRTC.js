import { timeInterval_1 } from '../variable.js';
import storageMethod from '../storage/storageMethod.js';
import errorModal from '../popup/errorModal.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';
import { LOADING_EVENT } from '../loading.js';
import msg_str from '../msg_str.js';

let dotAni;
let matching = true;
// ENEMY DOT ANIMATION
const enemyDotAni = () => {
  const ENEMY_DOT_L = document.querySelector('.wait .enemy .dot-l');
  const ENEMY_DOT_R = document.querySelector('.wait .enemy .dot-r');
  if (!ENEMY_DOT_L || !ENEMY_DOT_R) return;
  dotAni = setInterval(function () {
    ENEMY_DOT_L.innerText += '.';
    ENEMY_DOT_R.innerText += '.';
    if (ENEMY_DOT_L.innerText.length == 4) ENEMY_DOT_L.innerText = '';
    if (ENEMY_DOT_R.innerText.length == 4) ENEMY_DOT_R.innerText = '';
    if (!matching) clearInterval(dotAni);
  }, 500);
};
// WAIT ENEMY SHOW/HIDE
const WAIT_ENEMY = {
  show: (player) => {
    const CONTAINER = document.getElementById('container');
    const WAIT = document.querySelector('.wait');
    if (!WAIT && CONTAINER) {
      let waitEl = document.createElement('div');
      let playerEl = document.createElement('span');
      let enemyEl = document.createElement('span');
      let enemyName = document.createElement('en');
      let enemyDotL = document.createElement('em');
      let enemyDotR = document.createElement('em');
      playerEl.classList.add('player');
      enemyEl.classList.add('enemy');
      enemyName.classList.add('enemy-name');
      enemyDotL.classList.add('dot-l');
      enemyDotR.classList.add('dot-r');
      enemyEl.appendChild(enemyName);
      enemyEl.insertBefore(enemyDotL, enemyEl.firstChild);
      enemyEl.appendChild(enemyDotR);
      playerEl.innerText = player;
      enemyName.innerText = 'OPPONENT';
      waitEl.classList.add('wait');
      waitEl.appendChild(playerEl);
      waitEl.appendChild(enemyEl);
      CONTAINER.appendChild(waitEl);
      setTimeout(() => {
        LOADING_EVENT.hide();
      }, timeInterval_1);
    }
  },
  hide: () => {
    if (document.querySelector('.wait')) {
      document.querySelector('.wait').remove();
      setTimeout(() => {
        // LOADING_EVENT.hide();
      }, timeInterval_1);
    }
  },
};
// WAIT ENEMY
const waitEnemy = (len, nickName) => {
  switch (len) {
    case 1:
      // wait Enemy
      WAIT_ENEMY.show(nickName);
      enemyDotAni();
      break;
    case 2:
      // wait end Enemy
      clearInterval(dotAni);
      matching = false;
      WAIT_ENEMY.hide();
      break;
    default:
      // error
      alert(text.err);
      // socket.disconnect();
      window.location.href = '/';
      break;
  }
};

export default function webRTC(gameName) {
  /**
   * WebSocket event
   */
  const CLIENT_ID = localStorage.getItem('clientId');
  if (!CLIENT_ID) return errorModal();
  const NICK_NAME = localStorage.getItem('nickName');
  if (!NICK_NAME) return errorModal();
  const DECODE_NICK_NAME = fromUnicodePoints(
    NICK_NAME.replace(/"/g, '')
      .split(',')
      .map((s) => s.trim()),
  );

  /**
   * webRCT event
   */
  let signalingSocket;
  signalingSocket = new WebSocket('ws://61.36.169.20:8081');

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
  };

  let peerConnection;
  let dataChannel;

  function otherLeavesComn() {
    LOADING_EVENT.show(msg_str('left_user'));
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null; // 연결 객체 제거
    }
    if (signalingSocket) {
      signalingSocket.close(); // WebSocket 연결 닫기
      signalingSocket = null; // 소켓 객체 제거
    }
  }

  function initConnect() {
    return new Promise((resolve, reject) => {
      peerConnection = new RTCPeerConnection(servers);

      peerConnection.ondatachannel = (event) => {
        const onDataChannel = event.channel;

        // 내 nickName을 상대방에게 전송
        // 두 번째로 접속해서 offer를 보낸 user는 sessionStorage에 ms가 있음
        if (onDataChannel && onDataChannel.readyState === 'open') {
          onDataChannel.send(
            JSON.stringify({
              type: 'sharedData',
              data: {
                nickname: localStorage.getItem('nickName'),
                clientId: sessionStorage.getItem('ms') ? sessionStorage.getItem('ms') : '',
              },
            }),
          );

          // LOADING_EVENT.hide();
          waitEnemy(2);
        }

        // TODO: 각 게임의 send 처리 필요
        const RTC_BTN = document.querySelector('.rtc-btn');
        if (!RTC_BTN) return;
        RTC_BTN.onclick = () => {
          if (onDataChannel && onDataChannel.readyState === 'open') {
            onDataChannel.send(
              JSON.stringify({
                type: 'clickMessage',
                data: 'click !!!!!!!!!!!!!!!!!',
              }),
            );
          } else {
            console.log('상대방이 방을 나감');
            otherLeavesComn();
          }
        };
      };

      // ICE 후보를 다른 브라우저로 전송 (같은 방 안에서만 전송)
      function sendCandidate(candidate) {
        console.log('candidate 보냄');
        // signalingSocket.send(JSON.stringify({ candidate }));
        signalingSocket.send(
          JSON.stringify({
            type: 'candidate',
            data: JSON.stringify({ candidate }),
          }),
        );
      }

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          sendCandidate(event.candidate);
        }
      };

      peerConnection.oniceconnectionstatechange = (event) => {
        if (peerConnection) {
          if (peerConnection.iceConnectionState === 'disconnected') {
            LOADING_EVENT.show(msg_str('left_user'));
          }
        }
      };

      peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection) {
          if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
            LOADING_EVENT.show(msg_str('left_user'));
          }
        }
      };

      dataChannel = peerConnection.createDataChannel('sendChannel');

      dataChannel.onopen = () => {
        // console.log("dataChannel is open!");
      };

      dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'sharedData') {
          storageMethod('s', 'SET_ITEM', 'yourName', message.data.nickname);
          const YOUR_NAME = sessionStorage.getItem('yourName');
          const DECODE_YOUR_NAME = fromUnicodePoints(
            YOUR_NAME.replace(/"/g, '')
              .split(',')
              .map((s) => s.trim()),
          );
          if (document.querySelector('.ur-nickname')) {
            document.querySelector('.ur-nickname').innerText = DECODE_YOUR_NAME;
          }

          if (message.data.clientId === '') {
            // storageMethod('s', 'SET_ITEM', 'clientId', JSON.parse(sessionStorage.getItem('clientId')).us);
            storageMethod('s', 'REMOVE_ITEM', 'ms');
          } else {
            storageMethod('s', 'SET_ITEM', 'clientId', message.data.clientId);
          }
        }

        // TODO: 각 게임의 onmessage 처리 필요
        if (message.type === 'clickMessage') {
          console.log('click message : ', message.data);
          document.querySelector('.message').innerText = message.data;
        }
      };

      dataChannel.onclose = () => {
        // console.log("dataChannel is closed!");
      };

      dataChannel.onerror = (error) => {
        // console.log("DataChannel error: ", error);
      };

      resolve();
    });
  }

  async function createOffer() {
    await initConnect();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Offer를 signaling 서버를 통해 첫 번째 사용자에게 전달
    signalingSocket.send(
      JSON.stringify({
        type: 'offer',
        data: JSON.stringify({ offer }),
      }),
    );

    console.log('offer 보냄');
  }

  // signalingServer 연결이 열리면
  signalingSocket.onopen = () => {
    LOADING_EVENT.hide();
    waitEnemy(1, DECODE_NICK_NAME);

    const reloaded = sessionStorage.getItem('reloaded');

    const initOnopen = () => {
      const clientId = sessionStorage.getItem('clientId');

      if (clientId) {
        // 이전에 입장한 room이 있음
        signalingSocket.send(
          JSON.stringify({
            type: 'entryOrder',
            gameName: gameName,
            clientId: clientId ?? '',
          }),
        );
      } else {
        // 새로 입장
        signalingSocket.send(JSON.stringify({ type: 'entryOrder', gameName: gameName, clientId: '' }));
      }
    };

    if (reloaded && reloaded === 'true') {
      setTimeout(initOnopen, 1000);
    } else {
      initOnopen();
    }
  };

  // signalingServer 응답
  signalingSocket.onmessage = async (message) => {
    const msgData = JSON.parse(message.data);

    if (msgData.type === 'entryOrder') {
      // 나와 매칭된 user를 sessionStorage에 저장
      if (msgData.setOffer && msgData.setOffer === 'true') {
        // storageMethod('s', 'SET_ITEM', 'clientId', JSON.stringify(msgData.clientId));
        storageMethod('s', 'SET_ITEM', 'ms', msgData.clientId.ms);
        storageMethod('s', 'SET_ITEM', 'clientId', msgData.clientId.us);
        await createOffer(); // 두번째 접속한 사람만 offer를 보내야함
      }
    }

    if (msgData.type === 'networkError') {
      console.log('Network Error');
      //
    }

    if (msgData.type === 'otherLeaves') {
      console.log('상대방이 방을 나감');
      otherLeavesComn();
    }

    if (msgData.type === 'offer') {
      console.log('offer 받음 ::: ', JSON.parse(msgData.data).offer);
      await initConnect();

      const offer = JSON.parse(msgData.data).offer;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      // Answer를 signaling 서버를 통해 첫 번째 사용자에게 전달
      signalingSocket.send(
        JSON.stringify({
          type: 'answer',
          data: JSON.stringify({ answer }),
        }),
      );

      console.log('answer 보냄');
    }

    if (msgData.type === 'answer') {
      console.log('answer 받음 ::: ', JSON.parse(msgData.data).answer);
      const answer = JSON.parse(msgData.data).answer;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    if (msgData.type === 'candidate') {
      console.log('candidate 받음 ::: ', JSON.parse(msgData.data).candidate);
      const candidate = JSON.parse(msgData.data).candidate;
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };
}
