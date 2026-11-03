import {Router} from 'express'; 
import { checkoutSessionController, stripeWebhookController } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validatePaymentPayload } from '../validators/paymentValidator.js'; 

const router = Router(); 

router.post('/webhook', stripeWebhookController);

router.post('/create-session', authMiddleware, validatePaymentPayload, checkoutSessionController); 

export default router;