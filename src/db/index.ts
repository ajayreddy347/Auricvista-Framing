import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (connectionString) {
      const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
      pool = new Pool({
        connectionString,
        ssl: isLocalhost ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      const host = process.env.DB_HOST || 'localhost';
      const port = Number(process.env.DB_PORT) || 5432;
      const user = process.env.DB_USER || 'postgres';
      const password = process.env.DB_PASSWORD || '';
      const database = process.env.DB_NAME || 'auricvista_farming';

      if (!password) {
        throw new Error(
          'Database configuration error: DATABASE_URL or DB_PASSWORD is required in environment variables.'
        );
      }

      pool = new Pool({
        host,
        port,
        user,
        password,
        database,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    }

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }

  return pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  const p = getPool();
  const start = Date.now();
  try {
    const res = await p.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && duration > 500) {
      console.warn(`[Slow Query] ${text} took ${duration}ms`);
    }
    return res;
  } catch (err: any) {
    console.error(`[Database Query Error] ${err.message} | Query: ${text}`);
    throw err;
  }
}

export async function getClient(): Promise<pg.PoolClient> {
  const p = getPool();
  return await p.connect();
}

export async function checkDbHealth(): Promise<{ ok: boolean; message: string; version?: string }> {
  try {
    const res = await query<{ version: string }>('SELECT version();');
    return {
      ok: true,
      message: 'PostgreSQL connection healthy',
      version: res.rows[0]?.version,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err.message || 'Failed to connect to PostgreSQL',
    };
  }
}
