import React from 'react';
import styles from './Servicios.module.css';
import { ServiceGridSkeleton, Skeleton, BreadcrumbSkeleton } from '@/components/shared/Skeleton';

export default function Loading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerDecor}>
          <div className={styles.decorCircle1} />
          <div className={styles.decorCircle2} />
        </div>
        <div className={styles.headerContent}>
          <Skeleton width={40} height={40} borderRadius={8} style={{ marginBottom: '1rem' }} />
          <div>
            <Skeleton width="30%" height={32} style={{ marginBottom: '1rem' }} />
            <Skeleton width="50%" height={20} />
          </div>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.navColumn}>
          <div className={styles.navHeader}>
            <BreadcrumbSkeleton />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
            <Skeleton height={24} width="50%" />
            {[1,2,3].map(i => <Skeleton key={i} height={40} />)}
            <Skeleton height={20} width="40%" style={{ marginTop: '1rem' }} />
            <Skeleton height={150} />
          </div>
        </div>

        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <Skeleton width={180} height={28} />
            <Skeleton width={150} height={40} />
          </div>

          <ServiceGridSkeleton count={6} />
        </section>
      </div>
    </div>
  );
}