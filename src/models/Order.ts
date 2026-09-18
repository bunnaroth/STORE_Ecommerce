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

export interface OrderRow { 
    id: number; 
    userId: number; 
    shippingAddress: number | null; 
    totalAmount: number; 
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';  
    stripeSessionId: string | null; 
    created_at: Date; 
    updated_at: Date; 
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

    static async findByUserId(userId: number): Promise<any[]> { 
        const queryText = `
            SELECT id, shipping_address_id, total_amount, status, stripe_session_id, created_at, updated_at
            FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `;

        const { rows } = await db.query(queryText, [userId]); 

        return rows.map(row => ({
            id: row.id, 
            shippingAddress: row.shipping_address_id, 
            totalAmount: parseFloat(row.total_amount), 
            status: row.status, 
            stripeSessionId: row.stripe_session_id, 
            createdAt: row.created_at, 
            updated_At: row.updated_at
        }));
    } 

    static async updateStatus(id: number, status: string): Promise<boolean> { 
        const queryText = `
            UPDATE orders 
            SET status = $2::order_status, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1, 
            RETRUNING id;
        `;
        const { rows } = await db.query(queryText, [id, status]); 
        return rows.length > 0; 
    }
}