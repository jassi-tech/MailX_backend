import { Router } from 'express';
import { mailController, logController } from '../controllers/mail.controller';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { authMiddleware } from '../middleware/auth';
import { apiKeyRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Send mail – API key auth + rate limit
router.post('/send-mail', apiKeyAuth, apiKeyRateLimiter, mailController.sendMail);

// Logs – JWT auth
router.get('/logs', authMiddleware, logController.getLogs);
router.get('/logs/:id', authMiddleware, logController.getLog);

export default router;
