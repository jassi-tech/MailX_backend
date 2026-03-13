"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBullMQConnection = void 0;
const env_1 = require("./env");
/**
 * Returns an ioredis-compatible connection config for BullMQ.
 * BullMQ uses ioredis internally and does NOT support a `url` key —
 * it needs host/port/password/username explicitly.
 */
const getBullMQConnection = () => ({
    host: env_1.env.redis.host,
    port: env_1.env.redis.port,
    username: env_1.env.redis.username,
    password: env_1.env.redis.password,
});
exports.getBullMQConnection = getBullMQConnection;
//# sourceMappingURL=redisConnection.js.map