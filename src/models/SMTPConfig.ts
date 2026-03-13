import { Schema, model, Document, Types } from 'mongoose';

import { ISMTPConfig } from '../interface';

const smtpConfigSchema = new Schema<ISMTPConfig>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, required: true, trim: true },
    host: { type: String, required: true },
    port: { type: Number, required: true, default: 587 },
    secure: { type: Boolean, default: false },
    user: { type: String, required: true },
    encryptedPass: {
      iv: { type: String, required: true },
      authTag: { type: String, required: true },
      ciphertext: { type: String, required: true },
    },
    fromName: { type: String, required: true },
    fromEmail: { type: String, required: true, lowercase: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SMTPConfig = model<ISMTPConfig>('SMTPConfig', smtpConfigSchema);
