import cluster from "cluster";
import os from "os";
import {WebSocket, WebSocketServer} from "ws";
import {v4 as uuidv4} from "uuid";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
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
  /** ======================================================================================================
   * index 화면 webSocket
   */
  const wss = new WebSocketServer({port: 8080});
  let users = {}; // 접속한 사용자 목록

  wss.on("connection", ws => {
    let userId = Math.random().toString(36).slice(2, 11); // 간단한 사용자 ID 생성
    users[userId] = ws;

    console.log(`User connected: ${userId}`);

    // 현재 접속한 모든 사용자에게 사용자 목록 전송
    broadcastUsers();

    ws.on("close", () => {
      console.log(`User disconnected: ${userId}`);
      delete users[userId];
      broadcastUsers();
    });
  });

  // 모든 클라이언트에게 사용자 목록을 전송
  function broadcastUsers() {
    const userList = Object.keys(users);
    const userListMessage = JSON.stringify({type: "userList", users: userList});
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(userListMessage);
      }
    });
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
