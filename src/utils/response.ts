import { Response } from 'express';

export function success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function error(res: Response, message: string, statusCode = 500, details?: unknown) {
  return res.status(statusCode).json({ success: false, message, ...(details ? { details } : {}) });
}

export function paginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}
