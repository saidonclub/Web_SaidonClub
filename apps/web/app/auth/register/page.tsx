'use client'

import { useActionState, useState, Suspense } from 'react'
import { register } from './actions'
import { User, Mail, KeyRound, Gift, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Register.module.css'
import { useSearchParams } from 'next/navigation'

function RegisterContent() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const refParam = searchParams.get('ref')
  
  // Usamos useActionState para manejar el estado del formulario y errores sin recargar página
  // Nota: register es una Server Action
  const [state, formAction, isPending] = useActionState(register, null)
  
  // Estado local para los campos (opcional, pero ayuda a la persistencia manual si se desea)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    affiliateCode: refParam ?? ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/logotipo.png" 
              alt="Logotipo SaidonClub" 
              width={220} 
              height={60} 
              priority
              className={styles.logoImage}
            />
          </div>
          <h1 className={styles.title}>Únete a SaidonClub</h1>
          <p className={styles.version}>Crea tu cuenta y comienza tu red</p>
        </div>

        {(state?.error || errorParam) && (
          <div className={styles.errorAlert}>
            {state?.error || errorParam}
          </div>
        )}

        <form action={formAction} className={styles.form}>
          <div className={styles.inputWrapper}>
            <User className={styles.inputIcon} size={20} />
            <input
              name="name"
              type="text"
              placeholder="Nombre completo"
              required
              autoComplete="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
              autoComplete="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <KeyRound className={styles.inputIcon} size={20} />
            <input
              name="password"
              type="password"
              placeholder="Contraseña (mín. 8 caracteres)"
              required
              autoComplete="new-password"
              minLength={8}
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <KeyRound className={styles.inputIcon} size={20} />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              required
              autoComplete="new-password"
              className={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Gift className={styles.inputIcon} size={20} />
            <input
              name="affiliateCode"
              type="text"
              placeholder="Código de referido (opcional)"
              className={styles.input}
              style={{ textTransform: 'uppercase' }}
              value={formData.affiliateCode}
              onChange={handleChange}
            />
          </div>

          <div className={styles.termsRow}>
            <input type="checkbox" id="terms" required className={styles.checkbox} />
            <label htmlFor="terms" className={styles.termsLabel}>
              Acepto los{' '}
              <a href="/terminos" className={styles.termsLink} target="_blank">
                Términos y Condiciones
              </a>{' '}
              y la{' '}
              <a href="/privacidad" className={styles.termsLink} target="_blank">
                Política de Privacidad
              </a>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 size={18} className={styles.spin} />
                Procesando...
              </>
            ) : (
              <>
                Crear Cuenta
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className={styles.footerLink}>
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader2 size={32} className={styles.spin} />
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
