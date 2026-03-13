import { Schema, model, Document, Types } from 'mongoose';
import crypto from 'crypto';

import { IApiKey } from '../interface';

const apiKeySchema = new Schema<IApiKey>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, required: true, trim: true },
    keyHash: { type: String, required: true, unique: true },
    keyPrefix: { type: String, required: true },
    smtpConfigId: { type: Schema.Types.ObjectId, ref: 'SMTPConfig', required: true },
    isActive: { type: Boolean, default: true },
    lastUsedAt: { type: Date },
  },
  { timestamps: true }
);

// Static method to generate a new raw API key
apiKeySchema.statics.generateKey = (): string => {
  return `mf_${crypto.randomBytes(32).toString('hex')}`;
};

// Static method to hash a raw key for storage
apiKeySchema.statics.hashKey = (rawKey: string): string => {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
};

export const ApiKey = model<IApiKey>('ApiKey', apiKeySchema);
