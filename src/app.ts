import express from 'express';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import cors from 'cors';
import passport from 'passport';
import './config/passport'; // Initialize passport strategy
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import smtpRoutes from './routes/smtp.routes';
import apiKeyRoutes from './routes/apikey.routes';
import mailRoutes from './routes/mail.routes';
import templateRoutes from './routes/template.routes';
import serviceRoutes from './routes/services.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// CORS
app.use(cors({
  origin: env.appUrl,
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.nodeEnv }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/auth', authRoutes); // Support root-level auth for Google callback
app.use('/api/v1/smtp', smtpRoutes);
app.use('/api/v1/keys', apiKeyRoutes);
app.use('/api/v1', mailRoutes);          // /api/v1/send-mail + /api/v1/logs
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/services', serviceRoutes);

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
