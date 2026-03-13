import { Queue } from 'bullmq';
import { getBullMQConnection } from '../config/redisConnection';
import { EmailLog } from '../models/EmailLog';
import { Types } from 'mongoose';

import { SendMailPayload } from '../interface';

// BullMQ queue — connection must be ioredis-style (host/port/password), NOT { url }
export const mailQueue = new Queue('mail', {
  connection: getBullMQConnection(),
  defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
});

export const mailService = {
  async queueMail(userId: string, apiKeyId: string, payload: SendMailPayload) {
    // Create a log entry with 'queued' status
    const log = await EmailLog.create({
      userId: new Types.ObjectId(userId),
      apiKeyId: new Types.ObjectId(apiKeyId),
      smtpConfigId: new Types.ObjectId(payload.smtpConfigId),
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      status: 'queued',
      queuedAt: new Date(),
    });

    // Add job to BullMQ
    await mailQueue.add(
      'send-mail',
      {
        logId: log._id!.toString(),
        userId,
        smtpConfigId: payload.smtpConfigId,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      },
      { jobId: log._id!.toString() }
    );

    return log;
  },

  async getLogs(userId: string, page = 1, limit = 20, status?: string) {
    const query: Record<string, unknown> = { userId };
    if (status) query.status = status;
    const total = await EmailLog.countDocuments(query);
    const logs = await EmailLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('smtpConfigId', 'label fromEmail')
      .populate('apiKeyId', 'label keyPrefix');
    return { logs, total };
  },

  async getLogById(userId: string, logId: string) {
    return EmailLog.findOne({ _id: logId, userId })
      .populate('smtpConfigId', 'label fromEmail host')
      .populate('apiKeyId', 'label keyPrefix');
  },
};
