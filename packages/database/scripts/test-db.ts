import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const sessionUrl = 'postgresql://postgres.angthjyayhrbexeaeoqm:Saidonclub2026%2B@aws-1-us-east-1.pooler.supabase.com:6543/postgres';
  console.log('Testing session connection to:', sessionUrl.replace(/:[^:@]+@/, ':****@'));
  const client = new Client({
    connectionString: sessionUrl,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('Successfully connected!');
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

test();
