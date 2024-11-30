import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length; // 시스템에서 사용할 수 있는 CPU 코어 수

if (cluster.isPrimary) {
  console.log(`Primary process is running. Forking ${numCPUs} workers...`);

  // numCPUs 만큼 워커를 생성합니다.
  for (let i = 0; i < numCPUs; i++) {
    const workerType = i % 2 === 0 ? 'webrtc' : 'websocket'; // 짝수는 WebRTC, 홀수는 WebSocket
    cluster.fork({ WORKER_TYPE: workerType });
  }

  // 워커 간 통신을 위한 메시지 핸들링
  cluster.on('message', (worker, message) => {
    console.log(`Message from worker ${worker.process.pid}:`, message);

    // 메시지에 따라 다른 워커에게 전달
    // 예: WebSocket 서버끼리 연결, WebRTC 서버끼리 연결
    if (message.type === 'websocket') {
      // WebSocket 서버들 간 통신 처리
    } else if (message.type === 'webrtc') {
      // WebRTC 서버들 간 통신 처리
    }
  });

  // 워커 종료 이벤트 처리
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork(worker.env); // 워커 환경을 유지하면서 재시작
  });
} else {
  // 각 워커 프로세스가 수행할 작업 결정
  if (process.env.WORKER_TYPE === 'webrtc') {
    import('./server_webrtc.js');
  } else if (process.env.WORKER_TYPE === 'websocket') {
    import('./server_websocket.js');
  }
}
