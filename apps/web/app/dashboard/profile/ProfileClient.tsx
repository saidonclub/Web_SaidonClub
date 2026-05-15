"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Shield, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Fingerprint,
  Globe,
  Settings2,
  Trophy,
  ExternalLink,
  Lock,
} from "lucide-react";
import Image from "next/image";
import styles from "./Profile.module.css";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface ProfileUser {
  id: string;
  email: string;
  name: string;
  username: string;
  phone: string;
  avatar: string;
  role: string;
  twoFactorEnabled: boolean;
}

interface ProfileClientProps {
  initialUser: ProfileUser;
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev: ProfileUser) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "avatars");

    try {
      const response = await fetch("/api/upload/optimized", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir la imagen");

      const data = await response.json();
      setUser((prev: ProfileUser) => ({ ...prev, avatar: data.path }));
      
      // Auto-save the avatar change
      await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: data.path }),
      });

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          username: user.username,
          phone: user.phone,
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar el perfil");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      // Personalizamos el mensaje de éxito temporalmente
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al enviar el correo de recuperación";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <div className={styles.roleBadge}>{user.role}</div>
          <h1 className={styles.title}>Configuración de Perfil</h1>
          <p className={styles.subtitle}>Gestiona tu identidad digital y preferencias de seguridad.</p>
        </motion.div>

        <div className={styles.profileGrid}>
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.sidebar}
          >
            <div className={styles.card}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} className={styles.avatar} width={120} height={120} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <User size={60} />
                    </div>
                  )}
                  <div className={styles.uploadOverlay}>
                    {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    hidden 
                  />
                </div>
                <div>
                  <h3>{user.name || user.username}</h3>
                  <p className={styles.subtitle}>{user.email}</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: '16px' }}>
                <Fingerprint size={18} className="text-orange" /> Identidad & KYC
              </h4>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <span className={styles.securityLabel}>Estatus de Verificación</span>
                  <span className={styles.securityDesc}>Nivel 1: Básico</span>
                </div>
                <div className={`${styles.statusPill} ${styles.statusActive}`}>
                  Verificado
                </div>
              </div>
              <p className={styles.kycNotice}>
                Sube tu documento de identidad para desbloquear retiros ilimitados.
              </p>
              <button className={styles.btnSecondary} style={{ width: '100%', marginTop: '12px' }}>
                Subir Documentos
              </button>
            </div>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: '16px' }}>
                <Trophy size={18} className="text-orange" /> Ecosistema MLM
              </h4>
              <div className={styles.mlmIdentity}>
                <div className={styles.mlmField}>
                  <label>Código de Afiliado</label>
                  <code>{user.username?.toUpperCase() || 'SAIDON_USER'}</code>
                </div>
                <div className={styles.mlmField}>
                  <label>Tu Tienda Personal</label>
                  <a href={`/shop/${user.username}`} target="_blank" className={styles.shopLink}>
                    saidonclub.com/shop/{user.username} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Form */}
          <motion.main 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.mainContent}
          >
            <form onSubmit={handleSubmit} className={styles.card}>
              <h4 className={styles.sectionTitle}>
                <User size={20} className="text-orange" /> Información Personal
              </h4>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={user.name || ''} 
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Ej. John Doe"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre de Usuario</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={user.username || ''} 
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="johndoe123"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className={styles.input}
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Teléfono / WhatsApp</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={user.phone || ''} 
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="+57 300..."
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-success"
                    >
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-bold">Cambios guardados</span>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-error"
                    >
                      <AlertCircle size={18} />
                      <span className="text-sm font-bold">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={styles.btnSave}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save size={18} /> Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>
                <Lock size={20} className="text-orange" /> Privilegios de Acceso
              </h4>
              <div className={styles.privilegesGrid}>
                <div className={styles.privilegeItem}>
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Acceso a Tienda Global</span>
                </div>
                <div className={styles.privilegeItem}>
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Retiros de Billetera</span>
                </div>
                <div className={styles.privilegeItem}>
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Gestión de Referidos</span>
                </div>
                {user.role === 'SUPER_ADMIN' && (
                  <div className={styles.privilegeItem}>
                    <Shield size={16} className="text-orange" />
                    <span>Control Maestro de Sistema</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>
                <Key size={20} className="text-orange" /> Seguridad de la Cuenta
              </h4>
              <p className={styles.subtitle} style={{ marginBottom: '20px' }}>
                Recomendamos cambiar tu contraseña periódicamente para mantener tu cuenta segura.
              </p>
              <div className={styles.securityActions}>
                <button 
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className={styles.btnSecondary} 
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Solicitar Cambio de Contraseña"}
                </button>
                
                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <span className={styles.securityLabel}>Autenticación 2FA</span>
                    <span className={styles.securityDesc}>Protege tu cuenta con un código extra.</span>
                  </div>
                  <div className={`${styles.statusPill} ${user.twoFactorEnabled ? styles.statusActive : ''}`}>
                    {user.twoFactorEnabled ? 'Activado' : 'Inactivo'}
                  </div>
                </div>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
