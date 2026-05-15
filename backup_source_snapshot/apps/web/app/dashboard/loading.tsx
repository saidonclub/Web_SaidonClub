'use client';

import React from 'react';
import { Skeleton, DashboardSkeleton, ListSkeleton } from '@/components/shared/Skeleton';

export default function Loading() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Skeleton width={200} height={32} style={{ marginBottom: '0.5rem' }} />
        <Skeleton width={400} height={16} />
      </div>

      <DashboardSkeleton />

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', padding: '1.5rem' }}>
          <Skeleton width={120} height={20} style={{ marginBottom: '1rem' }} />
          <ListSkeleton items={5} />
        </div>
        <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', padding: '1.5rem' }}>
          <Skeleton width={120} height={20} style={{ marginBottom: '1rem' }} />
          <ListSkeleton items={5} />
        </div>
      </div>
    </div>
  );
}