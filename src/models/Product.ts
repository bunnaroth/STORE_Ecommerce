import { db } from '../config/db.js'; 

export interface ProductRow { 
    id: number; 
    name: string; 
    description: string | null; 
    price: number; 
    stock: number; 
    images: string[];
    category: string; 
    createdAt: Date; 
    updatedAt: Date; 
}

export class ProductModel { 

    static async findAll(category?: string, search?: string): Promise<ProductRow[]> { 
        let queryText = `SELECT * FROM products WHERE 1=1`; 
        const values: any[] = []; 

        if (category) { 
            values.push(category); 
            queryText += ` AND category = $${values.length}`; 
        }

        if (search) { 
            values.push(`%${search}`); 
            queryText += ` AND (name ILIKE $${values.length} OR description ILIKE $${values.length})`;  
        }

        queryText  += ` ORDER BY id DESC`; 
        const { rows } = await db.query(queryText, values); 

        // convert the string decimals from pg driver to js float numbers 
        return rows.map(row => ({...row, price: parseFloat(row.price as any)})); 
    }

    static async findById(id: number): Promise<ProductRow | null> { 
        const queryText = `SELECT * FROM products WHERE id = $1`; 
        const { rows } = await db.query(queryText, [id]);

        if (rows.length === 0) { 
            return null;
        }
        return { ...rows[0], price: parseFloat(rows[0].price as any)};
    }

    static async updateStock(id: number, quantityChange: number): Promise<boolean> { 
        const queryText = `
            UPDATE products 
            SET stock = stock + $2
            WHERE id = $1 AND stock + $2 >= 0
            RETURNING id;
        `;
        const { rows } = await db.query(queryText, [id, quantityChange]); 
        return rows.length > 0; 
    }
}