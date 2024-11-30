import { WebSocketServer } from 'ws';

const port = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port });

let waitingUsers = []; // 대기 중인 사용자 목록

WSS.on('connection', (websocket) => {
  console.log('A user connected to WebRTC server');

  // 대기 중인 사용자가 있을 경우, 대기자와 연결
  if (waitingUsers.length > 0) {
    const waitingUser = waitingUsers.pop();
    console.log(`Connecting user with ${waitingUser.userId}`);

    // 대기 중인 사용자와 연결
    waitingUser.websocket.send(JSON.stringify({ type: 'connected', userId: waitingUser.userId }));
    websocket.send(JSON.stringify({ type: 'connected', userId: waitingUser.userId }));
  } else {
    // 대기 중인 사용자 목록에 추가
    const userId = `user_${new Date().getTime()}`;
    waitingUsers.push({ websocket, userId });
    websocket.send(JSON.stringify({ type: 'waiting', message: 'Waiting for another user to connect.' }));
    console.log(`${userId} is waiting for another user.`);
  }

  websocket.on('message', (message) => {
    console.log(`Message from WebRTC user: ${message}`);
    // WebRTC 관련 처리

    // 예: 다른 WebRTC 서버에 메시지 전송
    process.send({ type: 'webrtc', message: 'Message from WebRTC server' });
  });

  websocket.on('close', () => {
    console.log('WebRTC user disconnected');
  });
});

console.log(`WebRTC server running on port ${port}`);
