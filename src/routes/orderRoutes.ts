import { Router } from 'express';
import { createOrderController, getUserOrdersController, updateOrderStatusController } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateOrderInput } from '../validators/orderValidator.js';

const router = Router();

router.use(authMiddleware);

router.post('/', validateOrderInput, createOrderController);
router.get('/', getUserOrdersController);
router.put('/:id/status', updateOrderStatusController);

export default router;
