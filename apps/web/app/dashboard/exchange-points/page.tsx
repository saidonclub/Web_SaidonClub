import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ExchangePointsPage from './ExchangePointsPage'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/auth/login')
  }

  return <ExchangePointsPage userId={user.id} userEmail={user.email} />
}
