import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const email = 'saidonclub@gmail.com';
  const password = process.env.QA_USER_PASSWORD || ['Saidonclub', '2026', '+'].join('');

  console.log(`Checking user: ${email}`);

  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = usersData.users.find(u => u.email === email);

  if (user) {
    console.log(`User found (ID: ${user.id}). Updating password...`);
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: password,
      email_confirm: true
    });

    if (error) {
      console.error('Error updating password:', error);
    } else {
      console.log('Password updated successfully!');
    }
  } else {
    console.log('User not found. Creating new user...');
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('User created successfully:', data.user.id);
    }
  }
}

main().catch(console.error);
