import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

// WebSocket 서버 생성
const PORT = process.env.PORT || 8081;
const WSS = new WebSocketServer({ port: PORT });
const REDIS = new Redis();
const NAMESPACE = 'ROOMS';

// WebSocket 인스턴스를 메모리에서 찾는 예시 함수
function getRealWebSocket(socketId) {
  return new Promise((resolve, rejcet) => {
    // 예시: socketId를 사용하여 WebSocket 인스턴스를 찾는 방법 구현
    // 실제로는 WebSocket 서버의 상태나 메모리에서 WebSocket을 추적해야 함
    const client = Array.from(WSS.clients).find((client) => client.socketId === socketId);
    // return client || null;
    resolve(client || null);
  });
}

/**
 * 상대방 WebSocket을 찾아서, msgData.type에 msgData.data를 전송
 * @param {Object} msgData msgData.type: offer | answer | candidate
 * @param {Object} socket
 */
async function offerAnserCandidateDataProcess(msgData, socket) {
  const { type, data } = msgData;
  if (!type || !data) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  // Redis에서 해당 room에 연결된 모든 클라이언트 정보 가져오기
  const allRooms = await REDIS.hgetall(NAMESPACE);
  if (!allRooms) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  const socketIdArr = JSON.parse(allRooms[socket.room])?.sockets;
  if (!socketIdArr) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  const diffSocketId = socketIdArr.filter((socketId) => socketId !== socket.socketId).join('');
  if (!diffSocketId) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  const diffSocket = await getRealWebSocket(diffSocketId);
  if (!diffSocket) return socket.send(JSON.stringify({ type: 'otherLeaves' }));
  diffSocket.send(JSON.stringify({ type, data }));
}

// 연결된 클라이언트 처리
WSS.on('connection', async (socket) => {
  // 새로 입장했을 때, socket에 고유한 socketId 부여
  if (!socket.socketId) {
    const socketId = uuidv4();
    // base64로 인코딩 후 6자만 사용
    socket.socketId = `socketId-${Buffer.from(socketId).toString('base64').substring(0, 6)}`;
  }

  // 게임중 > 뒤로가기 > 같은 게임 진입 : msgData.room 없음
  // 게임중 > 새로고침 : msgData.room 있음

  socket.on('message', async (message) => {
    const msgData = JSON.parse(message);

    if (msgData.type === 'entryOrder') {
      const recevedRoom = msgData.room;

      // 1) 새로 진입 : msgData.room 없음
      // 2) 게임중 > 뒤로가기 > 같은 게임 진입 : msgData.room 없음 && gameState가 'standby'인 방으로 진입 필요
      if (recevedRoom === '') {
        // Redis에서 모든 방을 조회하고, 1명 이하가 있는 방을 찾는다
        const allRooms = await REDIS.hgetall(NAMESPACE); // 모든 방 이름을 가져옴
        let roomFound = false;

        for (const [roomName, roomData] of Object.entries(allRooms)) {
          const { sockets, gameState } = JSON.parse(roomData);
          if (sockets.length === 1 && gameState === 'standby') {
            socket.room = roomName;
            sockets.push(socket.socketId);
            await REDIS.hset(
              NAMESPACE,
              roomName,
              JSON.stringify({
                sockets: sockets,
                gameState: 'playing', // 게임중
              }),
            );
            roomFound = true;
            break;
          }
        }

        // 만약 모든 방에 WebSocket이 2개라면 새로운 방을 만들고 내 WebSocket을 추가
        if (!roomFound) {
          const newRoomName = `room-${uuidv4()}`;
          socket.room = newRoomName;
          await REDIS.hset(
            NAMESPACE,
            newRoomName,
            JSON.stringify({
              sockets: [socket.socketId],
              gameState: 'standby', // 대기
            }),
          );
        }

        const roomClientsSockets = await REDIS.hgetall(NAMESPACE);
        socket.send(
          JSON.stringify({
            type: 'entryOrder',
            userLength: JSON.parse(roomClientsSockets[socket.room]).sockets.length,
            room: socket.room,
          }),
        );
      } else {
        // Redis에서 해당 room이 존재하는지 확인
        /**
         * recevedRoom이 Redis에 있는지 확인
         * 있으면 1, 없으면 0을 return
         */
        const roomHexists = await REDIS.hexists(NAMESPACE, recevedRoom);

        if (roomHexists) {
          // 내가 원래있던 방에 WebSocket이 있으면

          socket.room = recevedRoom;
          const socketId = uuidv4();
          // base64로 인코딩 후 6자만 사용
          socket.socketId = `socketId-${Buffer.from(socketId).toString('base64').substring(0, 6)}`;

          const roomName = await REDIS.hget(NAMESPACE, recevedRoom);
          const { sockets, gameState } = JSON.parse(roomName);

          sockets.push(socket.socketId);

          await REDIS.hset(
            NAMESPACE,
            recevedRoom,
            JSON.stringify({
              sockets: sockets,
              gameState: 'playing', // 게임중
            }),
          );

          const roomClientsSockets = await REDIS.hgetall(NAMESPACE);

          socket.send(
            JSON.stringify({
              type: 'entryOrder',
              userLength: JSON.parse(roomClientsSockets[socket.room]).sockets.length,
              room: socket.room,
            }),
          );
        } else {
          // 내가 원래있던 방에 WebSocket이 없으면
          //
          // 1) 내가 처음 들어왔는데, 상대방이 없는 상태에서 새로고침 -  yourName 없음
          // 2) 내가 게임중에 상대방이 나간 상태에서 내가 새로고침 - yourName 있음
          const yourName = msgData.yourName;

          if (yourName === '') {
            // 내가 처음 들어왔는데, 상대방이 없는 상태에서 새로고침
            const newRoomName = `room-${uuidv4()}`;
            socket.room = newRoomName;

            // await REDIS.hset(NAMESPACE, newRoomName, JSON.stringify([socket.socketId]));
            await REDIS.hset(
              NAMESPACE,
              newRoomName,
              JSON.stringify({
                sockets: [socket.socketId],
                gameState: 'standby', // 대기
              }),
            );

            const roomClientsSockets = await REDIS.hgetall(NAMESPACE);

            socket.send(
              JSON.stringify({
                type: 'entryOrder',
                userLength: JSON.parse(roomClientsSockets[socket.room]).sockets.length,
                room: socket.room,
              }),
            );
          } else {
            // 내가 게임중에 상대방이 나간 상태에서 내가 새로고침
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
    const ROOM_NAME = socket.room;
    const roomHexists = await REDIS.hexists(NAMESPACE, ROOM_NAME);
    if (roomHexists) {
      const roomName = await REDIS.hget(NAMESPACE, ROOM_NAME);
      const { sockets, gameState } = JSON.parse(roomName);

      const index = sockets.indexOf(socket.socketId);
      if (index !== -1) {
        // 내 socket이 있으면 삭제
        sockets.splice(index, 1);
      }

      await REDIS.hset(
        NAMESPACE,
        ROOM_NAME,
        JSON.stringify({
          sockets: sockets,
          gameState: gameState,
        }),
      );

      // 방에 연결된 클라이언트가 없으면 방 삭제
      const roomClientsSockets = await REDIS.hgetall(NAMESPACE);
      if (JSON.parse(roomClientsSockets[ROOM_NAME]).sockets.length === 0) {
        await REDIS.hdel(NAMESPACE, ROOM_NAME); // 방 삭제
      }
    }
  });
});

console.log(`WebRTC server ${process.pid} running on port ${PORT}`);
