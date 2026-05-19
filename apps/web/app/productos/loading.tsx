"use client";

import React from "react";
import styles from "./Productos.module.css";
import { Loader2 } from "lucide-react";
import { ProductGridSkeleton, Skeleton } from '@/components/shared/Skeleton';

export default function Loading() {
  return (
    <div className={`${styles.container} section-bg-products`} style={{ position: 'relative', overflow: 'hidden' }}>
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

      <header className={styles.header} style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <Loader2 className="animate-spin" size={56} style={{ color: 'var(--clr-orange)', filter: 'drop-shadow(0 0 10px rgba(var(--clr-orange-rgb), 0.5))' }} />
            <h2 style={{ color: 'var(--clr-text-primary)', fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Cargando productos...</h2>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '1.125rem' }}>Preparando los mejores precios exclusivos para ti.</p>
          </div>
        </div>
      </header>
      
      <div className={styles.main} style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.navColumn}>
          {/* Skeleton for sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1.5rem', background: 'rgba(var(--clr-obsidian-900-rgb), 0.6)', borderRadius: '16px', border: '1px solid var(--clr-border-subtle)', backdropFilter: 'blur(10px)' }}>
             <Skeleton height={24} width="70%" />
             <Skeleton height={16} width="100%" />
             <Skeleton height={16} width="90%" />
             <Skeleton height={16} width="95%" />
             <Skeleton height={16} width="80%" />
             <Skeleton height={40} width="100%" style={{ marginTop: '1rem' }} />
          </div>
        </div>
        <section className={styles.content}>
          <ProductGridSkeleton count={8} />
        </section>
      </div>
    </div>
  );
}
