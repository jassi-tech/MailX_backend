import { Response } from 'express';
import { mailService } from '../services/mailService';
import { success, error, paginated } from '../utils/response';
import { ApiKeyRequest, AuthRequest } from '../interface';

export const mailController = {
  async sendMail(req: ApiKeyRequest, res: Response): Promise<void> {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) { error(res, 'to, subject, html required', 400); return; }

    try {
      const log = await mailService.queueMail(req.apiKey!.userId, req.apiKey!.id, {
        to,
        subject,
        html,
        smtpConfigId: req.apiKey!.smtpConfigId,
      });
      success(res, { logId: log._id, status: log.status }, 'Email queued', 202);
    } catch (err: unknown) {
      error(res, `Failed to queue email: ${(err as Error).message}`, 500);
    }
  },
};

export const logController = {
  async getLogs(req: AuthRequest, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const { logs, total } = await mailService.getLogs(req.user!.id, page, limit, status);
    paginated(res, logs, total, page, limit);
  },

  async getLog(req: AuthRequest, res: Response): Promise<void> {
    const log = await mailService.getLogById(req.user!.id, req.params.id as string);
    if (!log) { error(res, 'Log not found', 404); return; }
    success(res, log);
  },
};
