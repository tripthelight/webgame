import {WebSocketServer} from "ws";
import Redis from "ioredis";

const redis = new Redis(); // Redis 클라이언트 생성
const pub = new Redis(); // 메시지 발행 클라이언트
const sub = new Redis(); // 메시지 구독 클라이언트

const wss = new WebSocketServer({port: 8080});

let rooms = {}; // 방을 관리할 객체
let roomCounter = 0;

// Redis에서 메시지를 수신하고 클라이언트로 전달
sub.on("message", (channel, message) => {
  const {room, data} = JSON.parse(message);
  const roomClients = rooms[room];
  if (roomClients) {
    roomClients.forEach(client => {
      client.send(data);
    });
  }
});

wss.on("connection", ws => {
  let assignedRoom;

  // 방 할당 로직
  for (const [room, clients] of Object.entries(rooms)) {
    if (clients.length < 2) {
      assignedRoom = room;
      rooms[room].push(ws);
      break;
    }
  }

  if (!assignedRoom) {
    roomCounter++;
    assignedRoom = `room-${roomCounter}`;
    rooms[assignedRoom] = [ws];
  }

  ws.room = assignedRoom;
  console.log(`Client connected to ${assignedRoom}`);

  ws.on("message", message => {
    // 메시지를 Redis에 발행
    pub.publish("webrtc", JSON.stringify({room: ws.room, data: message}));
  });

  ws.on("close", () => {
    rooms[ws.room] = rooms[ws.room].filter(client => client !== ws);
    if (rooms[ws.room].length === 0) {
      delete rooms[ws.room]; // 방이 비어 있으면 삭제
    }
    console.log(`Client disconnected from ${ws.room}`);
  });
});

sub.subscribe("webrtc"); // webrtc 채널 구독

console.log("WebSocket server with Redis is running on ws://localhost:8080");
