
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://angthjyayhrbexeaeoqm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZ3RoanlheWhyYmV4ZWFlb3FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4MzQwOSwiZXhwIjoyMDkyMzU5NDA5fQ.WteImbplhNfZ1S3HVsPu6NWpGuzQtcdpjixWXr203zs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const email = 'admin_audit@saidonclub.com'
  const password = 'SaidonClub2026+'
  
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
