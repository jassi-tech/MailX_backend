import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ApiKey } from '../models/ApiKey';
import { error } from '../utils/response';

import { ApiKeyRequest } from '../interface';

export const apiKeyAuth = async (req: ApiKeyRequest, res: Response, next: NextFunction): Promise<void> => {
  const rawKey = req.headers['x-api-key'] as string;
  if (!rawKey) { error(res, 'API key required', 401); return; }

  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const apiKey = await ApiKey.findOne({ keyHash, isActive: true });
  if (!apiKey) { error(res, 'Invalid or revoked API key', 401); return; }

  // Update last used timestamp (non-blocking)
  ApiKey.findByIdAndUpdate(apiKey._id, { lastUsedAt: new Date() }).exec();

  req.apiKey = {
    id: String(apiKey._id),
    userId: String(apiKey.userId),
    smtpConfigId: String(apiKey.smtpConfigId),
  };
  next();
};
