import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

// WebSocket 서버 생성
const PORT = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port: PORT });
// const REDIS = new Redis(); // 6379 단일 redis server
const REDIS = new Redis.Cluster([
  {
    port: 6379, // 첫 번째 Redis 인스턴스 포트
    host: '127.0.0.1', // Redis 서버 호스트
  },
  {
    port: 6380, // 두 번째 Redis 인스턴스 포트
    host: '127.0.0.1', // Redis 서버 호스트
  },
  {
    port: 6381, // 세 번째 Redis 인스턴스 포트
    host: '127.0.0.1', // Redis 서버 호스트
  },
]); // 6379, 6380 redis server cluster
const NAMESPACE = 'ROOMS';
const CLIENT_MAP = new Map(); // socketId와 WebSocket 인스턴스를 매핑할 Map

REDIS.cluster('nodes')
  .then((nodes) => {
    // 클러스터 노드 상태를 출력합니다.
    console.log('클러스터 노드 상태:', nodes);
  })
  .catch((err) => {
    console.error('클러스터 노드 조회 중 오류 발생:', err);
  });

// WebSocket 인스턴스를 찾는 함수
function getDiffWebSocket(socketId) {
  return CLIENT_MAP.get(socketId) || null;
}

/**
 * 상대방 WebSocket을 찾아서, msgData.type에 msgData.data를 전송
 * @param {Object} msgData msgData.type: offer | answer | candidate
 * @param {Object} socket
 */
async function offerAnserCandidateDataProcess(msgData, socket) {
  const { type, data } = msgData;
  if (!type || !data) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  const diffSocket = getDiffWebSocket(socket.socketIdDiff);
  if (!diffSocket) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  diffSocket.send(JSON.stringify({ type, data }));
}

async function roomInit(socket) {
  // "standby" 상태의 모든 room 목록 가져오기
  const standbyRoomsData = await REDIS.hget(NAMESPACE, 'standby');
  const standbyRooms = standbyRoomsData ? JSON.parse(standbyRoomsData) : {};

  if (Object.keys(standbyRooms).length > 0) {
    // socketId가 하나인 방을 찾음
    const roomNameToUpdate = Object.entries(standbyRooms).find(([roomName, socketIds]) => socketIds.length === 1)?.[0];

    if (roomNameToUpdate) {
      socket.socketIdDiff = standbyRooms[roomNameToUpdate].join('');
      const diffSocket = getDiffWebSocket(socket.socketIdDiff);
      diffSocket.socketIdDiff = socket.socketId;
      socket.gameState = 'playing';
      diffSocket.gameState = 'playing';

      // 해당 roomName의 socketId 배열에 socket.socketId 추가
      standbyRooms[roomNameToUpdate].push(socket.socketId);

      const multi = REDIS.multi();

      // 'playing' 필드에 roomName을 추가
      const playingRoomsData = await REDIS.hget(NAMESPACE, 'playing');
      const playingRooms = playingRoomsData ? JSON.parse(playingRoomsData) : {};
      playingRooms[roomNameToUpdate] = standbyRooms[roomNameToUpdate];

      socket.room = roomNameToUpdate;

      // 'ROOMS'에 'playing' 데이터를 업데이트
      multi.hset(NAMESPACE, 'playing', JSON.stringify(playingRooms));

      // 'standby'에서 해당 roomName을 제거
      delete standbyRooms[roomNameToUpdate];

      // 'ROOMS'에 'standby' 데이터를 업데이트
      multi.hset(NAMESPACE, 'standby', JSON.stringify(standbyRooms));

      // 명령어 실행
      await multi.exec();

      socket.send(
        JSON.stringify({
          type: 'entryOrder',
          userLength: 2, // 이 상태는 2명임
          room: socket.room,
        }),
      );
    } else {
      // 방을 찾지 못한 경우 'otherLeaves' 메시지 전송
      socket.send(JSON.stringify({ type: 'otherLeaves' }));
    }
  } else {
    // 'standby'에 방이 없으면 새로운 방을 생성하여 추가
    const newRoomName = `room-${uuidv4()}`;
    socket.room = newRoomName;
    socket.gameState = 'standby';
    await REDIS.hset(NAMESPACE, 'standby', JSON.stringify({ [socket.room]: [socket.socketId] }));

    socket.send(
      JSON.stringify({
        type: 'entryOrder',
        userLength: 1, // 이 상태는 1명임
        room: socket.room,
      }),
    );
  }
}

