import cluster from 'cluster';
import os from 'os';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // 워커 프로세스 생성
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  /** ======================================================================================================
   * index 화면 webSocket
   */
  const wss = new WebSocketServer({ port: 8080 });
  const users = new Map(); // clientId를 key로 사용자 WebSocket 및 userId 정보 저장
  const previousStates = new Map(); // clientId를 key로 이전 userId 상태 저장

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.type === 'join') {
        const { clientId, userId } = data;

        // 이전 상태와 현재 상태 비교
        const previousUserId = previousStates.get(clientId);

        if (previousUserId !== userId) {
          // 상태 변화가 있을 때만 업데이트 및 브로드캐스트
          users.set(clientId, { userId, ws });
          previousStates.set(clientId, userId); // 상태 갱신
          broadcastUserList();
        } else {
          console.log(`No state change for clientId: ${clientId}. Broadcast skipped.`);
        }
      }

      if (data.type === 'setUserName') {
        const { clientId, newUserId } = data;
        const user = users.get(clientId);

        if (user && user.userId !== newUserId) {
          // 상태가 변경될 때만 업데이트 및 브로드캐스트
          user.userId = newUserId; // 기존 userId 업데이트
          previousStates.set(clientId, newUserId); // 상태 갱신
          broadcastUserList();
        } else {
          console.log(`No userId change for clientId: ${clientId}. Broadcast skipped.`);
        }
      }
    });

    ws.on('close', () => {
      // 연결 해제 시 사용자 목록에서 제거하고 브로드캐스트
      for (let [clientId, user] of users.entries()) {
        if (user.ws === ws) {
          users.delete(clientId);
          previousStates.delete(clientId); // 상태 추적에서 삭제
          broadcastUserList();
          break;
        }
      }
    });
  });

  // 모든 클라이언트에게 사용자 목록을 전송
  function broadcastUserList() {
    const userList = Array.from(users.entries()).map(([clientId, user]) => ({
      clientId,
      userId: user.userId,
    }));

    const message = JSON.stringify({ type: 'userList', users: userList });

    for (let user of users.values()) {
      user.ws.send(message);
    }
  }

  /** ======================================================================================================
   * 2인용 webSocket
   */
  // const wss = new WebSocketServer({port: 8080});
  // const rooms = {}; // 방을 관리할 객체
  // // let roomCounter = 0;

  // wss.on("connection", ws => {
  //   let assignedRoom;

  //   // 방 할당 로직
  //   for (const [room, clients] of Object.entries(rooms)) {
  //     if (clients.length < 2) {
  //       assignedRoom = room;
  //       rooms[room].push(ws);
  //       break;
  //     }
  //   }

  //   if (!assignedRoom) {
  //     // roomCounter++;
  //     // assignedRoom = `room-${roomCounter}`;
  //     assignedRoom = `room-${uuidv4()}`;
  //     rooms[assignedRoom] = [ws];
  //   }

  //   ws.room = assignedRoom;
  //   console.log(`Client connected to ${assignedRoom} in worker ${process.pid}`);

  //   ws.on("message", message => {
  //     const roomClients = rooms[ws.room];
  //     roomClients.forEach(client => {
  //       if (client !== ws) {
  //         client.send(message); // 같은 방에 있는 다른 클라이언트에게 메시지 전송
  //       }
  //     });
  //   });

  //   ws.on("close", () => {
  //     rooms[ws.room] = rooms[ws.room].filter(client => client !== ws);
  //     if (rooms[ws.room].length === 0) {
  //       delete rooms[ws.room]; // 방이 비어 있으면 삭제
  //     }
  //     console.log(`Client disconnected from ${ws.room} in worker ${process.pid}`);
  //   });
  // });

  // console.log(`Worker ${process.pid} started and WebSocket server is running on ws://localhost:8080`);
  /** ====================================================================================================== */
}
