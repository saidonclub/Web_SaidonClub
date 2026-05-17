"use client";

import React from "react";
import styles from "./Productos.module.css";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className={`${styles.container} section-bg-products`}>
      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin text-saidon-orange" size={48} />
            <h2>Cargando productos...</h2>
            <p>Preparando los mejores precios exclusivos para ti.</p>
          </div>
        </div>
      </header>
      <div className={styles.main}>
        <div className={styles.navColumn}>
          {/* Skeleton for sidebar */}
          <div style={{ height: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', opacity: 0.5, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </div>
        <section className={styles.content}>
          <div className={styles.grid}>
            {/* Skeleton for products */}
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ height: '350px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', opacity: 0.5, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
