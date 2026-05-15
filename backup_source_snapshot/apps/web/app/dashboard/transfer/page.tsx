import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TransferPage from './TransferPage'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/auth/login')
  }

  return <TransferPage userEmail={user.email} />
}
