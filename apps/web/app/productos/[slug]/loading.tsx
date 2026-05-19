"use client";

import React from 'react';
import styles from './ProductDetail.module.css';
import { ProductDetailSkeleton, BreadcrumbSkeleton } from '@/components/shared/Skeleton';

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

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '2rem' }}>
        <div style={{ marginBottom: '2rem', padding: '0 1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <BreadcrumbSkeleton />
        </div>

        <div className={styles.mainContent}>
          <ProductDetailSkeleton />
        </div>
      </div>
    </div>
  );
}
