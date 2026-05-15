import { requestPasswordReset } from './actions'
import { Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ForgotPassword.module.css'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

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
          <h1 className={styles.title}>Recuperar Contraseña</h1>
          <p className={styles.subtitle}>
            Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>

        {error && (
          <div className={styles.errorAlert}>{error}</div>
        )}

        {message ? (
          <div className={styles.successAlert}>
            <p>{message}</p>
            <Link href="/auth/login" className={styles.backLink}>
              ← Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form action={requestPasswordReset} className={styles.form}>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                required
                autoComplete="email"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Enviar instrucciones
              <ArrowRight size={18} />
            </button>

            <Link href="/auth/login" className={styles.cancelLink}>
              ← Volver al inicio de sesión
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