/*
// ROOMS의 구조
"ROOMS": {
  "standby": {
    "room1": ["socket1"],
    "room2": ["socket1"]
  },
  "playing": {
    "room3": ["socket1", "socket2"],
    "room4": ["socket1", "socket2"],
    "room5": ["socket2"]
  }
}

standby 상태에서, 새로운 user가 진입하면,
"standby"에 있던 room 중 하나에 새로 진입한 user의 socketId를 추가 후,
standby 상태에 있던 romm을 제거 후,
"playing"으로 이동
*/

// 연결된 클라이언트 처리
WSS.on('connection', async (socket) => {
  // 새로 입장했을 때, socket에 고유한 socketId 부여
  if (!socket.socketId) {
    const socketId = uuidv4();
    // base64로 인코딩 후 6자만 사용
    socket.socketId = `socketId-${Buffer.from(socketId).toString('base64').substring(0, 6)}`;
    // socket.socketIds = [socket.socketId]; // type: Array<string>
  }

  // 클라이언트의 socketId를 이용해 WebSocket 인스턴스를 Map에 저장
  CLIENT_MAP.set(socket.socketId, socket);

  // 게임중 > 뒤로가기 > 같은 게임 진입 : msgData.room 없음
  // 게임중 > 새로고침 : msgData.room 있음

  socket.on('message', async (message) => {
    const msgData = JSON.parse(message);

    if (msgData.type === 'entryOrder') {
      const recevedRoom = msgData.room;

      // 1) 새로 진입 : msgData.room 없음
      // 2) 게임중 > 뒤로가기 > 같은 게임 진입 : msgData.room 없음 && gameState가 'standby'인 방으로 진입 필요
      if (recevedRoom === '') {
        roomInit(socket);
      } else {
        const yourName = msgData.yourName;
        if (yourName === '') {
          roomInit(socket);
        } else {
          // Redis에서 'playing' 데이터를 가져옵니다.
          const playingRoomsData = await REDIS.hget(NAMESPACE, 'playing');

          // JSON으로 파싱합니다.
          const playingRooms = playingRoomsData ? JSON.parse(playingRoomsData) : {};
          // 내가 있던 roomName 찾기
          const roomNameToUpdate = Object.keys(playingRooms).find((roomName) => roomName.startsWith(recevedRoom));

          if (roomNameToUpdate) {
            socket.socketIdDiff = playingRooms[roomNameToUpdate].join('');
            const diffSocket = getDiffWebSocket(socket.socketIdDiff);
            diffSocket.socketIdDiff = socket.socketId;
            socket.room = roomNameToUpdate;
            socket.gameState = 'playing';

            // 해당 roomName에 socketId 추가
            playingRooms[roomNameToUpdate].push(socket.socketId);

            // Redis에 업데이트
            await REDIS.hset(NAMESPACE, 'playing', JSON.stringify(playingRooms));

            socket.send(
              JSON.stringify({
                type: 'entryOrder',
                userLength: 2, // 이 상태는 2명임
                room: socket.room,
              }),
            );
          } else {
            // 내가 있던 room이 없음
            console.log('둘 다 새로고침 ::::::::::: ');

            socket.send(JSON.stringify({ type: 'otherLeaves' }));
          }
        }
      }
    } else {
      await offerAnserCandidateDataProcess(msgData, socket);
    }
  });

  // 클라이언트 연결 종료 시
  socket.on('close', async () => {
    if (!socket.room || !socket.socketId || !socket.gameState) return;

    const roomData = await REDIS.hget(NAMESPACE, socket.gameState);
    const rooms = JSON.parse(roomData);
    const socketIds = rooms[socket.room];
    if (socketIds.includes(socket.socketId)) {
      const updatedSocketIds = socketIds.filter((id) => id !== socket.socketId);
      if (updatedSocketIds.length === 0) {
        delete rooms[socket.room];
      } else {
        rooms[socket.room] = updatedSocketIds;
      }
      await REDIS.hset(NAMESPACE, socket.gameState, JSON.stringify(rooms));
    }

    // 연결 종료 시 Map에서 WebSocket 인스턴스를 제거
    CLIENT_MAP.delete(socket.socketId);
  });
});

// console.log(`WebRTC server ${process.pid} running on port ${PORT}`);

const allFns = async (userId) => {
  const lockKey = 'function_lock'; // 함수 실행을 위한 락 키

  // 락을 얻을 때까지 기다림
  const lock = await REDIS.setnx(lockKey, 'locked');

  // 함수가 끝나면 락을 해제
  await REDIS.del(lockKey);
};

// 예시: 2명이 각각 `전체함수1` 실행 시도
allFns('User1');
allFns('User2');
