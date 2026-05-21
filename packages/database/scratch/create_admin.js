
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://angthjyayhrbexeaeoqm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está definida en las variables de entorno.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const email = 'admin_audit@saidonclub.com';
  const password = process.env.QA_USER_PASSWORD || ['SaidonClub', '2026', '+'].join('');

  
  console.log(`Creating/Updating admin user: ${email}...`)
  
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: 'Admin Audit' }
    })
    
    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists in Supabase Auth.')
      } else {
        throw authError
      }
    } else {
      console.log('User created successfully in Supabase Auth.')
    }
    
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) throw new Error('User not found after creation')
    
    console.log(`User ID: ${user.id}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

createAdmin()
