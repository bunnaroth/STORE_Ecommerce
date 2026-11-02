import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const envDirectory = resolve(fileURLToPath(new URL('../../../', import.meta.url)));

dotenv.config({
    path: [resolve(envDirectory, '.env.local'), resolve(envDirectory, '.env')],
    quiet: true,
});

const databaseUrl = process.env.DATABASE_URL;

export const pool = new Pool({
    ...(databaseUrl
        ? { connectionString: databaseUrl }
        : {
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
          }),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
});

pool.on('error', (err) => {
    console.error('Unexpected database error on idle pool client:', err);
    process.exit(-1);
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
};