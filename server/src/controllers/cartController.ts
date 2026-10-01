import { Request, Response } from "express";
import { CartService } from "../services/cartService.js";

export const getCartController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const userId = (req as any).user.id; 
        const cart = await CartService.getCart(userId); 
        res.status(200).json(cart); 
    } catch (error: any) { 
        res.status(500).json({error: error.message}); 
    }
}; 

export const addToCartController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const userId = (req as any).user.id; 
        const { productId, quantity} = req.body; 

        if ( !productId || !quantity) { 
            res.status(400).json({error: 'Payload missing required productId or quantity parameters.'}); 
            return;
        }

        await CartService.addToCart(userId, parseInt(productId, 10), parseInt(quantity, 10)); 
        res.status(200).json({message: 'Items successfully added to shoping cart.'});
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}; 

export const updateCartQuantityController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
        const productIdParam = req.params.productId;
        const productId = parseInt(Array.isArray(productIdParam) ? productIdParam[0] : productIdParam, 10);
        const { quantity } = req.body;

        if (isNaN(productId) || quantity === undefined) {
            res.status(400).json({ error: 'Invalid or missing product reference parameter markers.' });
            return;
        }

    await CartService.updateQuantity(userId, productId, parseInt(quantity, 10));
    res.status(200).json({ message: 'Cart item count modified successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCartController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const userId = (req as any).user.id; 
        const productIdParam = req.params.productId; 
        const productId = parseInt(Array.isArray(productIdParam) ? productIdParam[0] : productIdParam, 10);

        if (isNaN(productId)) { 
            res.status(400).json({message: 'Invalid product identifier structural.'}); 
            return; 
        }

        await CartService.removeFromCart(userId, productId); 
        res.status(200).json({message: 'Product successfully removed from cart.'});
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
};

export const clearCartController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const userId = (req as any).user.id;
        await CartService.clearCartSession(userId); 
        res.status(200).json({message: 'Shopping cart cleared successfully.'});
    } catch(error: any) { 
        res.status(500).json({error: error.message});
    }
};



