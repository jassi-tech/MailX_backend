import { Router } from 'express';
import { templateController } from '../controllers/template.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.post('/', templateController.create);
router.get('/', templateController.list);
router.get('/:id', templateController.getById);
router.put('/:id', templateController.update);
router.delete('/:id', templateController.delete);

export default router;
