import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;
  try {
    await mongoose.connect(env.mongoUri, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      retryWrites: true,
    });


    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

