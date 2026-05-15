"use client";

import React, { useMemo } from 'react';
import styles from './HeroBanner.module.css';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  categoryName?: string;
  categorySlug?: string;
  variant?: 'orange' | 'obsidian' | 'glass' | 'cyber' | 'luxury' | 'nature';
  bgImage?: string;
  bgVideo?: string;
  compact?: boolean;
}

export default function HeroBanner({ 
  title, 
  subtitle, 
  categoryName,
  categorySlug,
  variant,
  bgImage,
  bgVideo,
  compact = false
}: HeroBannerProps) {
  // Determine variant based on slug if not explicitly provided
  const activeVariant = useMemo(() => {
    if (variant) return variant;
    
    switch (categorySlug) {
      case 'tecnologia': return 'cyber';
      case 'moda': 
      case 'joyeria': return 'luxury';
      case 'hogar': 
      case 'electrodomesticos': return 'nature';
      case 'marketing':
      case 'consultoria': 
      case 'educacion': return 'obsidian';
      case 'diseno':
      case 'deportes': return 'orange';
      case 'salud':
      case 'salud-y-belleza': return 'glass';
      default: return 'obsidian';
    }
  }, [variant, categorySlug]);

  // Generate random properties for particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 20}s`,
      size: `${1 + Math.random() * 3}px`,
      opacity: 0.1 + Math.random() * 0.4
    }));
  }, []);

  return (
    <section 
      className={`${styles.hero} ${styles[activeVariant]} ${compact ? styles.compact : ''}`}
      aria-labelledby="hero-title"
    >
      {/* Media Layer */}
      {bgVideo && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.bgVideo}
          src={bgVideo}
          aria-hidden="true"
        />
      )}
      {!bgVideo && bgImage && (
        <div 
          className={styles.bgImage} 
          style={{ backgroundImage: `url(${bgImage})` }}
          role="img"
          aria-label={`${title} background`}
        />
      )}
      
      {/* Dynamic Background Layers */}
      <div className={styles.animatedBg}>
        <div className={styles.mesh}></div>
        <div className={styles.liquidGlow}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
          <div className={styles.blob3}></div>
        </div>
        
        {/* Floating Particles */}
        <div className={styles.particles}>
          {particles.map(p => (
            <div 
              key={p.id}
              className={styles.particle}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
                opacity: p.opacity
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content Layer */}
      <div className={styles.content}>
        {categoryName && (
          <div className={styles.badgeWrapper}>
            <span className={styles.categoryBadge}>{categoryName}</span>
          </div>
        )}
        <h1 id="hero-title" className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* Scroll Indicator */}
      {!compact && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
        </div>
      )}
    </section>
  );
}
