import { Schema, model, Document, Types } from 'mongoose';

import { EmailStatus, IEmailLog } from '../interface';

const emailLogSchema = new Schema<IEmailLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    apiKeyId: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true },
    smtpConfigId: { type: Schema.Types.ObjectId, ref: 'SMTPConfig', required: true },
    to: { type: Schema.Types.Mixed, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    status: {
      type: String,
      enum: ['queued', 'sending', 'sent', 'failed'],
      default: 'queued',
    },
    errorMessage: { type: String },
    queuedAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

// Index for quick filtering by status
emailLogSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const EmailLog = model<IEmailLog>('EmailLog', emailLogSchema);
