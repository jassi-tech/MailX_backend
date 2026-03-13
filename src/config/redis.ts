import { createClient } from 'redis';
import { env } from './env';

// redis npm client — uses socket: { host, port } format for Redis Cloud
export const redisClient = createClient({
  username: env.redis.username,
  password: env.redis.password,
  socket: {
    host: env.redis.host,
    port: env.redis.port,
  },
});

redisClient.on('error', (err) => console.error('❌ Redis error:', err));

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
  console.log('✅ Redis connected');
};
