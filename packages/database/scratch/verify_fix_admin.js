
const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('@prisma/client')

const supabaseUrl = 'https://angthjyayhrbexeaeoqm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZ3RoanlheWhyYmV4ZWFlb3FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4MzQwOSwiZXhwIjoyMDkyMzU5NDA5fQ.WteImbplhNfZ1S3HVsPu6NWpGuzQtcdpjixWXr203zs'

const supabase = createClient(supabaseUrl, supabaseKey)
const prisma = new PrismaClient()

async function verifyAuditUser() {
  const email = 'admin_audit@saidonclub.com'
  console.log(`Verifying user: ${email}...`)
  
  try {
    // 1. Check Supabase Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) throw authError
    
    const authUser = users.find(u => u.email === email)
    if (!authUser) {
      console.log('User NOT found in Supabase Auth.')
      // Create it if missing
      console.log('Creating user in Supabase Auth...')
      const { data: newData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: 'SaidonClub2026+',
        email_confirm: true,
        user_metadata: { name: 'Admin Audit' }
      })
      if (createError) throw createError
      console.log('User created in Supabase Auth.')
    } else {
      console.log(`User found in Supabase Auth. ID: ${authUser.id}`)
      // Update password just in case
      await supabase.auth.admin.updateUserById(authUser.id, { password: 'SaidonClub2026+' })
      console.log('Password updated to SaidonClub2026+')
    }

    const userId = authUser?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email).id

    // 2. Check Prisma DB
    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!dbUser) {
      console.log('User NOT found in Prisma DB. Creating...')
      await prisma.user.create({
        data: {
          id: userId,
          email,
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          name: 'Admin Audit'
        }
      })
      console.log('User created in Prisma DB as SUPER_ADMIN.')
    } else {
      console.log(`User found in Prisma DB. Role: ${dbUser.role}, Status: ${dbUser.status}`)
      if (dbUser.role !== 'SUPER_ADMIN' || dbUser.status !== 'ACTIVE') {
        await prisma.user.update({
          where: { id: userId },
          data: { role: 'SUPER_ADMIN', status: 'ACTIVE' }
        })
        console.log('Updated user to SUPER_ADMIN and ACTIVE.')
      }
    }
    
    // 3. Check Wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    })
    if (!wallet) {
      console.log('Creating wallet...')
      await prisma.wallet.create({
        data: { userId, balance: 1000000 } // Big balance for testing
      })
      console.log('Wallet created.')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAuditUser()
