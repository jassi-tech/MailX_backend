import { Router } from 'express';
import { apiKeyController } from '../controllers/apikey.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.post('/', apiKeyController.generateKey);
router.get('/', apiKeyController.listKeys);
router.delete('/:id', apiKeyController.revokeKey);

export default router;
