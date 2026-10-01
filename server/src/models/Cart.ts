import { db } from '../config/db.js'; 

export interface CartItemDetailed { 
    cartItemId: number; 
    productId: number; 
    name: string;
    price: number; 
    quantity: number; 
    images: string[]; 
    stock: number;
}

export class CartModel { 

    static async getOrCreateCart(userId: number): Promise<number> { 
        let queryText = `SELECT id from carts WHERE user_id = $1`; 
        let { rows } = await db.query(queryText, [userId]); 

        if (rows.length === 0) { 
            queryText = `INSERT INTO carts (user_id) VALUES ($1) RETURNING id;`; 
            const result = await db.query(queryText, [userId]); 
            return result.rows[0].id; 
        }

        return rows[0].id; 
    }

    static async getItems(userId: number): Promise<CartItemDetailed[]> { 
        const cartId = await this.getOrCreateCart(userId); 
        const queryText = `
            SELECT ci.id as "cartItemId", p.id as "productId", p.name, p.price, ci.quantity, p.images, p.stock
            FROM cart_items ci
            JOIN products p on ci.product_id = p.id
            WHERE ci.cart_id = $1
            ORDER BY ci.created_at DESC; 
        `;
        const { rows} = await db.query(queryText, [cartId]); 
        return rows.map(row => ({...row, price: parseFloat(row.price as any)})); 
    }

    static async addItem(userId: number, productId: number, quantity: number): Promise<void> { 
        const cartId = await this.getOrCreateCart(userId); 
        const queryText = `
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (cart_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP;
        `;
        await db.query(queryText, [cartId, productId, quantity]); 
    }

    
    static async updateItemQuantity(userId:number, productId: number, quantity: number): Promise<boolean> { 
        const cartId = await this.getOrCreateCart(userId);
        const queryText = `
            UPDATE cart_items
            SET quantity = $3, updated_at = CURRENT_TIMESTAMP
            WHERE cart_id = $1 AND product_id = $2
            RETURNING id;
        `;

        const { rows } = await db.query(queryText, [cartId, productId, quantity]); 
        return rows.length > 0; 
    }

    static async removeItem(userId: number, productId: number): Promise<boolean> { 
        const cartId = await this.getOrCreateCart(userId); 
        const queryText = `DELETE FROM cart_items WHERE cart_id = $1 AND  product_id = $2 RETURNING id;`; 
        const { rows } = await db.query(queryText, [cartId, productId]); 
        return rows.length > 0;
    }

    static async clearCart(userId: number): Promise<void> { 
        const cartId = await this.getOrCreateCart(userId); 
        const queryText = `DELETE FROM cart_items WHERE cart_id = $1;`;
        await db.query(queryText, [cartId]);  
    }
}
