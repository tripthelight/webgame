import cluster from "cluster";
import os from "os";
import {Worker} from "worker_threads";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running.`);

  // CPU 코어 수만큼 워커 프로세스 생성
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died.`);
  });
} else {
  console.log(`Worker process ${process.pid} is running.`);

  // 워커 스레드 생성 및 작업 분리
  const worker = new Worker(new URL("./worker.js", import.meta.url));

  worker.on("message", result => {
    console.log(`Result from worker thread: ${result}`);
  });

  worker.postMessage("start-heavy-task");
}
