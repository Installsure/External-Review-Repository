import { Pool } from 'pg';

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// SQL template function
function sql(strings, ...values) {
  if (typeof strings === 'string') {
    // Function form: sql('SELECT * FROM users WHERE id = $1', [userId])
    const query = strings;
    const params = values[0] || [];
    return pool.query(query, params);
  }

  // Template literal form: sql`SELECT * FROM users WHERE id = ${userId}`
  let query = strings[0];
  const params = [];

  for (let i = 0; i < values.length; i++) {
    query += `$${i + 1}${strings[i + 1]}`;
    params.push(values[i]);
  }

  return pool.query(query, params);
}

// Transaction support
sql.transaction = async (queries) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const results = [];
    for (const query of queries) {
      if (typeof query === 'function') {
        // Function form for building queries within transaction
        const result = await query(client);
        results.push(result);
      } else {
        // Direct query execution
        const result = await client.query(query.text, query.values);
        results.push(result);
      }
    }

    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Health check
sql.healthCheck = async () => {
  try {
    const result = await pool.query('SELECT 1 as healthy');
    return result.rows[0].healthy === 1;
  } catch (error) {
    return false;
  }
};

// Graceful shutdown
sql.end = () => {
  return pool.end();
};

export default sql;
