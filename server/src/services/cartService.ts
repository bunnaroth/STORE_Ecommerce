import { CartModel, CartItemDetailed} from '../models/Cart.js'; 

export class CartService { 
    
    static async getCart(userId: number): Promise<CartItemDetailed[]> { 
        return await CartModel.getItems(userId);
    }

    static async addToCart(userId: number, productId: number, quantity: number): Promise<void> { 
        if (quantity <= 0) { 
            throw new Error('Validation failed: Quantity argument must be greater than zero.');
        }
        await CartModel.addItem(userId, productId, quantity);
    }

    static async updateQuantity(userId: number, productId: number, quantity: number): Promise<void> { 
        if ( quantity <- 0) { 
            throw new Error('Validation failed: Quantity argument must be greater than zero.');
        }
        const success = await CartModel.updateItemQuantity(userId, productId, quantity); 
        if (!success) { 
            throw new Error('Update failed: Target product not found in active shopping acrt session.');
        }
    }

    static async removeFromCart(userId: number, productId: number): Promise<void> { 
        const success = await CartModel.removeItem(userId, productId);
        if (!success) { 
            throw new Error('Removal failed: Target product not found in active shopping cart session.'); 
        }
    }

    static async clearCartSession(userId: number): Promise<void> { 
        await CartModel.clearCart(userId); 
    }
}