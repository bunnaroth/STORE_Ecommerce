import { Router } from 'express';
import { sendContactMessageController } from '../controllers/contactController.js';
import { validateContactMessage } from '../validators/contactValidator.js';

const router = Router();

router.post('/', validateContactMessage, sendContactMessageController);

export default router;