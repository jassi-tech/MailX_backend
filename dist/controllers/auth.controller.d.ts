import { Request, Response } from 'express';
export declare const authController: {
    requestMagicLink(req: Request, res: Response): Promise<void>;
    verifyMagicLink(req: Request, res: Response): Promise<void>;
    getMe(req: Request, res: Response): Promise<void>;
    refreshKeys(req: Request, res: Response): Promise<void>;
    deleteAccount(req: Request, res: Response): Promise<void>;
    googleCallback(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map