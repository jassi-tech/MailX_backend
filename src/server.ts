import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { env } from './config/env';
import { startMailWorker } from './workers/mailWorker';
import app from './app';

const start = async (): Promise<void> => {
  await connectDB();
  await connectRedis();
  await startMailWorker();

  app.listen(env.port, () => {
    console.log(`\n🚀 MailFlow API running on http://localhost:${env.port}`);
    console.log(`🌍 Environment: ${env.nodeEnv}`);
    console.log(`📬 BullMQ mail worker active\n`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
