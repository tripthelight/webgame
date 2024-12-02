import Redis from 'ioredis';

const redis = new Redis();

const getCacheData = async (key, fetchFunction) => {
  const cacheData = await redis.get(key);
  if (cacheData) {
    return JSON.parse(cacheData);
  }

  const freshData = await fetchFunction();
  await redis.set(key, JSON.stringify(freshData), 'EX', 60);
  return freshData;
};

const fetchData = async () => {
  return { data: 'value' };
};

getCacheData('myKey', fetchData).then(console.log);
