import { Pool } from 'pg';
import { config } from '../config/env.js';
const pool = new Pool({
    connectionString: config.DATABASE_URL,
    ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
export const db = {
    async query(text, params) {
        const client = await pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        }
        finally {
            client.release();
        }
    },
    async transaction(callback) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
};
//# sourceMappingURL=db.js.map