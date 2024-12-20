import storageMethod from '../storage/storageMethod.js';
import errorModal from '../popup/errorModal.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';
import { LOADING_EVENT } from '../loading.js';
import msg_str from '../msg_str.js';
import waitPeer from './waitPeer.js';

import LOADING from '../../module/client/common/loading.js';
import taptapRes from '../../../game/taptap/taptapRes.js';
import taptapReq from '../../../game/taptap/taptapReq.js';
import taptapGameState from '../../../gameState/taptap.js';
import screenClickEvent from '../../../game/taptap/screenClickEvent.js';
import connectResult from '../../module/peerConn/taptap/connectResult.js';
import connectRefresh from '../../module/peerConn/taptap/connectRefresh.js';
import refreshEvent from '../../../refresh/taptap/taptap.js';
import cowndown from '../../../game/taptap/cowndown.js';
import countStyle from '../../../game/taptap/countStyle.js';
import errorComn from '../../module/client/common/errorComn.js';

const servers = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

let signalingSocket = null;
let peerConnection = null;
let dataChannel = null;
export let onDataChannel = null;

export function otherLeavesComn() {
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

async function initConnect() {
  return new Promise((resolve, reject) => {
    peerConnection = new RTCPeerConnection(servers);

    peerConnection.ondatachannel = (event) => {
      // const onDataChannel = event.channel;
      onDataChannel = event.channel;

      // 내 nickName을 상대방에게 전송
      if (onDataChannel && onDataChannel.readyState === 'open') {
        onDataChannel.send(
          JSON.stringify({
            type: 'sharedData',
            nickname: localStorage.getItem('nickName'),
          }),
        );

        waitPeer(2);
      }

      switch (sessionStorage.getItem('gameName')) {
        case 'taptap':
          console.log('step 1 ::: ');

          const gameState = window.sessionStorage.getItem('gameState');
          if (gameState === 'waitEnemy') {
            console.log('waitEnemy 새로 진입 >>>>>>>>>>> ');
            taptapRes.waitEnemy();
          }

          if (gameState === 'count' || gameState === 'playing' || gameState === 'gameOver') {
            connectRefresh();
          }

          break;
        default:
          break;
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
      const onmessagePromise = new Promise((resolve, reject) => {
        resolve(event);
      });
      onmessagePromise
        .then((_event) => {
          const message = JSON.parse(_event.data);
          if (message.type === 'sharedData') {
            storageMethod('s', 'SET_ITEM', 'yourName', message.nickname);
            const YOUR_NAME = sessionStorage.getItem('yourName');
            const DECODE_YOUR_NAME = fromUnicodePoints(
              YOUR_NAME.replace(/"/g, '')
                .split(',')
                .map((s) => s.trim()),
            );
            if (document.querySelector('.ur-nickname')) {
              document.querySelector('.ur-nickname').innerText = DECODE_YOUR_NAME;
            }
          }

          // TODO: 각 게임의 onmessage 처리 필요
          if (message.type === 'clickMessage') {
            console.log('click message : ', message.data);
            document.querySelector('.message').innerText = message.data;
          }

          switch (sessionStorage.getItem('gameName')) {
            case 'taptap':
              taptapReq(message);
              break;
            default:
              break;
          }
        })
        .catch(otherLeavesComn);
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

function handleMessage(msgData) {
  const handleMessagePromise = new Promise((resolve) => {
    resolve(msgData);
  });

  handleMessagePromise
    .then(async (msgData) => {
      if (msgData.type === 'entryOrder') {
        // 나와 매칭된 user를 sessionStorage에 저장
        if (msgData.roomName) {
          storageMethod('s', 'SET_ITEM', 'roomName', msgData.roomName);
        }
        if (msgData.setOffer && msgData.setOffer === 'true') {
          await createOffer(); // 두번째 접속한 사람만 offer를 보내야함
        }
      }

      if (msgData.type === 'networkError') {
        otherLeavesComn();
      }

      if (msgData.type === 'otherLeaves') {
        console.log('otherLeaves ::: ', msgData.msg);
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
    })
    .catch(otherLeavesComn);
}

const initOnopen = () => {
  return new Promise((resolve, reject) => {
    signalingSocket.send(
      JSON.stringify({
        type: 'entryOrder',
        gameName: sessionStorage.getItem('gameName'),
        roomName: sessionStorage.getItem('roomName') ?? null,
      }),
    );
    resolve();
  });
};

export function webRTC(gameName) {
  const NICK_NAME = localStorage.getItem('nickName');
  if (!NICK_NAME) return errorModal();
  const DECODE_NICK_NAME = fromUnicodePoints(
    NICK_NAME.replace(/"/g, '')
      .split(',')
      .map((s) => s.trim()),
  );
  if (document.querySelector('.my-nickname')) {
    document.querySelector('.my-nickname').innerText = DECODE_NICK_NAME;
  }
  storageMethod('s', 'SET_ITEM', 'gameName', gameName);

  signalingSocket = new WebSocket('ws://61.36.169.20:8081');

  // signalingServer 연결이 열리면
  signalingSocket.onopen = async () => {
    if (!window.sessionStorage.getItem('gameState')) {
      taptapGameState.waitEnemy();
    }

    LOADING_EVENT.hide();
    waitPeer(1, DECODE_NICK_NAME);
    await initOnopen();
  };

  // signalingServer 응답
  signalingSocket.onmessage = async (message) => {
    try {
      const msgData = JSON.parse(message.data);
      handleMessage(msgData);
    } catch (error) {
      errorComn(error);
    }
  };
}
