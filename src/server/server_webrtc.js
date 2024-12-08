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

  const socketIdArr = JSON.parse(allRooms[socket.room]);
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
    socket.socketId = `socketId-${uuidv4()}`;
  }

  // 클라이언트의 socketId와 접속한 워커 pid 저장
  // await REDIS.hset('clients', socket.socketId, process.pid);

  socket.on('message', async (message) => {
    const msgData = JSON.parse(message);

    if (msgData.type === 'entryOrder') {
      const recevedRoom = msgData.room;

      if (recevedRoom === '') {
        // Redis에서 모든 방을 조회하고, 1명 이하가 있는 방을 찾는다
        // const allRooms = await REDIS.keys('*'); // 모든 방 이름을 가져옴
        const allRooms = await REDIS.hgetall(NAMESPACE);
        let roomFound = false;

        for (const [roomName, roomData] of Object.entries(allRooms)) {
          const socketIds = JSON.parse(roomData); // 문자열을 객체로 파싱
          if (socketIds.length === 1) {
            socket.room = roomName;
            socketIds.push(socket.socketId);
            await REDIS.hset(NAMESPACE, roomName, JSON.stringify(socketIds));
            roomFound = true;
            break;
          }
        }

        // 만약 모든 방에 WebSocket이 2개라면 새로운 방을 만들고 내 WebSocket을 추가
        if (!roomFound) {
          const newRoomName = `room-${uuidv4()}`;
          socket.room = newRoomName;
          await REDIS.hset(NAMESPACE, newRoomName, JSON.stringify([socket.socketId]));
        }

        const roomClientsSockets = await REDIS.hgetall(NAMESPACE);

        socket.send(
          JSON.stringify({
            type: 'entryOrder',
            userLength: Object.keys(JSON.parse(roomClientsSockets[socket.room])).length,
            room: socket.room,
          }),
        );
      } else {
        // Redis에서 해당 room이 존재하는지 확인
        /**
         * recevedRoom이 Redis에 있는지 확인
         * 있으면 1, 없으면 0을 return
         */
        const roomExists = await REDIS.hexists(NAMESPACE, recevedRoom);

        if (roomExists) {
          // 내가 원래있던 방에 WebSocket이 있으면

          socket.room = recevedRoom;
          const socketId = `socketId-${uuidv4()}`;
          socket.socketId = socketId;

          const sockets = await REDIS.hget(NAMESPACE, recevedRoom);
          const socketIds = JSON.parse(sockets);
          socketIds.push(socket.socketId);

          await REDIS.hset(NAMESPACE, recevedRoom, JSON.stringify(socketIds));

          const roomClientsSockets = await REDIS.hgetall(NAMESPACE);

          socket.send(
            JSON.stringify({
              type: 'entryOrder',
              userLength: Object.keys(JSON.parse(roomClientsSockets[socket.room])).length,
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

            await REDIS.hset(NAMESPACE, newRoomName, JSON.stringify([socket.socketId]));

            const roomClientsSockets = await REDIS.hgetall(NAMESPACE);

            socket.send(
              JSON.stringify({
                type: 'entryOrder',
                userLength: Object.keys(JSON.parse(roomClientsSockets[socket.room])).length,
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
    const roomExists = await REDIS.hexists(NAMESPACE, socket.room);
    if (roomExists) {
      const roomName = await REDIS.hget(NAMESPACE, socket.room);
      const roomArray = JSON.parse(roomName);
      const index = roomArray.indexOf(socket.socketId);
      if (index !== -1) {
        // 내 socket이 없으면
        roomArray.splice(index, 1);
      }

      await REDIS.hset(NAMESPACE, socket.room, JSON.stringify(roomArray));

      // 방에 연결된 클라이언트가 없으면 방 삭제
      const roomClientsSockets = await REDIS.hgetall(NAMESPACE);
      if (Object.keys(JSON.parse(roomClientsSockets[socket.room])).length === 0) {
        await REDIS.del(NAMESPACE, socket.room); // 방 삭제
      }
    }
  });
});

console.log(`WebRTC server ${process.pid} running on port ${PORT}`);
