'use client'

import React, { use, useEffect, useState } from 'react'
import PinVerification from '@/components/security/PinVerification'
import { verifyPinAction, resendPinAction } from './actions'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const params = use(searchParams)
  const router = useRouter()
  const [targetEmail, setTargetEmail] = useState<string | null>(params.email || null)
  const [isChecking, setIsChecking] = useState(!params.email)

  useEffect(() => {
    async function checkUser() {
      if (!params.email) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setTargetEmail(user.email)
        } else {
          router.push('/auth/login')
        }
      }
      setIsChecking(false)
    }
    checkUser()
  }, [params.email, router])

  if (isChecking || !targetEmail) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0A',
        color: 'white'
      }}>
        Cargando...
      </div>
    )
  }

  const handleVerify = async (pin: string) => {
    return await verifyPinAction(targetEmail, pin)
  }

  const handleResend = async () => {
    await resendPinAction(targetEmail)
  }

  const handleSuccess = () => {
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0A',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0A0A0A 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <PinVerification 
        email={targetEmail}
        type="AUTH"
        onVerify={handleVerify}
        onSuccess={handleSuccess}
        onResend={handleResend}
      />
    </div>
  )
}
