"use client";

import React from 'react';
import styles from './Servicios.module.css';
import { ServiceGridSkeleton, Skeleton, BreadcrumbSkeleton } from '@/components/shared/Skeleton';

export default function Loading() {
  return (
    <div className={styles.container} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Cyber-Grid Background Effect */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(var(--clr-orange-rgb), 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--clr-orange-rgb), 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse at top center, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at top center, black 0%, transparent 80%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      
      {/* Glow Effect */}
      <div 
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(var(--clr-orange-rgb), 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <header className={styles.header} style={{ position: 'relative', zIndex: 1, background: 'transparent' }}>
        <div className={styles.headerDecor}>
          <div className={styles.decorCircle1} />
          <div className={styles.decorCircle2} />
        </div>
        <div className={styles.headerContent}>
          <Skeleton width={48} height={48} borderRadius={12} style={{ marginBottom: '1.5rem', background: 'var(--clr-orange-dim)' }} />
          <div>
            <Skeleton width="30%" height={36} style={{ marginBottom: '1rem', background: 'var(--clr-border-subtle)' }} />
            <Skeleton width="50%" height={24} style={{ background: 'var(--clr-border-subtle)' }} />
          </div>
        </div>
      </header>

      <div className={styles.main} style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.navColumn}>
          <div className={styles.navHeader} style={{ background: 'rgba(var(--clr-obsidian-900-rgb), 0.6)', backdropFilter: 'blur(10px)', border: '1px solid var(--clr-border-subtle)', borderRadius: '16px 16px 0 0' }}>
            <BreadcrumbSkeleton />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', background: 'rgba(var(--clr-obsidian-900-rgb), 0.6)', backdropFilter: 'blur(10px)', border: '1px solid var(--clr-border-subtle)', borderTop: 'none', borderRadius: '0 0 16px 16px' }}>
            <Skeleton height={24} width="50%" />
            {[1,2,3].map(i => <Skeleton key={i} height={40} style={{ borderRadius: '8px' }} />)}
            <Skeleton height={20} width="40%" style={{ marginTop: '1rem' }} />
            <Skeleton height={150} style={{ borderRadius: '12px' }} />
          </div>
        </div>

        <section className={styles.content}>
          <div className={styles.contentHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <Skeleton width={200} height={32} />
            <Skeleton width={160} height={44} borderRadius={12} />
          </div>

          <ServiceGridSkeleton count={6} />
        </section>
      </div>
    </div>
  );
}