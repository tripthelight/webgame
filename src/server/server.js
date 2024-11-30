import cluster from 'cluster';
import os from 'os';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  // console.log(`Primary ${process.pid} is running`);

  // 워커 프로세스 생성
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Primary가 모든 워커에 사용자 목록 업데이트 전송
  function syncUserList(users) {
    // console.log('Primary: Syncing user list to all workers', users);
    for (const id in cluster.workers) {
      cluster.workers[id].send({ type: 'syncUserList', users });
    }
  }

  // 워커가 사용자 상태 변경을 요청할 때 처리
  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (message) => {
      if (message.type === 'updateUserList') {
        // console.log('Primary: Received updateUserList from worker');
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
  const WSS_RTC = new WebSocketServer({ port: 8080 });
  const WSS_USR = new WebSocketServer({ port: 8081 });
  const GAMES = ['taptap', 'indianPocker', 'blackAndWhite', 'findTheSamePicture'];
  const ROOMS = {}; // 방을 관리할 객체

  // webRTC 연결을 위한 WebSocketServer
  WSS_RTC.on('connection', (websocket) => {});

  // 전체 사용자 리스트를 위한 WebSocketServer
  WSS_USR.on('connection', (websocket) => {
    websocket.on('message', (_message) => {
      const data = JSON.parse(_message);

      if (data.type === 'join') {
        //
      }

      if (data.type === 'changeNickName') {
        //
      }
    });

    websocket.on('close', () => {
      // console.log(`Client disconnected from ${websocket.room} in worker ${process.pid}`);
    });
  });

  // console.log(`Worker ${process.pid} started and WebSocket server is running on ws://localhost:8080`);
}
