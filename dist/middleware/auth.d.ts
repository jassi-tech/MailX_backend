import { Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface User {
            id: string;
            email?: string;
            displayName?: string;
            emails?: {
                value: string;
                verified: boolean;
            }[];
            photos?: {
                value: string;
            }[];
        }
    }
}
import { AuthRequest } from '../interface';
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map