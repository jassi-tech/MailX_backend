import { Response } from 'express';
import { templateService } from '../services/templateService';
import { success, error } from '../utils/response';
import { AuthRequest } from '../interface';

export const templateController = {
  async create(req: AuthRequest, res: Response): Promise<void> {
    const { name, subject, html } = req.body;
    if (!name || !subject || !html) { error(res, 'name, subject, html required', 400); return; }
    const template = await templateService.create(req.user!.id, { name, subject, html });
    success(res, template, 'Template created', 201);
  },

  async list(req: AuthRequest, res: Response): Promise<void> {
    const templates = await templateService.list(req.user!.id);
    success(res, templates);
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const template = await templateService.getById(req.user!.id, req.params.id as string);
    if (!template) { error(res, 'Template not found', 404); return; }
    success(res, template);
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    const template = await templateService.update(req.user!.id, req.params.id as string, req.body);
    if (!template) { error(res, 'Template not found', 404); return; }
    success(res, template, 'Template updated');
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const deleted = await templateService.delete(req.user!.id, req.params.id as string);
    if (!deleted) { error(res, 'Template not found', 404); return; }
    success(res, {}, 'Template deleted');
  },
};
