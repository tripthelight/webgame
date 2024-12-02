import { WebSocketServer } from 'ws';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const port = process.env.PORT || 8082;
const WSS = new WebSocketServer({ port });

const users = new Map(); // clientId를 key로 사용자 WebSocket 및 userId 정보 저장
const recentlyDisconnected = new Map(); // 각 사용자별로 타이머 관리하여 완전 연결 해제 상태 추적
const DISCONNECT_DELAY = 3000; // 3초 지연 후 사용자 완전 해제
let shouldBroadcast = true;

// Redis 연결 설정
const redis = new Redis(); // 기본 localhost:6379
const redisPub = new Redis(); // 발행용 Redis
const redisSub = new Redis(); // 구독용 Redis

// Redis 채널 이름
const USER_LIST_CHANNEL = 'user-list-sync';

WSS.on('connection', (ws) => {
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
      updateUserListRedis();
    }

    if (data.type === 'setUserName') {
      const { clientId, newUserId } = data;
      const user = users.get(clientId);

      if (user && user.userId !== newUserId) {
        console.log(`Worker ${process.pid}: ${user.userId} changed name to ${newUserId}`);
        user.userId = newUserId; // 기존 userId 업데이트
        updateUserListRedis();
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

// Redis를 통해 사용자 목록 업데이트
function updateUserListRedis() {
  const userList = Array.from(users.entries()).map(([clientId, user]) => ({
    clientId,
    userId: user.userId,
  }));

  redisPub.publish(USER_LIST_CHANNEL, JSON.stringify({ type: 'syncUserList', users: userList }));
}

// Redis에서 사용자 목록 동기화 메시지를 수신
redisSub.subscribe(USER_LIST_CHANNEL);
redisSub.on('message', (channel, message) => {
  if (channel === USER_LIST_CHANNEL) {
    const data = JSON.parse(message);
    if (data.type === 'syncUserList') {
      console.log(`Received syncUserList via Redis: `, data.users);
      broadcastUserList();
    }
  }
});

console.log(`WebSocket server running on port ${port}`);
