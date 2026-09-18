import { db } from '../config/db.js'; 

export interface UserRow { 
    id: number; 
    email: string; 
    passwordHash: string; 
    firstName: string | null; 
    lastName: string | null; 
    role: 'customer' | 'admin'; 
    createdAt: Date; 
    updatedAt: Date; 
}

export class UserModel { 

    static async create(
        email: string, 
        passwordHash: string, 
        firstName?: string, 
        lastName?: string
    ): Promise<UserRow> { 
        const queryText = `
            INSERT INTO users (email,  password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name, role, created_at, updated_at; 
        `;

        const values = [ 
            email.toLowerCase().trim(), 
            passwordHash, 
            firstName || null, 
            lastName || null
        ];

        const { rows} = await db.query(queryText, values);
        return rows[0];
    }

    static async findByEmail(email: string): Promise<UserRow | null> { 
        const queryText = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await db.query(queryText, [email.toLowerCase().trim()]); 
        if (rows.length === 0) return null; 
        return rows[0];
    }

    static async findById(id: number): Promise<Omit<UserRow, 'password_hash'> | null> { 
        // exclude the password hash when retreive the profile
        const queryText = `
            SELECT id, email, first_name, last_name, role, created_at, updated_at 
            FROM users 
            WHERE id = $1; 
        `;
        const { rows} = await db.query(queryText, [id]); 

        if ( rows.length === 0) return null;
        return rows[0];
    }
}