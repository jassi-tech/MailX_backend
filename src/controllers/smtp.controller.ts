import { Response } from 'express';
import { smtpService } from '../services/smtpService';
import { success, error } from '../utils/response';
import { AuthRequest } from '../interface';

export const smtpController = {
  async testConnection(req: AuthRequest, res: Response): Promise<void> {
    let { host, port, secure, user, password } = req.body;
    
    if (!host || !port || !user || !password) { error(res, 'host, port, user, password required', 400); return; }
    
    try {
      await smtpService.testConnection({ 
        host: host.trim(), 
        port, 
        secure: !!secure, 
        user: user.trim(), 
        password 
      });
      success(res, {}, 'SMTP connection successful ✅');
    } catch (err: unknown) {
      error(res, `SMTP connection failed: ${(err as Error).message}`, 400);
    }
  },

  async saveConfig(req: AuthRequest, res: Response): Promise<void> {
    const { label, host, port, secure, user, password, fromName, fromEmail, isDefault } = req.body;
    if (!label || !host || !port || !user || !password || !fromName || !fromEmail) {
      error(res, 'All fields required', 400); return;
    }
    try {
      const config = await smtpService.saveConfig(req.user!.id, { label, host, port, secure, user, password, fromName, fromEmail, isDefault });
      success(res, config, 'SMTP config saved', 201);
    } catch (err: unknown) {
      error(res, `Failed to save config: ${(err as Error).message}`, 500);
    }
  },

  async listConfigs(req: AuthRequest, res: Response): Promise<void> {
    const configs = await smtpService.listConfigs(req.user!.id);
    success(res, configs);
  },

  async deleteConfig(req: AuthRequest, res: Response): Promise<void> {
    const deleted = await smtpService.deleteConfig(req.user!.id, req.params.id as string);
    if (!deleted) { error(res, 'Config not found', 404); return; }
    success(res, {}, 'Config deleted');
  },

  async updateConfig(req: AuthRequest, res: Response): Promise<void> {
    try {
      const config = await smtpService.updateConfig(req.user!.id, req.params.id as string, req.body);
      if (!config) { error(res, 'Config not found', 404); return; }
      success(res, config, 'SMTP config updated');
    } catch (err: unknown) {
      error(res, `Failed to update config: ${(err as Error).message}`, 500);
    }
  },
};
