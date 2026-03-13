"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = exports.mailQueue = void 0;
const bullmq_1 = require("bullmq");
const redisConnection_1 = require("../config/redisConnection");
const EmailLog_1 = require("../models/EmailLog");
const mongoose_1 = require("mongoose");
// BullMQ queue — connection must be ioredis-style (host/port/password), NOT { url }
exports.mailQueue = new bullmq_1.Queue('mail', {
    connection: (0, redisConnection_1.getBullMQConnection)(),
    defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
});
exports.mailService = {
    async queueMail(userId, apiKeyId, payload) {
        // Create a log entry with 'queued' status
        const log = await EmailLog_1.EmailLog.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            apiKeyId: new mongoose_1.Types.ObjectId(apiKeyId),
            smtpConfigId: new mongoose_1.Types.ObjectId(payload.smtpConfigId),
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            status: 'queued',
            queuedAt: new Date(),
        });
        // Add job to BullMQ
        await exports.mailQueue.add('send-mail', {
            logId: log._id.toString(),
            userId,
            smtpConfigId: payload.smtpConfigId,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
        }, { jobId: log._id.toString() });
        return log;
    },
    async getLogs(userId, page = 1, limit = 20, status) {
        const query = { userId };
        if (status)
            query.status = status;
        const total = await EmailLog_1.EmailLog.countDocuments(query);
        const logs = await EmailLog_1.EmailLog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('smtpConfigId', 'label fromEmail')
            .populate('apiKeyId', 'label keyPrefix');
        return { logs, total };
    },
    async getLogById(userId, logId) {
        return EmailLog_1.EmailLog.findOne({ _id: logId, userId })
            .populate('smtpConfigId', 'label fromEmail host')
            .populate('apiKeyId', 'label keyPrefix');
    },
};
//# sourceMappingURL=mailService.js.map