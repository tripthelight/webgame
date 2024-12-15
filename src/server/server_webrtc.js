import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

// WebSocket 서버 생성
const PORT = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port: PORT });
const REDIS = new Redis(); // 6379 단일 redis server
const NAMESPACE = 'ROOMS';
// const CLIENT_MAP = new Map(); // socketId와 WebSocket 인스턴스를 매핑할 Map
const ROOMS_MAP = {}; // room name과 WebSocket 인스턴스를 매핑할 Map
const GAMES_MAP = {}; // socketId와 WebSocket 인스턴스를 매핑할 Map
const STANDBY_SET = {}; // standby 상태인 사용자만 저장

/*
async function asyncEntryOrder(data) {
  return new Promise(async (resolve, reject) => {
    const { msgData, socket } = data;
    socket.gameName = msgData.gameName;
    resolve({
      clientId: msgData.clientId,
      socket: socket,
    });
  });
}

async function handleEntryOrder(data) {
  return new Promise((resolve, reject) => {
    const { clientId, socket } = data;

    if (clientId) {
      const GAME_ROOM = GAMES_MAP[socket.gameName];

      if (GAME_ROOM) {
        const DIFF_SOCKET = GAME_ROOM.get(clientId);

        if (DIFF_SOCKET) {
          // 1) 게임 중 둘이 있는 상태에서 한 명이 새로고침
          socket.diffSocketId = clientId;
          DIFF_SOCKET.diffSocketId = socket.socketId;

          // 새로고침하고 들어왔을 때, 내 socket은 없으므로 새로 저장
          GAME_ROOM.set(socket.socketId, socket);
          // 새로고침하고 들어왔을 때, 상대방 socket은 있으므로 수정
          GAME_ROOM.get(socket.diffSocketId).socket = DIFF_SOCKET;

          socket.send(
            JSON.stringify({
              type: 'entryOrder',
              clientId: {
                ms: socket.socketId,
              },
              setOffer: 'true',
            }),
          );
        } else {
          // 2) 게임 중 한 명이 나간 상태에서 나머지 한 명이 새로고침
          // 3) 양쪽이 동시에 새로고침
          socket.send(JSON.stringify({ type: 'otherLeaves', msg: '3' }));
        }
      } else {
        socket.send(JSON.stringify({ type: 'otherLeaves', msg: '4' }));
      }
    } else {
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
    }

    resolve();
  });
}

async function offerAnserCandidateDataProcess(resData) {
  return new Promise((resolve, reject) => {
    const { msgData, socket } = resData;
    if (msgData && socket) {
      const { type, data } = msgData;
      if (type && data) {
        if (socket.gameName && GAMES_MAP[socket.gameName] && socket.diffSocketId) {
          const DIFF_SOCKET = GAMES_MAP[socket.gameName].get(socket.diffSocketId);
          if (DIFF_SOCKET && DIFF_SOCKET.readyState === WebSocket.OPEN) {
            DIFF_SOCKET.send(JSON.stringify({ type, data }));
          }
        }
      }
    }
    resolve();
  });
}

async function handleMessageStep(data) {
  return new Promise(async (resolve, reject) => {
    const { msgData, socket } = data;

    if (msgData.type === 'entryOrder') {
      await asyncEntryOrder({ msgData, socket })
        .then(handleEntryOrder)
        .catch(() => {
          //
        });
    }
    if (msgData.type === 'offer' || msgData.type === 'answer' || msgData.type === 'candidate') {
      await offerAnserCandidateDataProcess({ msgData, socket }).catch(() => {
        //
      });
    }
    resolve();
  });
}

async function handleMessageStepStart(message, socket) {
  const msgData = JSON.parse(message);

  await handleMessageStep({ msgData, socket }).catch(() => {
    //
  });
}
*/

