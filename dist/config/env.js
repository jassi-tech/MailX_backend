"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mailflow',
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD || '',
    },
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    magicLinkExpiresIn: process.env.MAGIC_LINK_EXPIRES_IN || '15m',
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    systemSmtp: {
        host: process.env.SYSTEM_SMTP_HOST || '',
        port: parseInt(process.env.SYSTEM_SMTP_PORT || '587', 10),
        user: process.env.SYSTEM_SMTP_USER || '',
        pass: process.env.SYSTEM_SMTP_PASS || '',
        from: process.env.SYSTEM_SMTP_FROM || 'MailFlow <noreply@mailflow.dev>',
    },
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackUrl: `${process.env.API_URL || 'http://localhost:5000'}/auth/google/callback`,
    },
};
//# sourceMappingURL=env.js.map