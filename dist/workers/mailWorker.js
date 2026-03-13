"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMailWorker = void 0;
const bullmq_1 = require("bullmq");
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = require("../config/db");
const redisConnection_1 = require("../config/redisConnection");
const EmailLog_1 = require("../models/EmailLog");
const SMTPConfig_1 = require("../models/SMTPConfig");
const crypto_1 = require("../utils/crypto");
const processMailJob = async (job) => {
    const { logId, smtpConfigId, to, subject, html } = job.data;
    // Mark as 'sending'
    await EmailLog_1.EmailLog.findByIdAndUpdate(logId, { status: 'sending' });
    try {
        // Fetch SMTP config and decrypt password
        const smtpConfig = await SMTPConfig_1.SMTPConfig.findById(smtpConfigId);
        if (!smtpConfig)
            throw new Error('SMTP config not found');
        const password = (0, crypto_1.decrypt)(smtpConfig.encryptedPass);
        const transporter = nodemailer_1.default.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            auth: { user: smtpConfig.user, pass: password },
        });
        await transporter.sendMail({
            from: `${smtpConfig.fromName} <${smtpConfig.fromEmail}>`,
            to: Array.isArray(to) ? to.join(',') : to,
            subject,
            html,
        });
        // Mark as 'sent'
        await EmailLog_1.EmailLog.findByIdAndUpdate(logId, {
            status: 'sent',
            sentAt: new Date(),
        });
        console.log(`✅ Mail sent [log: ${logId}]`);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        await EmailLog_1.EmailLog.findByIdAndUpdate(logId, { status: 'failed', errorMessage: msg });
        console.error(`❌ Mail failed [log: ${logId}]:`, msg);
        throw err; // Re-throw so BullMQ can retry
    }
};
const startMailWorker = async () => {
    await (0, db_1.connectDB)(); // Worker needs its own DB connection
    // BullMQ connection must use ioredis-style config (host/port/password), NOT { url }
    const worker = new bullmq_1.Worker('mail', processMailJob, {
        connection: (0, redisConnection_1.getBullMQConnection)(),
        concurrency: 5,
    });
    worker.on('completed', (job) => console.log(`📬 Job ${job.id} completed`));
    worker.on('failed', (job, err) => console.error(`💥 Job ${job?.id} failed:`, err.message));
    console.log('🚀 Mail worker started');
};
exports.startMailWorker = startMailWorker;
// Allow running as standalone: ts-node src/workers/mailWorker.ts
if (require.main === module) {
    (0, exports.startMailWorker)().catch(console.error);
}
//# sourceMappingURL=mailWorker.js.map