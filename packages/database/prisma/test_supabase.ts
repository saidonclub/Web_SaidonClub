import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testSupabase() {
  console.log('Testing Supabase Auth Admin...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
  
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Success! Found', data.users.length, 'users.');
  }
}

testSupabase();
