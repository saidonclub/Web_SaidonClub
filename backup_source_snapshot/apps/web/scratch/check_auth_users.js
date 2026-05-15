
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAuthUsers() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) throw error
    
    console.log('--- Supabase Auth Users ---')
    users.forEach(u => {
      console.log(`Email: ${u.email} | ID: ${u.id}`)
    })
  } catch (error) {
    console.error('Error fetching auth users:', error)
  }
}

checkAuthUsers()
