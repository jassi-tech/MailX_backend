import { Schema, model, Document, Types } from 'mongoose';

import { ITemplate } from '../interface';

const templateSchema = new Schema<ITemplate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    variables: [{ type: String }],
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Template = model<ITemplate>('Template', templateSchema);
