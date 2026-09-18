import pg from 'pg'; 

const { Pool } = pg; 

export const pool = new Pool({ 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10): 5432, 
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Unexpected database error on idle pool client:', err);
    process.exit(-1);
}); 

export const db = { 
    query: (text: string, params?: any[]) => pool.query(text, params),
};