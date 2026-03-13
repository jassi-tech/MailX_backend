import { Response } from 'express';
export declare function success<T>(res: Response, data: T, message?: string, statusCode?: number): Response<any, Record<string, any>>;
export declare function error(res: Response, message: string, statusCode?: number, details?: unknown): Response<any, Record<string, any>>;
export declare function paginated<T>(res: Response, data: T[], total: number, page: number, limit: number, message?: string): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map