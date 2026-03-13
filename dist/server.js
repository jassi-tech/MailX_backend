"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const env_1 = require("./config/env");
const mailWorker_1 = require("./workers/mailWorker");
const app_1 = __importDefault(require("./app"));
const start = async () => {
    await (0, db_1.connectDB)();
    await (0, redis_1.connectRedis)();
    await (0, mailWorker_1.startMailWorker)();
    app_1.default.listen(env_1.env.port, () => {
        console.log(`\n🚀 MailFlow API running on http://localhost:${env_1.env.port}`);
        console.log(`🌍 Environment: ${env_1.env.nodeEnv}`);
        console.log(`📬 BullMQ mail worker active\n`);
    });
};
start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map