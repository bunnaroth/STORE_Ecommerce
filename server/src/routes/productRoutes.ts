import { Router } from 'express'; 
import { getAllProductsController, getFeaturedProductsController, getProductByIdController } from '../controllers/productController.js';

const router = Router(); 

router.get('/', getAllProductsController); 
router.get('/featured', getFeaturedProductsController);
router.get('/:id', getProductByIdController); 


export default router; 