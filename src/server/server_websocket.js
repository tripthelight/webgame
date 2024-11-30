import { WebSocketServer } from 'ws';

const port = process.env.PORT || 8082;
const WSS = new WebSocketServer({ port });

const users = []; // 접속한 사용자 목록을 저장하는 배열

WSS.on('connection', (websocket) => {
  // 새로운 사용자가 접속하면 사용자 목록에 추가
  const userId = `user_${new Date().getTime()}`;
  users.push(userId);

  console.log(`${userId} connected`);

  // 접속한 모든 사용자 목록을 클라이언트에 전달
  websocket.send(JSON.stringify({ type: 'userList', users }));

  websocket.on('message', (message) => {
    console.log(`Received message from ${userId}: ${message}`);

    // 예: 다른 WebSocket 서버에 메시지 전송
    process.send({ type: 'websocket', message: 'Message from WebSocket server' });
  });

  websocket.on('close', () => {
    // 사용자가 접속을 끊으면 목록에서 제거
    const index = users.indexOf(userId);
    if (index !== -1) {
      users.splice(index, 1);
    }
    console.log(`${userId} disconnected`);
  });
});

console.log(`WebSocket server running on port ${port}`);
