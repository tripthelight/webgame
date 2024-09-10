import cluster from "cluster";
import os from "os";
import {WebSocketServer} from "ws";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  // isMaster 대신 isPrimary 사용
  console.log(`Primary ${process.pid} is running`);

  // 워커 프로세스 생성
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  const rooms = {}; // 방을 관리할 객체
  let roomCounter = 0;

  const wss = new WebSocketServer({port: 8080});

  wss.on("connection", ws => {
    let assignedRoom;

    // 방 할당 로직
    for (const [room, clients] of Object.entries(rooms)) {
      if (clients.length < 2) {
        assignedRoom = room;
        rooms[room].push(ws);
        break;
      }
    }

    if (!assignedRoom) {
      roomCounter++;
      assignedRoom = `room-${roomCounter}`;
      rooms[assignedRoom] = [ws];
    }

    ws.room = assignedRoom;
    console.log(`Client connected to ${assignedRoom} in worker ${process.pid}`);

    ws.on("message", message => {
      const roomClients = rooms[ws.room];
      roomClients.forEach(client => {
        if (client !== ws) {
          client.send(message); // 같은 방에 있는 다른 클라이언트에게 메시지 전송
        }
      });
    });

    ws.on("close", () => {
      rooms[ws.room] = rooms[ws.room].filter(client => client !== ws);
      if (rooms[ws.room].length === 0) {
        delete rooms[ws.room]; // 방이 비어 있으면 삭제
      }
      console.log(`Client disconnected from ${ws.room} in worker ${process.pid}`);
    });
  });

  console.log(`Worker ${process.pid} started and WebSocket server is running on ws://localhost:8080`);
}
