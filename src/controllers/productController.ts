import { Request, Response } from 'express'; 
import { ProductService } from '../services/productService.js';

export const getAllProductsController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const category = req.query.category as string | undefined; 
        const search = req.query.category as string | undefined; 

        const products = await ProductService.getAllProducts(category, search); 
        res.status(200).json(products); 
    } catch (error: any) { 
        res.status(500).json({error: error.message});
    }
}; 

export const getProductByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const productIdParam = req.params.id;

    if (typeof productIdParam !== 'string') {
      res.status(400).json({ error: 'Invalid product identifier argument provided.' });
      return;
    }

    const productId = parseInt(productIdParam, 10);
    
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product identifier argument provided.' });
      return;
    }

    const product = await ProductService.getProductById(productId);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};