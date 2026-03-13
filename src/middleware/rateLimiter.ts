import rateLimit from 'express-rate-limit';
import { ApiKeyRequest } from '../interface';
import { Request, Response } from 'express';

export const apiKeyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator: (req: Request) => {
    return (req as ApiKeyRequest).apiKey?.id || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ success: false, message: 'Rate limit exceeded. Max 100 requests per 15 minutes.' });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
