import { Router } from 'express';
import { smtpController } from '../controllers/smtp.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.post('/test', smtpController.testConnection);
router.post('/', smtpController.saveConfig);
router.get('/', smtpController.listConfigs);
router.put('/:id', smtpController.updateConfig);
router.delete('/:id', smtpController.deleteConfig);

export default router;