// 연결된 클라이언트 처리
WSS.on('connection', async (socket) => {
  // 새로 입장했을 때, socket에 고유한 socketId 부여
  if (!socket.socketId) socket.socketId = uuidv4();

  socket.on('message', async (message) => {
    const msgData = JSON.parse(message);

    if (msgData.roomName) {
      socket.roomName = msgData.roomName;
    }
    if (msgData.gameName) {
      socket.gameName = msgData.gameName;
      if (ROOMS_MAP[socket.gameName]) {
        if (ROOMS_MAP[socket.gameName].get(socket.roomName)) {
          ROOMS_MAP[socket.gameName].get(socket.roomName).push(socket);
        } else {
          ROOMS_MAP[socket.gameName].set(socket.roomName, [socket]);
        }
      } else {
        ROOMS_MAP[socket.gameName].set(socket.roomName, [socket]);
      }
    }

    if (msgData.type === 'entryOrder') {
      socket.gameName = msgData.gameName;

      if (!ROOMS_MAP[socket.gameName]) {
        ROOMS_MAP[socket.gameName] = new Map(); // gameName 에 따라 Map 생성
      }
      if (!GAMES_MAP[socket.gameName]) {
        GAMES_MAP[socket.gameName] = new Map(); // gameName 에 따라 Map 생성
      }
      if (!STANDBY_SET[socket.gameName]) {
        STANDBY_SET[socket.gameName] = new Set(); // gameName 에 따라 standby 상태만 Set 생성
      }

      const roomName = msgData.roomName;
      if (roomName) {
        // 게임 중 새로고침
        const GAME_ROOM = ROOMS_MAP[socket.gameName].get(roomName);
        const GAME_USER = GAMES_MAP[socket.gameName];

        if (GAME_ROOM && GAME_USER) {
          const diffWsinterval = setInterval(() => {
            if (ROOMS_MAP[socket.gameName].get(roomName).length === 2) {
              clearInterval(diffWsinterval);
              const DIFF_SOCKET = ROOMS_MAP[socket.gameName].get(roomName).find((ws) => ws !== socket);
              if (DIFF_SOCKET) {
                DIFF_SOCKET.send(
                  JSON.stringify({
                    type: 'entryOrder',
                    clientId: socket.socketId,
                  }),
                );
              } else {
                // 2) 게임 중 한 명이 나간 상태에서 나머지 한 명이 새로고침
                // 3) 양쪽이 동시에 새로고침
                socket.send(JSON.stringify({ type: 'otherLeaves', msg: '3' }));
              }
            }
          }, 100);

          setTimeout(() => {
            clearInterval(diffWsinterval);
          }, 3000);
        } else {
          socket.send(JSON.stringify({ type: 'otherLeaves', msg: '4' }));
        }
      } else {
        // 처음 입장
        // 클라이언트의 socketId를 이용해 WebSocket 인스턴스를 Map에 저장
        GAMES_MAP[socket.gameName].set(socket.socketId, socket);

        // standby 상태 user 찾기
        const STANDBY_USER_LIST = [...STANDBY_SET[socket.gameName]];

        if (STANDBY_USER_LIST.length > 0) {
          // standby 상태 user 있음
          socket.diffSocketId = STANDBY_USER_LIST[0];
          STANDBY_SET[socket.gameName].delete(socket.diffSocketId);

          if (GAMES_MAP[socket.gameName].get(socket.diffSocketId)) {
            const DIFF_SOCKET = GAMES_MAP[socket.gameName].get(socket.diffSocketId);
            DIFF_SOCKET.diffSocketId = socket.socketId;

            GAMES_MAP[socket.gameName].get(socket.socketId).socket = socket;
            GAMES_MAP[socket.gameName].get(socket.diffSocketId).socket = DIFF_SOCKET;

            socket.roomName = uuidv4();
            DIFF_SOCKET.roomName = socket.roomName;
            ROOMS_MAP[socket.gameName].set(socket.roomName, [socket, DIFF_SOCKET]);

            if (DIFF_SOCKET && DIFF_SOCKET.readyState === WebSocket.OPEN) {
              if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(
                  JSON.stringify({
                    type: 'entryOrder',
                    clientId: socket.diffSocketId,
                    roomName: socket.roomName,
                    setOffer: 'true',
                  }),
                );
                DIFF_SOCKET.send(
                  JSON.stringify({
                    type: 'entryOrder',
                    roomName: socket.roomName,
                    clientId: socket.socketId,
                  }),
                );

                if (GAMES_MAP[socket.gameName].get(socket.socketId)) {
                  GAMES_MAP[socket.gameName].delete(socket.socketId);
                }
                if (GAMES_MAP[socket.gameName].get(DIFF_SOCKET.socketId)) {
                  GAMES_MAP[socket.gameName].delete(DIFF_SOCKET.socketId);
                }
              } else {
                // 내 socket이 없음 : network 장애
                if (GAMES_MAP[socket.gameName]) {
                  if (GAMES_MAP[socket.gameName].get(socket.socketId)) {
                    GAMES_MAP[socket.gameName].delete(socket.socketId);
                  }
                  if (GAMES_MAP[socket.gameName].get(socket.diffSocketId)) {
                    GAMES_MAP[socket.gameName].delete(socket.diffSocketId);
                  }
                }
                if (ROOMS_MAP[socket.gameName]) {
                  if (ROOMS_MAP[socket.gameName].get(socket.roomName)) {
                    ROOMS_MAP[socket.gameName].delete(socket.roomName);
                  }
                }
                socket.send(JSON.stringify({ type: 'networkError' }));
              }
            } else {
              // 대기하고 있던 user 나감
              if (GAMES_MAP[socket.gameName]) {
                if (GAMES_MAP[socket.gameName].get(socket.socketId)) {
                  GAMES_MAP[socket.gameName].delete(socket.socketId);
                }
                if (GAMES_MAP[socket.gameName].get(socket.diffSocketId)) {
                  GAMES_MAP[socket.gameName].delete(socket.diffSocketId);
                }
              }
              if (ROOMS_MAP[socket.gameName]) {
                if (ROOMS_MAP[socket.gameName].get(socket.roomName)) {
                  ROOMS_MAP[socket.gameName].delete(socket.roomName);
                }
              }
              // 나는 대기 중 상태로 변경
              STANDBY_SET[socket.gameName].add(socket.socketId);
            }
          } else {
            // 대기하고 있던 user 나감
            if (GAMES_MAP[socket.gameName]) {
              if (GAMES_MAP[socket.gameName].get(socket.socketId)) {
                GAMES_MAP[socket.gameName].delete(socket.socketId);
              }
              if (GAMES_MAP[socket.gameName].get(socket.diffSocketId)) {
                GAMES_MAP[socket.gameName].delete(socket.diffSocketId);
              }
            }
            if (ROOMS_MAP[socket.gameName]) {
              if (ROOMS_MAP[socket.gameName].get(socket.roomName)) {
                ROOMS_MAP[socket.gameName].delete(socket.roomName);
              }
            }
            // 나는 대기 중 상태로 변경
            STANDBY_SET[socket.gameName].add(socket.socketId);
          }
        } else {
          // 내 gameName에 standby 상태인 user 없음
          STANDBY_SET[socket.gameName].add(socket.socketId);
        }
      }
    }
  });

  // 클라이언트 연결 종료 시
  socket.on('close', () => {
    if (socket.gameName) {
      if (ROOMS_MAP[socket.gameName]) {
        if (socket.roomName) {
          if (ROOMS_MAP[socket.gameName].get(socket.roomName)) {
            const room = ROOMS_MAP[socket.gameName].get(socket.roomName);
            const index = room.indexOf(socket);
            if (index !== -1) {
              room.splice(index, 1); // socket을 배열에서 삭제
            }
            if (ROOMS_MAP[socket.gameName].get(socket.roomName).length === 0) {
              ROOMS_MAP[socket.gameName].delete(socket.roomName);
            }
          }
        }
      }
      if (GAMES_MAP[socket.gameName]) {
        if (socket.socketId) {
          if (GAMES_MAP[socket.gameName].get(socket.socketId)) {
            GAMES_MAP[socket.gameName].delete(socket.socketId);
          }
        }
      }
      if (STANDBY_SET[socket.gameName]) {
        if (socket.socketId) {
          if (STANDBY_SET[socket.gameName].has(socket.socketId)) {
            STANDBY_SET[socket.gameName].delete(socket.socketId);
          }
        }
      }
    }
  });
});

console.log(`WebRTC server ${process.pid} running on port ${PORT}`);
