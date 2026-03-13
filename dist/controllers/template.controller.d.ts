import { Response } from 'express';
import { AuthRequest } from '../interface';
export declare const templateController: {
    create(req: AuthRequest, res: Response): Promise<void>;
    list(req: AuthRequest, res: Response): Promise<void>;
    getById(req: AuthRequest, res: Response): Promise<void>;
    update(req: AuthRequest, res: Response): Promise<void>;
    delete(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=template.controller.d.ts.map