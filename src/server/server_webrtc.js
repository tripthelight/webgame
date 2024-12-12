import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

// WebSocket 서버 생성
const PORT = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port: PORT });
const REDIS = new Redis(); // 6379 단일 redis server
const NAMESPACE = 'ROOMS';
// const CLIENT_MAP = new Map(); // socketId와 WebSocket 인스턴스를 매핑할 Map
const GAMES_MAP = {}; // socketId와 WebSocket 인스턴스를 매핑할 Map
const STANDBY_SET = {}; // standby 상태인 사용자만 저장

async function offerAnserCandidateDataProcess(msgData, socket) {
  const { type, data } = msgData;
  if (!type || !data) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  const DIFF_SOCKET = GAMES_MAP[socket.gameName].get(socket.diffSocketId);
  if (!DIFF_SOCKET || DIFF_SOCKET.readyState !== WebSocket.OPEN) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  DIFF_SOCKET.send(JSON.stringify({ type, data }));
}

// 연결된 클라이언트 처리
WSS.on('connection', async (socket) => {
  // 새로 입장했을 때, socket에 고유한 socketId 부여
  if (!socket.socketId) {
    const socketId = uuidv4();
    socket.socketId = socketId;
    // base64로 인코딩 후 6자만 사용
    // socket.socketId = `socketId-${Buffer.from(socketId).toString('base64').substring(0, 12)}`;
  }

  socket.on('message', async (message) => {
    const msgData = JSON.parse(message);

    if (msgData.type === 'entryOrder') {
      socket.gameName = msgData.gameName;

      if (msgData.clientId === '') {
        // 처음 입장
        if (!GAMES_MAP[socket.gameName]) {
          GAMES_MAP[socket.gameName] = new Map(); // gameName 에 따라 Map 생성
        }
        if (!STANDBY_SET[socket.gameName]) {
          STANDBY_SET[socket.gameName] = new Set(); // gameName 에 따라 standby 상태만 Set 생성
        }

        // 클라이언트의 socketId를 이용해 WebSocket 인스턴스를 Map에 저장
        GAMES_MAP[socket.gameName].set(socket.socketId, socket);

        // standby 상태 user 찾기
        const STANDBY_USER_LIST = [...STANDBY_SET[socket.gameName]];

        if (STANDBY_USER_LIST.length > 0) {
          // standby 상태 user 있음

          socket.diffSocketId = STANDBY_USER_LIST[0];

          STANDBY_SET[socket.gameName].delete(socket.diffSocketId);
          const STANDBY_USER_SOCKET = GAMES_MAP[socket.gameName].get(socket.diffSocketId);

          if (STANDBY_USER_SOCKET) {
            STANDBY_USER_SOCKET.diffSocketId = socket.socketId;

            GAMES_MAP[socket.gameName].get(socket.socketId).socket = socket;
            GAMES_MAP[socket.gameName].get(socket.diffSocketId).socket = STANDBY_USER_SOCKET;

            if (STANDBY_USER_SOCKET.readyState === WebSocket.OPEN) {
              if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(
                  JSON.stringify({
                    type: 'entryOrder',
                    clientId: {
                      ms: socket.socketId,
                      us: socket.diffSocketId,
                    },
                    setOffer: 'true',
                  }),
                );
              } else {
                // 내 socket이 없음 : network 장애
                socket.send(JSON.stringify({ type: 'networkError' }));
              }
            } else {
              // 대기하고 있던 user 나감
              // 나는 대기 중 상태로 변경
              STANDBY_SET[socket.gameName].add(socket.socketId);
            }
          } else {
            // 대기하고 있던 user 나감
            // 나는 대기 중 상태로 변경
            STANDBY_SET[socket.gameName].add(socket.socketId);
          }
        } else {
          // 내 gameName에 standby 상태인 user 없음
          STANDBY_SET[socket.gameName].add(socket.socketId);
        }
      } else {
        // 게임 중 새로고침
        const DIFF_SOCKET = GAMES_MAP[socket.gameName].get(msgData.clientId);

        if (DIFF_SOCKET) {
          // 1) 게임 중 둘이 있는 상태에서 한 명이 새로고침
          socket.diffSocketId = msgData.clientId;
          DIFF_SOCKET.diffSocketId = socket.socketId;

          // 새로고침하고 들어왔을 때, 내 socket은 없으므로 새로 저장
          GAMES_MAP[socket.gameName].set(socket.socketId, socket);
          // 새로고침하고 들어왔을 때, 상대방 socket은 있으므로 수정
          GAMES_MAP[socket.gameName].get(socket.diffSocketId).socket = DIFF_SOCKET;

          socket.send(
            JSON.stringify({
              type: 'entryOrder',
              clientId: {
                ms: socket.socketId,
                us: socket.diffSocketId,
              },
              setOffer: 'true',
            }),
          );
        } else {
          // 2) 게임 중 한 명이 나간 상태에서 나머지 한 명이 새로고침
          socket.send(JSON.stringify({ type: 'otherLeaves' }));
        }
      }
    } else {
      // offer answer candidate
      offerAnserCandidateDataProcess(msgData, socket);
    }
  });

  // 클라이언트 연결 종료 시
  socket.on('close', async () => {
    if (!socket.gameName || !socket.socketId) return;
    // 연결 종료 시 Map에서 WebSocket 인스턴스를 제거
    GAMES_MAP[socket.gameName].delete(socket.socketId);
    STANDBY_SET[socket.gameName].delete(socket.socketId);
  });
});

console.log(`WebRTC server ${process.pid} running on port ${PORT}`);
