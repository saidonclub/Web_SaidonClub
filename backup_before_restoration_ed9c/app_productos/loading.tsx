import React from 'react';
import styles from './Productos.module.css';
import { ProductGridSkeleton, Skeleton, BreadcrumbSkeleton } from '@/components/shared/Skeleton';

export default function Loading() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerDecor}>
          <div className={styles.decorCircle1} />
          <div className={styles.decorCircle2} />
          <div className={styles.decorGrid} />
        </div>
        <div className={styles.headerContent}>
          <div className={styles.headerMeta}>
            <Skeleton width={40} height={40} borderRadius={8} />
            <div className={styles.headerStacks}>
              <Skeleton width={100} height={14} />
              <Skeleton width={100} height={14} />
            </div>
          </div>
          <div>
            <Skeleton width="40%" height={32} style={{ marginBottom: '1rem' }} />
            <Skeleton width="60%" height={20} />
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
            {[1,2,3,4,5].map(i => <Skeleton key={i} height={40} />)}
          </div>
        </div>

        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <Skeleton width={200} height={28} />
            <Skeleton width={150} height={40} />
          </div>

          <ProductGridSkeleton count={8} />
        </section>
      </div>
    </div>
  );
}
