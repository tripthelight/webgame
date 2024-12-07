import { WebSocketServer } from 'ws';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const port = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port });
const redis = new Redis(); // Redis 클라이언트
const pub = new Redis(); // 메시지 발행자
const sub = new Redis(); // 메시지 구독자

const ROOMS = {}; // 방을 관리할 객체

// Redis Pub/Sub 설정
sub.subscribe('room-event'); // Redis 채널 구독
sub.on('message', (channel, message) => {
  const { roomId, senderId, data } = JSON.parse(message);

  // Redis를 통해 받은 메시지를 같은 방의 다른 클라이언트에게 전달
  if (ROOMS[roomId]) {
    ROOMS[roomId].forEach((client) => {
      if (client.id !== senderId) {
        client.ws.send(data);
      }
    });
  }
});

WSS.on('connection', (ws) => {
  let assignedRoom;
  const clientId = uuidv4(); // 클라이언트 고유 ID

  // 방 할당 로직
  for (const [room, clients] of Object.entries(ROOMS)) {
    if (clients.length < 2) {
      assignedRoom = room;
      ROOMS[room].push({ id: clientId, ws });
      break;
    }
  }

  if (!assignedRoom) {
    assignedRoom = `room-${uuidv4()}`;
    ROOMS[assignedRoom] = [{ id: clientId, ws }];
  }

  ws.room = assignedRoom;
  console.log(`Client connected to ${assignedRoom} in worker ${process.pid}`);

  ws.on('message', (message) => {
    const roomClients = ROOMS[ws.room];

    // 같은 방에 있는 다른 클라이언트에게 메시지 전송
    roomClients.forEach((client) => {
      if (client.ws !== ws) {
        client.ws.send(message);
      }
    });

    // Redis를 통해 다른 서버에도 메시지 전달
    pub.publish(
      'room-event',
      JSON.stringify({
        roomId: ws.room,
        senderId: clientId,
        data: message,
      }),
    );
  });

  ws.on('close', () => {
    ROOMS[ws.room] = ROOMS[ws.room].filter((client) => client.ws !== ws);
    if (ROOMS[ws.room].length === 0) {
      delete ROOMS[ws.room]; // 방이 비어 있으면 삭제
    }
    console.log(`Client disconnected from ${ws.room} in worker ${process.pid}`);
  });
});

console.log(`WebRTC server running on port ${port}`);
