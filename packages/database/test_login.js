import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from the root of the project
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin(email, password) {
  console.log(`Testing login for ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error(`Login failed for ${email}:`, error.message);
  } else {
    console.log(`Login succeeded for ${email}! User ID: ${data.user.id}`);
  }
}

async function main() {
  await testLogin('pionero1@saidonclub.com', 'SaidonClub2026+');
  await testLogin('admin1@saidonclub.com', 'SaidonClub2026+');
}

main();
