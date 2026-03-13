import { User } from '../models/User';
export declare const authService: {
    generateMagicToken(email: string): string;
    generateSessionJWT(userId: string, email: string): string;
    verifyMagicToken(token: string): {
        email: string;
    };
    findOrCreateUser(email: string): Promise<InstanceType<typeof User>>;
    sendMagicLink(email: string, token: string): Promise<void>;
};
//# sourceMappingURL=authService.d.ts.map