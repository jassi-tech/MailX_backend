"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
// redis npm client — uses socket: { host, port } format for Redis Cloud
exports.redisClient = (0, redis_1.createClient)({
    username: env_1.env.redis.username,
    password: env_1.env.redis.password,
    socket: {
        host: env_1.env.redis.host,
        port: env_1.env.redis.port,
    },
});
exports.redisClient.on('error', (err) => console.error('❌ Redis error:', err));
const connectRedis = async () => {
    await exports.redisClient.connect();
    console.log('✅ Redis connected');
};
exports.connectRedis = connectRedis;
//# sourceMappingURL=redis.js.map