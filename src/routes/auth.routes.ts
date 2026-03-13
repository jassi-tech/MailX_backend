import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import passport from 'passport';

const router = Router();

router.post('/magic-link', authRateLimiter, authController.requestMagicLink);
router.get('/verify', authController.verifyMagicLink);
router.get('/me', authMiddleware, authController.getMe);
router.delete('/me', authMiddleware, authController.deleteAccount);
router.post('/keys/refresh', authMiddleware, authController.refreshKeys);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

export default router;
