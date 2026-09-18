import { Router } from 'express'; 
import { getAllProductsController, getProductByIdController } from '../controllers/productController.js';

const router = Router(); 

router.get('/', getAllProductsController); 
router.get('/:id', getProductByIdController); 


export default router; 