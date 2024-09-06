import {parentPort} from "worker_threads";

parentPort.on("message", message => {
  if (message === "start-heavy-task") {
    // CPU 집약적인 작업 수행
    let result = 0;
    for (let i = 0; i < 1e7; i++) {
      result += i;
    }

    // 결과를 부모 스레드로 전송
    parentPort.postMessage(result);
  }
});
