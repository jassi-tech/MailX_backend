import { Schema, model, Document } from 'mongoose';

import { IUser } from '../interface';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    publicKey: { type: String, required: true, unique: true },
    privateKey: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
