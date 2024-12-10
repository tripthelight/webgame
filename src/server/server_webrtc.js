// redis cluster 테스트

import Redis from 'ioredis';

// const REDIS = new Redis(); // 6379 단일 redis server
const REDIS = new Redis.Cluster([
  {
    port: 6379, // 첫 번째 Redis 인스턴스 포트
    host: '127.0.0.1', // Redis 서버 호스트
  },
  {
    port: 6380, // 두 번째 Redis 인스턴스 포트
    host: '127.0.0.1', // Redis 서버 호스트
  },
  {
    port: 6381, // 세 번째 Redis 인스턴스 포트
    host: '127.0.0.1', // Redis 서버 호스트
  },
]); // 6379, 6380 redis server cluster

// 클러스터 노드 상태 출력
REDIS.cluster('nodes')
  .then((nodes) => {
    console.log('클러스터 노드 상태:', nodes);
  })
  .catch((err) => {
    console.error('클러스터 노드 조회 중 오류 발생:', err);
  });

// 클러스터 연결 상태 확인
REDIS.on('ready', () => {
  console.log('Redis 클러스터에 연결되었습니다!');
});

REDIS.on('error', (err) => {
  console.error('Redis 클러스터 연결 오류:', err);
});
