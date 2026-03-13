import { Types } from 'mongoose';
export declare const templateService: {
    create(userId: string, data: {
        name: string;
        subject: string;
        html: string;
    }, isDefault?: boolean): Promise<import("mongoose").Document<unknown, {}, import("../interface").ITemplate, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ITemplate & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    list(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ITemplate, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ITemplate & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    seedDefaultsForUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ITemplate, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ITemplate & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getById(userId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ITemplate, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ITemplate & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(userId: string, id: string, data: {
        name?: string;
        subject?: string;
        html?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ITemplate, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ITemplate & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    delete(userId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("../interface").ITemplate, {}, import("mongoose").DefaultSchemaOptions> & import("../interface").ITemplate & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
//# sourceMappingURL=templateService.d.ts.map