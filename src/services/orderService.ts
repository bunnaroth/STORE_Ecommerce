import { OrderModel, CreateOrderInput} from '../models/Order.js'; 
import { CartModel} from '../models/Cart.js'; 

export class OrderService { 

    static async processOrder(userId: number, shippingAddressId: number, items: any[], totalAmount: number): Promise<number> { 

        if(items.length === 0) { 
            throw new Error('Shopping cart contains no items.');
        }

        const orderInput: CreateOrderInput = { 
            userId, 
            shippingAddressId, 
            totalAmount, 
            items: items.map(item => ({ 
                productId: item.productId, 
                quantity: item.quantity, 
                priceAtPurchase: item.price
            }))
        }; 


        const orderId = await OrderModel.createOrder(orderInput);

        await CartModel.clearCart(userId); 

        return orderId; 
    }

    static async transitionStatus(
        orderId: number, 
        currentStatus: string, 
        targetStatus: string, 
        userRole: 'customer' | 'admin'
    ): Promise<void> { 
        if (userRole === 'customer') { 

            // customer are only allowed to cancel an unfulfilled order
            if (targetStatus === 'cancelled') { 
                if (currentStatus !== 'pending') { 
                    throw new Error('Access Denied: Cannot cancel an order that has entered shipping.');
                }
            } else { 
                throw new Error(`Access denied: Customers cannot update order states to ${targetStatus}`);
            }
        }

        if (userRole === 'admin') { 
            const allowedTransitions: Record<string, string[]> = { 
                'pending': ['paid', 'processing', 'cancelled'],
                'paid': ['processing', 'cancelled'],
                'processing': ['shipped', 'cancelled'],
                'shipped': ['delivered'],
                'delivered': [],
                'cancelled': []
            }; 

            const validTargets = allowedTransitions[currentStatus] || []; 
            if (!validTargets.includes(targetStatus)) { 
                throw new Error(`Cannot transition an order from ${currentStatus} to ${targetStatus}.`);
            }
        }

        const success = await OrderModel.updateStatus(orderId, targetStatus); 
        if (!success) { 
            throw new Error('Target order record not found.');
        }
    }

    static async getUserOrderHistory(userId: number): Promise<any[]> { 
        return await OrderModel.findByUserId(userId); 
    }
}