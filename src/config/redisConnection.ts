import { env } from './env';

/**
 * Returns an ioredis-compatible connection config for BullMQ.
 * BullMQ uses ioredis internally and does NOT support a `url` key — 
 * it needs host/port/password/username explicitly.
 */
export const getBullMQConnection = () => ({
  host: env.redis.host,
  port: env.redis.port,
  username: env.redis.username,
  password: env.redis.password,
});
