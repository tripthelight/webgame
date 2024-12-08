// import { ws } from '../webSocket/webSocketHost.js'; // WebSocket 연결 설정
import storageMethod from '../storage/storageMethod.js';
import errorModal from '../popup/errorModal.js';
import getUnicodePoints from '../unicode/getUnicodePoints.js';
import fromUnicodePoints from '../unicode/fromUnicodePoints.js';

export default function webRTC() {
  /**
   * WebSocket event
   */

  const CLIENT_ID = window.localStorage.getItem('clientId');
  if (!CLIENT_ID) return errorModal();
  const NICK_NAME = window.localStorage.getItem('nickName');
  if (!NICK_NAME) return errorModal();

  const DECODE_NICK_NAME = fromUnicodePoints(NICK_NAME.split(',').map(Number));

  /**
   * webRCT event
   */
  let signalingSocket;
  // signalingSocket = new WebSocket('ws://61.36.169.20:8081');
  signalingSocket = new WebSocket('ws://61.36.169.5:8081');

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
  };

  let peerConnection;
  let dataChannel;

  function initConnect() {
    return new Promise((resolve) => {
      peerConnection = new RTCPeerConnection(servers);
      dataChannel = peerConnection.createDataChannel('sendChannel');

      peerConnection.ondatachannel = (event) => {
        const onDataChannel = event.channel;
        // 내 nickName을 상대방에게 전송

        if (onDataChannel && onDataChannel.readyState === 'open') {
          onDataChannel.send(
            JSON.stringify({
              type: 'nickName',
              data: window.localStorage.getItem('nickName'),
            }),
          );
        }

        const RTC_BTN = document.querySelector('.rtc-btn');
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
          }
        };
      };

      dataChannel.onopen = () => {
        // console.log("dataChannel is open!");
      };

      dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'nickName') {
          storageMethod('s', 'SET_ITEM', 'yourName', message.data);
          const YOUR_NAME = window.sessionStorage.getItem('yourName');
          const DECODE_YOUR_NAME = fromUnicodePoints(
            YOUR_NAME.replace(/"/g, '')
              .split(',')
              .map((s) => s.trim()),
          );

          document.querySelector('.ur-nickname').innerText = DECODE_YOUR_NAME;
        }
        if (message.type === 'clickMessage') {
          console.log('click message : ', message.data);
        }
      };

      dataChannel.onclose = () => {
        // console.log("dataChannel is closed!");
      };

      dataChannel.onerror = (error) => {
        // console.log("DataChannel error: ", error);
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
        // console.log("ICE Connection State: ", peerConnection.iceConnectionState);
        if (peerConnection && peerConnection.iceConnectionState === 'connected') {
          // console.log("Bridges are successfully connected!");
        }
      };

      peerConnection.onconnectionstatechange = (event) => {
        // console.log("Peer connection state: ", peerConnection.connectionState);
        if (dataChannel && dataChannel.readyState === 'open') {
          // console.log("Data channel is open, communication can begin!");
        }
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
    const initOnopen = () => {
      document.querySelector('.my-nickname').innerText = DECODE_NICK_NAME;
      const roomName = window.sessionStorage.getItem('roomName');
      const yourName = window.sessionStorage.getItem('yourName');
      if (roomName) {
        // 이전에 입장한 room이 있음
        signalingSocket.send(
          JSON.stringify({
            type: 'entryOrder',
            room: roomName,
            yourName: yourName ?? '',
          }),
        );
      } else {
        // 새로 입장
        signalingSocket.send(JSON.stringify({ type: 'entryOrder', room: '', yourName: '' }));
      }
    };
    initOnopen();
  };

  // signalingServer 응답
  signalingSocket.onmessage = async (message) => {
    const msgData = JSON.parse(message.data);

    if (msgData.type === 'entryOrder') {
      console.log('msgData.userLength ::: ', msgData.userLength);

      // 내가 입장한 rooom name을 sessionStorage에 저장
      if (!window.sessionStorage.getItem('roomName')) {
        storageMethod('s', 'SET_ITEM', 'roomName', msgData.room);
      } else {
        if (!window.sessionStorage.getItem('yourName')) {
          storageMethod('s', 'SET_ITEM', 'roomName', msgData.room);
        }
      }
      if (msgData.userLength === 2) {
        await createOffer(); // 두번째 접속한 사람만 offer를 보내야함
      }
    }

    if (msgData.type === 'otherLeaves') {
      console.log('상대방이 방을 나감');
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null; // 연결 객체 제거
        console.log('너도 타냐 1 peerConnection :::::::::: ');
      }
      if (signalingSocket) {
        signalingSocket.close(); // WebSocket 연결 닫기
        signalingSocket = null; // 소켓 객체 제거
        console.log('너도 타냐 2 signalingSocket :::::::::: ');
      }
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
