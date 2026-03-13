import { Response } from 'express';
import { AuthRequest } from '../interface';
export declare const apiKeyController: {
    generateKey(req: AuthRequest, res: Response): Promise<void>;
    listKeys(req: AuthRequest, res: Response): Promise<void>;
    revokeKey(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=apikey.controller.d.ts.map