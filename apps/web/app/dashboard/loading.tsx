'use client';

import React from 'react';
import { Skeleton, DashboardSkeleton, ListSkeleton } from '@/components/shared/Skeleton';

export default function Loading() {
  return (
    <div 
      style={{ 
        padding: '2rem', 
        maxWidth: '1280px', 
        margin: '0 auto',
        minHeight: '80vh',
        position: 'relative'
      }}
    >
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <Skeleton 
            width={280} 
            height={36} 
            style={{ 
              marginBottom: '0.75rem',
              background: 'linear-gradient(90deg, rgba(var(--clr-white-rgb),0.05) 25%, rgba(var(--clr-orange-rgb),0.1) 50%, rgba(var(--clr-white-rgb),0.05) 75%)'
            }} 
          />
          <Skeleton 
            width={480} 
            height={16} 
            style={{
              background: 'linear-gradient(90deg, rgba(var(--clr-white-rgb),0.03) 25%, rgba(var(--clr-orange-rgb),0.05) 50%, rgba(var(--clr-white-rgb),0.03) 75%)'
            }}
          />
        </div>

        <div style={{ opacity: 0.8 }}>
          <DashboardSkeleton />
        </div>

        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          <div 
            style={{ 
              background: 'rgba(var(--clr-obsidian-900-rgb), 0.6)', 
              borderRadius: '16px', 
              padding: '1.5rem',
              border: '1px solid var(--clr-border-subtle)',
              boxShadow: 'var(--shadow-card)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Skeleton width={140} height={24} style={{ marginBottom: '1.5rem', background: 'var(--clr-border-subtle)' }} />
            <ListSkeleton items={4} />
          </div>
          
          <div 
            style={{ 
              background: 'rgba(var(--clr-obsidian-900-rgb), 0.6)', 
              borderRadius: '16px', 
              padding: '1.5rem',
              border: '1px solid var(--clr-border-subtle)',
              boxShadow: 'var(--shadow-card)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Skeleton width={140} height={24} style={{ marginBottom: '1.5rem', background: 'var(--clr-border-subtle)' }} />
            <ListSkeleton items={4} />
          </div>
        </div>
      </div>
    </div>
  );
}