import path from "path";
import {fileURLToPath} from "url";
import os from "os";
import cluster from "cluster";
import express from "express";
import cors from "cors";
import {createServer} from "http";
import {Server} from "socket.io";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __filename = fileURLToPath(import.meta.url);

function onConnected(socket) {
  socket.on("create or join", room => {
    console.log("create or join to room: ", room);
    const myRoom = io.sockets.adapter.rooms[room] || {length: 0};
    const numClients = myRoom.length;
    console.log(room, "has", numClients, "clients");

    if (numClients == 0) {
      socket.join(room);
      socket.emit("created", room);
    } else if (numClients == 1) {
      socket.join(room);
      socket.emit("joined", room);
    } else {
      socket.emit("full", room);
    }
  });

  socket.on("ready", room => {
    socket.broadcast.to(room).emit("ready");
  });
  socket.on("candidate", event => {
    socket.broadcast.to(event.room).emit("candidate", event);
  });
  socket.on("offer", event => {
    socket.broadcast.to(event.room).emit("offer", event.sdp);
  });
  socket.on("answer", event => {
    socket.broadcast.to(event.room).emit("answer", event.sdp);
  });
}

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length; // 시스템의 CPU 코어 수

  console.log(`마스터 프로세스 PID: ${process.pid}`);
  console.log(`시스템의 코어 수: ${numCPUs}`);

  // CPU 코어 수만큼 워커 생성
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 워커 종료 시 새로운 워커 생성
  cluster.on("exit", worker => {
    console.log(`워커 ${worker.process.pid}가 종료되었습니다.`);
    cluster.fork(); // 새로운 워커 생성
  });
} else {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // 필요한 경우 특정 도메인으로 제한할 수 있습니다.
      methods: ["GET", "POST"],
    },
  });

  app.use(cors());
  app.use(express.static(path.join(__dirname, "../../dist")));

  httpServer.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  });

  io.on("connection", onConnected);
}
