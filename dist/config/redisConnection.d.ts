/**
 * Returns an ioredis-compatible connection config for BullMQ.
 * BullMQ uses ioredis internally and does NOT support a `url` key —
 * it needs host/port/password/username explicitly.
 */
export declare const getBullMQConnection: () => {
    host: string;
    port: number;
    username: string;
    password: string;
};
//# sourceMappingURL=redisConnection.d.ts.map