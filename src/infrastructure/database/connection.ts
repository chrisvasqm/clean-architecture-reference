import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const connectionString =
  process.env.DATABASE_URL ??
  'postgres://postgres:postgrespassword@localhost:5432/products_db';

export const connectionPool = new pg.Pool({
  connectionString,
});

export const database: NodePgDatabase<typeof schema> = drizzle(connectionPool, {
  schema,
});
