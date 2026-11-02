import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const projectRoot = resolve(fileURLToPath(new URL('../../../', import.meta.url)));

dotenv.config({
    path: [resolve(projectRoot, '.env.local'), resolve(projectRoot, '.env')],
    quiet: true,
});

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('Missing DATABASE_URL_UNPOOLED or DATABASE_URL for database setup.');
}

const schema = await readFile(resolve(projectRoot, 'server/db/schema.sql'), 'utf8');
const pool = new pg.Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 30000,
});

try {
    await pool.query(schema);
    console.log('Neon Postgres schema applied successfully.');
} finally {
    await pool.end();
}
