import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import WithdrawPage from './WithdrawPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retirar Fondos | SaidonClub',
  description: 'Retira tus ganancias de forma segura a tu cuenta bancaria.',
  robots: { index: false, follow: false },
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/auth/login')
  }

  // Obtener historial de retiros y balance disponible
  const [wallet, withdrawalHistory] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: user.id },
      select: { balanceAvailable: true, balancePending: true, totalEarned: true },
    }),
    prisma.walletTransaction.findMany({
      where: {
        wallet: { userId: user.id },
        type: 'WITHDRAWAL',
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        status: true,
        description: true,
        createdAt: true,
        metadata: true,
      },
    }),
  ])

  const walletData = {
    available: Number(wallet?.balanceAvailable ?? 0),
    pending: Number(wallet?.balancePending ?? 0),
    total: Number(wallet?.totalEarned ?? 0),
  }

  const history = withdrawalHistory.map((tx) => ({
    id: tx.id,
    amount: Math.abs(Number(tx.amount)),
    status: tx.status,
    description: tx.description ?? '',
    createdAt: tx.createdAt.toISOString(),
    metadata: tx.metadata as Record<string, string> | null,
  }))

  return <WithdrawPage userEmail={user.email} wallet={walletData} history={history} />
}
