import { Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import { connectDB } from '../config/db';
import { getBullMQConnection } from '../config/redisConnection';
import { EmailLog } from '../models/EmailLog';
import { SMTPConfig } from '../models/SMTPConfig';
import { decrypt } from '../utils/crypto';

import { MailJobData } from '../interface';

const processMailJob = async (job: Job<MailJobData>): Promise<void> => {
  const { logId, smtpConfigId, to, subject, html } = job.data;

  // Mark as 'sending'
  await EmailLog.findByIdAndUpdate(logId, { status: 'sending' });

  try {
    // Fetch SMTP config and decrypt password
    const smtpConfig = await SMTPConfig.findById(smtpConfigId);
    if (!smtpConfig) throw new Error('SMTP config not found');

    const password = decrypt(smtpConfig.encryptedPass);

    const transporter = nodemailer.createTransport({
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
    await EmailLog.findByIdAndUpdate(logId, {
      status: 'sent',
      sentAt: new Date(),
    });

    console.log(`✅ Mail sent [log: ${logId}]`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    await EmailLog.findByIdAndUpdate(logId, { status: 'failed', errorMessage: msg });
    console.error(`❌ Mail failed [log: ${logId}]:`, msg);
    throw err; // Re-throw so BullMQ can retry
  }
};

export const startMailWorker = async (): Promise<void> => {
  await connectDB(); // Worker needs its own DB connection

  // BullMQ connection must use ioredis-style config (host/port/password), NOT { url }
  const worker = new Worker<MailJobData>('mail', processMailJob, {
    connection: getBullMQConnection(),
    concurrency: 5,
  });

  worker.on('completed', (job) => console.log(`📬 Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`💥 Job ${job?.id} failed:`, err.message));
  console.log('🚀 Mail worker started');
};

// Allow running as standalone: ts-node src/workers/mailWorker.ts
if (require.main === module) {
  startMailWorker().catch(console.error);
}
