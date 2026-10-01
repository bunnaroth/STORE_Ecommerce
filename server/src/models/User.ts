import { db } from '../config/db.js'; 

export interface UserRow { 
    id: number; 
    email: string; 
    password_hash: string;
    first_name: string | null;
    last_name: string | null;
    created_at: Date;
    updated_at: Date;
}

export type UserProfileRow = Omit<UserRow, 'password_hash'>;

export class UserModel { 

    static async create(
        email: string, 
        passwordHash: string, 
        firstName?: string, 
        lastName?: string
    ): Promise<UserProfileRow> {
        const queryText = `
            INSERT INTO users (email,  password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name, created_at, updated_at;
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
        const queryText = `
            SELECT id, email, password_hash, first_name, last_name, created_at, updated_at
            FROM users
            WHERE email = $1
        `;
        const { rows } = await db.query(queryText, [email.toLowerCase().trim()]); 
        if (rows.length === 0) return null; 
        return rows[0];
    }

    static async findById(id: number): Promise<UserProfileRow | null> {
        // exclude the password hash when retreive the profile
        const queryText = `
            SELECT id, email, first_name, last_name, created_at, updated_at
            FROM users
            WHERE id = $1;
        `;
        const { rows} = await db.query(queryText, [id]); 

        if ( rows.length === 0) return null;
        return rows[0];
    }

    static async updateProfile( 
        id: number, 
        email: string, 
        firstName: string, 
        lastName: string, 
    ): Promise<UserProfileRow | null> {
        const queryText = `
            UPDATE users
            SET 
                email = $1, 
                first_name = $2, 
                last_name = $3, 
                updated_at = NOW()
            WHERE id = $4
            RETURNING id, email, first_name, last_name, created_at, updated_at;
        `;

        const values = [ 
            email.toLowerCase().trim(), 
            firstName.trim(),
            lastName.trim(), 
            id,
        ];

        const { rows } = await db.query(queryText, values); 

        if (rows.length === 0) { 
            return null; 
        }

        return rows[0];
    }
}