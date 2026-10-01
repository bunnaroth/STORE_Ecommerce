import {Router} from 'express'; 
import { checkoutSessionController, stripeWebhookController } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { stripeWebhookMiddleware } from '../middleware/stripeWebhookMiddleware.js'; 
import { validatePaymentPayload } from '../validators/paymentValidator.js'; 

const router = Router(); 

router.post('/webhook', stripeWebhookMiddleware, stripeWebhookController); 

router.post('/create-session', authMiddleware, validatePaymentPayload, checkoutSessionController); 

export default router;