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
  const WSS = new WebSocketServer({ port: 8080 });
  const GAMES = ['taptap', 'indianPocker', 'blackAndWhite', 'findTheSamePicture'];
  const ROOMS = {}; // 방을 관리할 객체

  WSS.on('connection', (ws) => {
    let assignedRoom;

    // 방 할당 로직
    for (const [room, clients] of Object.entries(ROOMS)) {
      if (clients.length < 2) {
        assignedRoom = room;
        ROOMS[room].push(ws);
        break;
      }
    }

    if (!assignedRoom) {
      // roomCounter++;
      // assignedRoom = `room-${roomCounter}`;
      assignedRoom = `room-${uuidv4()}`;
      ROOMS[assignedRoom] = [ws];
    }

    ws.room = assignedRoom;
    console.log(`Client connected to ${assignedRoom} in worker ${process.pid}`);

    ws.on('message', (message) => {
      const data = JSON.parse(message);

      const ROOMS_CLIENTS = ROOMS[ws.room];
      ROOMS_CLIENTS.forEach((client) => {
        if (client !== ws) {
          client.send(message); // 같은 방에 있는 다른 클라이언트에게 메시지 전송
        }
      });

      if (data.type === 'join') {
        //
      }

      if (data.type === 'changeNickName') {
        //
      }
    });

    ws.on('close', () => {
      ROOMS[ws.room] = ROOMS[ws.room].filter((client) => client !== ws);
      if (ROOMS[ws.room].length === 0) {
        delete ROOMS[ws.room]; // 방이 비어 있으면 삭제
      }
      console.log(`Client disconnected from ${ws.room} in worker ${process.pid}`);
    });
  });

  console.log(`Worker ${process.pid} started and WebSocket server is running on ws://localhost:8080`);
}
