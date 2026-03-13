import { Queue } from 'bullmq';
import { Types } from 'mongoose';
import { SendMailPayload } from '../interface';
export declare const mailQueue: Queue<any, any, string, any, any, string>;
export declare const mailService: {
    queueMail(userId: string, apiKeyId: string, payload: SendMailPayload): Promise<import("mongoose").Document<unknown, {}, import("../interface").IEmailLog, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").IEmailLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getLogs(userId: string, page?: number, limit?: number, status?: string): Promise<{
        logs: (import("mongoose").Document<unknown, {}, import("../interface").IEmailLog, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").IEmailLog & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
    }>;
    getLogById(userId: string, logId: string): Promise<(import("mongoose").Document<unknown, {}, import("../interface").IEmailLog, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").IEmailLog & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
//# sourceMappingURL=mailService.d.ts.map