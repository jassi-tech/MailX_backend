import { Request } from 'express';
import { Document, Types } from 'mongoose';
export interface AuthRequest extends Request {
}
export interface ApiKeyRequest extends Request {
    apiKey?: {
        id: string;
        userId: string;
        smtpConfigId: string;
    };
}
export interface IUser extends Document {
    email: string;
    name?: string;
    publicKey: string;
    privateKey: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISMTPConfig extends Document {
    userId: Types.ObjectId;
    label: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    encryptedPass: EncryptedData;
    fromName: string;
    fromEmail: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IApiKey extends Document {
    userId: Types.ObjectId;
    label: string;
    keyHash: string;
    keyPrefix: string;
    smtpConfigId: Types.ObjectId;
    isActive: boolean;
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITemplate extends Document {
    userId: Types.ObjectId;
    templateId: string;
    name: string;
    subject: string;
    html: string;
    variables: string[];
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type EmailStatus = 'queued' | 'sending' | 'sent' | 'failed';
export interface IEmailLog extends Document {
    userId: Types.ObjectId;
    apiKeyId: Types.ObjectId;
    smtpConfigId: Types.ObjectId;
    to: string | string[];
    subject: string;
    html: string;
    status: EmailStatus;
    errorMessage?: string;
    queuedAt: Date;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ServiceDef {
    id: string;
    name: string;
    category: 'personal' | 'transactional';
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    isSelectable: boolean;
    logoUrl?: string;
}
export interface SMTPInput {
    label: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    fromName: string;
    fromEmail: string;
    isDefault?: boolean;
}
export interface SendMailPayload {
    to: string | string[];
    subject: string;
    html: string;
    smtpConfigId: string;
}
export interface EncryptedData {
    iv: string;
    authTag: string;
    ciphertext: string;
}
export interface MailJobData {
    logId: string;
    userId: string;
    smtpConfigId: string;
    to: string | string[];
    subject: string;
    html: string;
}
//# sourceMappingURL=interface.d.ts.map