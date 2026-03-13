import crypto from 'crypto';
import { Response } from 'express';
import { ApiKey } from '../models/ApiKey';
import { SMTPConfig } from '../models/SMTPConfig';
import { success, error } from '../utils/response';
import { AuthRequest } from '../interface';
import { Types } from 'mongoose';

export const apiKeyController = {
  async generateKey(req: AuthRequest, res: Response): Promise<void> {
    const { label, smtpConfigId } = req.body;
    if (!label || !smtpConfigId) { error(res, 'label and smtpConfigId required', 400); return; }
    const configExists = await SMTPConfig.findOne({ _id: smtpConfigId, userId: req.user!.id });
    if (!configExists) { error(res, 'SMTP config not found', 404); return; }

    const rawKey = `mf_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 10);

    const apiKey = await ApiKey.create({
      userId: new Types.ObjectId(req.user!.id),
      label,
      keyHash,
      keyPrefix,
      smtpConfigId: new Types.ObjectId(smtpConfigId),
    });

    // Return raw key once – never stored again
    success(res, { ...apiKey.toObject(), rawKey }, 'API key generated – save this key, it won\'t be shown again', 201);
  },

  async listKeys(req: AuthRequest, res: Response): Promise<void> {
    const keys = await ApiKey.find({ userId: req.user!.id }, { keyHash: 0 })
      .populate('smtpConfigId', 'label fromEmail')
      .sort({ createdAt: -1 });
    success(res, keys);
  },

  async revokeKey(req: AuthRequest, res: Response): Promise<void> {
    const deleted = await ApiKey.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!deleted) { error(res, 'API key not found', 404); return; }
    success(res, {}, 'API key revoked');
  },
};
