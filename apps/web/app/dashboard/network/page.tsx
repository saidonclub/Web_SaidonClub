import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getFullNetworkData } from '@/lib/data/dashboard';
import { Users, Award, ArrowLeft, Info } from 'lucide-react';
import styles from './Network.module.css';
import CopyButton from './CopyButton';
import NetworkTree from './NetworkTree';

export default async function NetworkPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const networkData = await getFullNetworkData(user.id);
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://saidonclub.com'}/register?ref=${networkData.affiliateCode}`;

  return (
    <div data-section="mlm" className={`${styles.container} section-bg-mlm`}>
      <header className={styles.header}>
        <div className={styles.topActions}>
          <Link href="/dashboard" className={styles.backBtn}>
            <ArrowLeft size={16} />
            Volver al Panel
          </Link>
        </div>
        <div className={styles.headerTitle}>
          <Users size={32} color="var(--clr-orange)" />
          <h1>Mi Red de Socios</h1>
        </div>
        <p className={styles.subtitle}>Gestiona tu comunidad y monitorea el crecimiento de tu red en tiempo real.</p>
      </header>

      {/* Referral Link Card */}
      <section className={styles.referralCard}>
        <div className={styles.referralInfo}>
          <h2>Tu Enlace de Referido</h2>
          <p>Comparte este enlace para invitar a nuevos socios a tu red.</p>
        </div>
        <div className={styles.referralInputGroup}>
          <input 
            type="text" 
            readOnly 
            value={referralLink} 
            className={styles.referralInput} 
          />
          <CopyButton text={referralLink} />
        </div>
      </section>

      {/* Stats Summary */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{networkData.stats.totalDirects}</span>
          <span className={styles.statLabel}>Directos (N1)</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{networkData.stats.totalIndirects}</span>
          <span className={styles.statLabel}>Indirectos (N2)</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{networkData.stats.totalNetwork}</span>
          <span className={styles.statLabel}>Red Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>
            ${networkData.stats.totalEarnings.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Recompensas Totales</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Award size={20} color="var(--clr-orange)" />
              Mi Estructura de Red
            </h2>
            <div className={styles.cardActions}>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.activeDot}`} /> Activo
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.inactiveDot}`} /> Inactivo
              </span>
            </div>
          </div>
          
          <NetworkTree directs={networkData.directs} />
          
          <div className={styles.levelBonusNote}>
            <Info size={16} className={styles.infoIcon} />
            <p>
              <strong>Nota:</strong> El bono de cierre de nivel (35% de las comisiones del nivel) se distribuye cuando el nivel superior se activa.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
