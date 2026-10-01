import { db } from '../config/db.js'; 

export interface OrderItemInput { 
    productId: number; 
    quantity: number; 
    priceAtPurchase: number;
}

export interface CreateOrderInput { 
    userId: number; 
    shippingAddressId: number; 
    totalAmount: number; 
    stripeSessionId?: string; 
    items: OrderItemInput[]; 
}

export class OrderModel { 
    
    static async createOrder(input: CreateOrderInput): Promise<number> { 
        try { 
            await db.query('BEGIN'); 
             
            const orderQueryText = `
                INSERT INTO orders (user_id, shipping_address_id, total_amount, stripe_session_id, status)
                VALUES ($1, $2, $3, $4, 'pending')
                RETURNING id;
            `; 
            const orderValues = [ 
                input.userId, 
                input.shippingAddressId,
                input.totalAmount, 
                input.stripeSessionId || null 
            ]; 

            const orderResult = await db.query(orderQueryText, orderValues); 
            const orderId = orderResult.rows[0].id; 

            // Insert into individula order items
            const itemQueryText = `
                INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                VALUES ($1, $2, $3, $4);
            `; 

            for (const item of input.items) { 
                await db.query(itemQueryText, [ 
                    orderId, 
                    item.productId, 
                    item.quantity, 
                    item.priceAtPurchase
                ]);
            }

            // commit all data rows 
            await db.query('COMMIT'); 
            return orderId; 
        } catch (error) { 

            // rollback if any single item operation fails 
            await db.query('ROLLBACK');
            throw error;
        }
    }

}