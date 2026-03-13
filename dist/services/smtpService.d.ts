import { Types } from 'mongoose';
import { SMTPInput } from '../interface';
export declare const smtpService: {
    testConnection(input: Omit<SMTPInput, "label" | "fromName" | "fromEmail" | "isDefault">): Promise<void>;
    saveConfig(userId: string, input: SMTPInput): Promise<import("mongoose").Document<unknown, {}, import("../interface").ISMTPConfig, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ISMTPConfig & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getDecryptedPassword(configId: string): Promise<string>;
    listConfigs(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ISMTPConfig, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ISMTPConfig & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deleteConfig(userId: string, configId: string): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ISMTPConfig, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ISMTPConfig & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateConfig(userId: string, configId: string, input: Partial<SMTPInput>): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ISMTPConfig, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ISMTPConfig & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
//# sourceMappingURL=smtpService.d.ts.map