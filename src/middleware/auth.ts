import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { error } from '../utils/response';

declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
      displayName?: string;
      emails?: { value: string; verified: boolean }[];
      photos?: { value: string }[];
    }
  }
}

import { AuthRequest } from '../interface';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      error(res, 'Unauthorized – no token', 401);
      return;
    }
    const token = authHeader.split(' ')[1];
    
    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, env.jwtSecret) as { id: string; email: string };
    } catch (err) {
      error(res, 'Unauthorized – invalid token', 401);
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      error(res, 'Unauthorized – user not found', 401);
      return;
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error('🔒 Auth middleware error:', err);
    next(err); // Let errorHandler handle it
  }
};

