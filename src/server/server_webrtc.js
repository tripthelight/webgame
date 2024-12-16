import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

// WebSocket 서버 생성
const PORT = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port: PORT });
const REDIS = new Redis(); // 6379 단일 redis server
const ROOMS_MAP = {}; // room name과 WebSocket 인스턴스를 매핑할 Map
const STANDBY_MAP = {}; // standby 상태인 사용자만 저장

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
STANDBY_MAP = {
  "game-name-1" : {
    "socketId-1" : socket,
    "socketId-2" : socket,
  },
  "game-name-2" : {
    "socketId-1" : socket,
    "socketId-2" : socket,
  }
}
*/

// roomName이 있는지 check
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

// 처음 입장
async function firstEntry(socket) {
  return new Promise(async (resolve, reject) => {
    // standby 상태 user 찾기
    const STANDBY_USER_LIST = [...STANDBY_MAP[socket.gameName]];
    if (STANDBY_USER_LIST.length > 0) {
      const diffSocketId = STANDBY_MAP[socket.gameName].keys().next().value; // 첫 번째 키
      const diffSocket = STANDBY_MAP[socket.gameName].values().next().value; // 첫 번째 값
      if (diffSocket) {
        STANDBY_MAP[socket.gameName].delete(diffSocketId);
        const NEW_ROOM_NAME = uuidv4();
        ROOMS_MAP[socket.gameName].set(NEW_ROOM_NAME, [socket, diffSocket]);
        socket.roomName = NEW_ROOM_NAME;
        diffSocket.roomName = socket.roomName;

        if (diffSocket && diffSocket.readyState === WebSocket.OPEN) {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: 'entryOrder',
                roomName: socket.roomName,
                setOffer: 'true',
              }),
            );
            diffSocket.send(
              JSON.stringify({
                type: 'entryOrder',
                roomName: socket.roomName,
              }),
            );
          } else {
            // 내 socket이 없음 : network 장애
            socket.send(JSON.stringify({ type: 'networkError' }));
          }
        } else {
          // 대기하고 있던 user 나감
          // 나는 대기 중 상태로 변경
          STANDBY_MAP[socket.gameName].set(socket.socketId, socket);
        }
      } else {
        // 대기하고 있던 user 나감
        // 나는 대기 중 상태로 변경
        STANDBY_MAP[socket.gameName].set(socket.socketId, socket);
      }
    } else {
      // 내 gameName에 standby 상태인 user 없음
      STANDBY_MAP[socket.gameName].set(socket.socketId, socket);
    }

    resolve();
  });
}

async function watiRefreshUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

// 게임 중 새로고침
async function refreshDuringGame(data) {
  return new Promise(async (resolve, reject) => {
    const { socket, roomName } = data;

    if (ROOMS_MAP[socket.gameName] && ROOMS_MAP[socket.gameName].get(roomName)) {
      if (ROOMS_MAP[socket.gameName].get(roomName).length !== 2) {
        await watiRefreshUser();
      }
      if (ROOMS_MAP[socket.gameName].get(roomName).length === 2) {
        const DIFF_SOCKET = ROOMS_MAP[socket.gameName].get(roomName).find((ws) => ws !== socket);
        if (DIFF_SOCKET) {
          DIFF_SOCKET.send(
            JSON.stringify({
              type: 'entryOrder',
              roomName: socket.roomName,
              setOffer: 'true',
            }),
          );
        } else {
          socket.send(JSON.stringify({ type: 'otherLeaves', msg: 'r1' }));
        }
      } else {
        // 2) 게임 중 한 명이 나간 상태에서 나머지 한 명이 새로고침
        // 3) 양쪽이 동시에 새로고침
        socket.send(JSON.stringify({ type: 'otherLeaves', msg: 'r2' }));
      }
    } else {
      socket.send(JSON.stringify({ type: 'otherLeaves', msg: 'r3' }));
    }

    resolve();
  });
}

async function handleEntryOrder(data) {
  return new Promise(async (resolve, reject) => {
    const { msgData, socket } = data;

    socket.gameName = msgData.gameName;

    if (!ROOMS_MAP[socket.gameName]) ROOMS_MAP[socket.gameName] = new Map(); // gameName 에 따라 Map 생성
    if (!STANDBY_MAP[socket.gameName]) STANDBY_MAP[socket.gameName] = new Map(); // gameName 에 따라 standby 상태만 Map 생성

    if (msgData.roomName) {
      // 게임 중 새로고침
      await refreshDuringGame({ socket, roomName: msgData.roomName }).catch(() => {
        socket.send(JSON.stringify({ type: 'otherLeaves', msg: 'r4' }));
      });
    } else {
      // 처음 입장
      await firstEntry(socket);
    }
    resolve();
  });
}

async function offerAnserCandidateDataProcess(resData) {
  return new Promise((resolve, reject) => {
    const { msgData, socket } = resData;
    if (msgData && socket) {
      if (socket.gameName && socket.roomName && ROOMS_MAP[socket.gameName] && ROOMS_MAP[socket.gameName].get(socket.roomName) && ROOMS_MAP[socket.gameName].get(socket.roomName).length === 2) {
        const DIFF_SOCKET = ROOMS_MAP[socket.gameName].get(socket.roomName).find((ws) => ws !== socket);
        if (DIFF_SOCKET && DIFF_SOCKET.readyState === WebSocket.OPEN) {
          DIFF_SOCKET.send(JSON.stringify({ type: msgData.type, data: msgData.data }));
        } else {
          reject();
        }
      } else {
        reject();
      }
    } else {
      reject();
    }
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
      await offerAnserCandidateDataProcess({ msgData, socket }).catch(() => {
        socket.send(JSON.stringify({ type: 'otherLeaves', msg: '2' }));
      });
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

    const standbyMapState = socket.gameName && socket.socketId && STANDBY_MAP[socket.gameName] && STANDBY_MAP[socket.gameName].get(socket.socketId);
    if (standbyMapState) {
      STANDBY_MAP[socket.gameName].delete(socket.socketId);
    }
  });
});

console.log(`WebRTC server ${process.pid} running on port ${PORT}`);
