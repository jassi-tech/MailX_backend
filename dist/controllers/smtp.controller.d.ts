import { Response } from 'express';
import { AuthRequest } from '../interface';
export declare const smtpController: {
    testConnection(req: AuthRequest, res: Response): Promise<void>;
    saveConfig(req: AuthRequest, res: Response): Promise<void>;
    listConfigs(req: AuthRequest, res: Response): Promise<void>;
    deleteConfig(req: AuthRequest, res: Response): Promise<void>;
    updateConfig(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=smtp.controller.d.ts.map