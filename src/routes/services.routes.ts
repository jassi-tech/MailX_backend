import { Router, Request, Response } from 'express';
import { SERVICES } from '../data/services';
import { success } from '../utils/response';

const router = Router();

// GET /api/v1/services — public, no auth needed (static catalogue)
router.get('/', (_req: Request, res: Response) => {
  success(res, SERVICES);
});

export default router;
