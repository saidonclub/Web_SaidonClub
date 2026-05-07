import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function cleanPublicSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // List all tables in public schema
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    const tables = res.rows.map(r => r.table_name);
    console.log('Current tables in public:', tables);

    // Drop all tables in public schema (CAUTION!)
    for (const table of tables) {
      console.log(`Dropping table: ${table}`);
      await client.query(`DROP TABLE IF EXISTS "public"."${table}" CASCADE`);
    }

    console.log('Public schema cleaned');
  } catch (err) {
    console.error('Error cleaning schema:', err);
  } finally {
    await client.end();
  }
}

cleanPublicSchema();
