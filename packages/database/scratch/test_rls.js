
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://angthjyayhrbexeaeoqm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZ3RoanlheWhyYmV4ZWFlb3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODM0MDksImV4cCI6MjA5MjM1OTQwOX0.IaOwrqBBbfSaziy3JFnaN9352dA8tSIurVeourznrdU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testQuery() {
  const email = 'admin_audit@saidonclub.com'
  
  // Login to get a session
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: 'SaidonClub2026+'
  })
  
  if (authError) {
    console.error('Auth Error:', authError.message)
    return
  }
  
  console.log('Logged in successfully.', authData.user.email)
  
  // Try querying users table with the authenticated session
  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .select('id, role, status')
    .eq('email', authData.user.email)
    .single()
    
  if (dbError) {
    console.error('DB Query Error:', dbError.message, dbError.details, dbError.hint)
  } else {
    console.log('DB User:', dbUser)
  }
}

testQuery()
