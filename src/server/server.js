import fs from "fs";
import https from "https";
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
  console.log(socket.id, "has joined");
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
  const PORT = process.env.PORT || 9000;
  // read in our certs
  const key = fs.readFileSync("../../certs/server/cert.key");
  const cert = fs.readFileSync("../../certs/server/cert.crt");
  const httpServer = https.createServer({key, cert}, app);

  const io = new Server(httpServer, {
    cors: [
      // the domains that are allowed
      "localhost:3000",
      "localhost:3001",
    ],
    method: ["GET", "POST"],
  });

  app.use(cors());
  // app.use(express.static(path.join(__dirname, "../../dist")));

  httpServer.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  });

  io.on("connection", onConnected);
}
