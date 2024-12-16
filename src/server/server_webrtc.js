import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

// WebSocket 서버 생성
const PORT = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port: PORT });
const REDIS = new Redis(); // 6379 단일 redis server
const NAMESPACE = 'ROOMS';
const ROOMS_MAP = {}; // room name과 WebSocket 인스턴스를 매핑할 Map
const GAMES_MAP = {}; // socketId와 WebSocket 인스턴스를 매핑할 Map
const STANDBY_SET = {}; // standby 상태인 사용자만 저장

/*
ROOMS_MAP = {
  "game-name-1" : {
    "room-name-1" : [socket, socket],
    "room-name-2" : [socket, socket],
    "room-name-3" : [socket, socket],
  },
  "game-name-2" : {
    "room-name-4" : [socket, socket],
    "room-name-5" : [socket, socket],
  },
}

GAMES_MAP = {
  "game-name-1" : {
    "socketId-1" : { socket },
    "socketId-2" : { socket },
    "socketId-3" : { socket },
  },
  "game-name-2" : {
    "socketId-4" : { socket },
    "socketId-5" : { socket },
  },
}

STANDBY_SET = ["socketId-1", "socketId-2", "socketId-3", "socketId-4"]
*/

async function roomsMapInit(data) {
  return new Promise((resolve, reject) => {
    const { msgData, socket } = data;

    if (msgData.roomName) {
      socket.roomName = msgData.roomName;
      if (msgData.gameName) {
        socket.gameName = msgData.gameName;
        if (ROOMS_MAP[socket.gameName]) {
          if (ROOMS_MAP[socket.gameName].get(socket.roomName)) {
            ROOMS_MAP[socket.gameName].get(socket.roomName).push(socket);
          } else {
            ROOMS_MAP[socket.gameName].set(socket.roomName, [socket]);
          }
        } else {
          ROOMS_MAP[socket.gameName] = new Map();
          ROOMS_MAP[socket.gameName].set(socket.roomName, [socket]);
        }
      }
    }

    resolve();
  });
}

async function handleEntryOrder(data) {
  return new Promise((resolve, reject) => {
    const { msgData, socket } = data;

    socket.gameName = msgData.gameName;

    if (!ROOMS_MAP[socket.gameName]) ROOMS_MAP[socket.gameName] = new Map(); // gameName 에 따라 Map 생성
    if (!GAMES_MAP[socket.gameName]) GAMES_MAP[socket.gameName] = new Map(); // gameName 에 따라 Map 생성
    if (!STANDBY_SET[socket.gameName]) STANDBY_SET[socket.gameName] = new Set(); // gameName 에 따라 standby 상태만 Set 생성

    const roomName = msgData.roomName;

    resolve();
  });
}

// 연결된 클라이언트 처리
WSS.on('connection', async (socket) => {
  // 새로 입장했을 때, socket에 고유한 socketId 부여
  if (!socket.socketId) socket.socketId = uuidv4();

  socket.on('message', async (message) => {
    const msgData = JSON.parse(message);
    const DATA = { msgData, socket };

    await roomsMapInit(DATA);

    if (msgData.type === 'entryOrder') {
      await handleEntryOrder(DATA);
    }

    if (msgData.type === 'offer' || msgData.type === 'answer' || msgData.type === 'candidate') {
      //
    }
  });

  // 클라이언트 연결 종료 시
  socket.on('close', () => {
    const roomsMapState = socket.gameName && socket.roomName && ROOMS_MAP[socket.gameName] && ROOMS_MAP[socket.gameName].get(socket.roomName);
    if (roomsMapState) {
      const room = ROOMS_MAP[socket.gameName].get(socket.roomName);
      const index = room.indexOf(socket);
      if (index !== -1) {
        room.splice(index, 1); // socket을 배열에서 삭제
      }
      if (ROOMS_MAP[socket.gameName].get(socket.roomName).length === 0) {
        ROOMS_MAP[socket.gameName].delete(socket.roomName);
      }
    }

    const gamesMapState = socket.gameName && socket.socketId && GAMES_MAP[socket.gameName] && GAMES_MAP[socket.gameName].get(socket.socketId);
    if (gamesMapState) {
      GAMES_MAP[socket.gameName].delete(socket.socketId);
    }

    const standbySetState = socket.gameName && socket.socketId && STANDBY_SET[socket.gameName] && STANDBY_SET[socket.gameName].has(socket.socketId);
    if (standbySetState) {
      STANDBY_SET[socket.gameName].delete(socket.socketId);
    }
  });
});

console.log(`WebRTC server ${process.pid} running on port ${PORT}`);
