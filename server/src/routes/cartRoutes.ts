import { Router } from 'express'; 
import { 
    getCartController,
    addToCartController, 
    updateCartQuantityController, 
    removeFromCartController, 
    clearCartController
} from '../controllers/cartController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router(); 

router.use(authMiddleware);

router.get('/', getCartController); 
router.post('/add', addToCartController);
router.put('/update/:productId', updateCartQuantityController); 
router.delete('/remove/:productId', removeFromCartController); 
router.delete('/clear', clearCartController); 

export default router; 