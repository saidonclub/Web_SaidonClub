const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
let supabaseUrl = '';
let serviceKey = '';

for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    serviceKey = line.split('=')[1].trim();
  }
}

async function main() {
  const email = 'saidonclub@gmail.com';
  const password = process.env.QA_USER_PASSWORD || ['Saidonclub', '2026', '+'].join('');

  console.log(`Checking user: ${email}`);

  // Get users
  const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  });

  const listData = await listRes.json();
  const user = listData.users?.find(u => u.email === email);

  if (user) {
    console.log(`User found (ID: ${user.id}). Updating password...`);
    const updateRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password,
        email_confirm: true
      })
    });
    
    if (updateRes.ok) {
      console.log('Password updated successfully!');
    } else {
      console.log('Error updating:', await updateRes.text());
    }
  } else {
    console.log('User not found. Creating new user...');
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true
      })
    });

    if (createRes.ok) {
      const data = await createRes.json();
      console.log('User created successfully:', data.id);
    } else {
      console.log('Error creating:', await createRes.text());
    }
  }
}

main().catch(console.error);
