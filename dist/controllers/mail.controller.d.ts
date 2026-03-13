import { Response } from 'express';
import { ApiKeyRequest, AuthRequest } from '../interface';
export declare const mailController: {
    sendMail(req: ApiKeyRequest, res: Response): Promise<void>;
};
export declare const logController: {
    getLogs(req: AuthRequest, res: Response): Promise<void>;
    getLog(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=mail.controller.d.ts.map