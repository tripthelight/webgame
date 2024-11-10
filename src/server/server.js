import cluster from 'cluster';
import os from 'os';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const numCPUs = os.cpus().length;
const DISCONNECT_DELAY = 3000; // 3초 지연 (3000ms)
let shouldBroadcast = true; // 브로드캐스트 가능 여부를 제어하는 플래그

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // 워커 프로세스 생성
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Primary가 모든 워커에 사용자 목록 업데이트 전송
  function syncUserList(users) {
    console.log('Primary: Syncing user list to all workers', users);
    for (const id in cluster.workers) {
      cluster.workers[id].send({ type: 'syncUserList', users });
    }
  }

  // 워커가 사용자 상태 변경을 요청할 때 처리
  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (message) => {
      if (message.type === 'updateUserList') {
        console.log('Primary: Received updateUserList from worker');
        syncUserList(message.users);
      }
    });
  }

  // 워커가 종료되면 새 워커 생성
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
  const recentlyDisconnected = new Map(); // 각 사용자별로 타이머 관리하여 완전 연결 해제 상태 추적

  wss.on('connection', (ws) => {
    // message
    ws.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.type === 'join') {
        const { clientId, userId } = data;

        // join 메시지가 오면, 최근에 close 발생한 타이머 제거 및 생략 상태 설정
        if (recentlyDisconnected.has(clientId)) {
          clearTimeout(recentlyDisconnected.get(clientId));
          recentlyDisconnected.delete(clientId);

          // 새로고침으로 인해 3초 전에 join이 발생한 경우
          shouldBroadcast = false; // 모든 사용자에 대한 브로드캐스트 비활성화
          console.log(`Worker ${process.pid}: Broadcast disabled temporarily due to quick reconnect by ${userId}`);

          // 3초 후에 다시 브로드캐스트 활성화
          setTimeout(() => {
            shouldBroadcast = true;
            console.log(`Worker ${process.pid}: Broadcast re-enabled after delay`);
          }, DISCONNECT_DELAY);
        }

        console.log(`Worker ${process.pid}: ${userId} joined`);

        // 사용자 목록 업데이트 및 Primary에 전송
        users.set(clientId, { userId, ws });
        updateUserList();
      }

      if (data.type === 'setUserName') {
        const { clientId, newUserId } = data;
        const user = users.get(clientId);

        if (user && user.userId !== newUserId) {
          console.log(`Worker ${process.pid}: ${user.userId} changed name to ${newUserId}`);
          user.userId = newUserId; // 기존 userId 업데이트
          updateUserList();
        } else {
          console.log(`No userId change for clientId: ${clientId}. Broadcast skipped.`);
        }
      }
    });

    // close
    ws.on('close', () => {
      for (const [clientId, user] of users.entries()) {
        if (user.ws === ws) {
          // close 이벤트 발생 시 3초 타이머 시작
          const timeoutId = setTimeout(() => {
            // 타이머 만료 시, 해당 사용자는 완전 연결 해제 상태로 간주
            recentlyDisconnected.delete(clientId);
            users.delete(clientId);
            broadcastUserList();
            console.log(`Client ${clientId} fully disconnected after delay.`);
          }, DISCONNECT_DELAY);

          recentlyDisconnected.set(clientId, timeoutId); // 타이머 저장
          break;
        }
      }
    });
  });

  // 모든 클라이언트에게 사용자 목록을 전송
  function broadcastUserList() {
    // 브로드캐스트가 가능한 경우에만 수행
    if (!shouldBroadcast) {
      console.log('Broadcasting skipped due to quick reconnect');
      return;
    }

    const userList = Array.from(users.entries()).map(([clientId, user]) => ({
      clientId,
      userId: user.userId,
    }));

    const message = JSON.stringify({ type: 'userList', users: userList });

    for (const [clientId, user] of users.entries()) {
      if (user.ws.readyState === user.ws.OPEN) {
        console.log(`Worker ${process.pid}: Broadcasting user list to client ${user.userId}`);
        user.ws.send(message);
      }
    }
  }

  // 사용자 목록을 Primary에 전송
  function updateUserList() {
    const userList = Array.from(users.entries()).map(([clientId, user]) => ({
      clientId,
      userId: user.userId,
    }));

    process.send({ type: 'updateUserList', users: userList });
  }

  // Primary로부터 사용자 목록 동기화 메시지를 수신할 때
  process.on('message', (message) => {
    if (message.type === 'syncUserList') {
      console.log(`Worker ${process.pid}: Received syncUserList from Primary`, message.users);
      // 모든 클라이언트에게 동기화된 사용자 목록 전송
      broadcastUserList();
    }
  });

  console.log(`Worker ${process.pid} started and WebSocket server is running on ws://localhost:8080`);

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
