'use client'

import React from 'react'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
  style
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        ...style
      }}
    />
  )
}

// Skeleton para tarjeta de producto
export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <Skeleton height={200} className={styles.productImage} />
      <div className={styles.productContent}>
        <Skeleton height={16} width="60%" />
        <Skeleton height={14} width="40%" />
        <Skeleton height={24} width="80%" />
        <div className={styles.productFooter}>
          <Skeleton height={32} width="45%" />
          <Skeleton height={32} width="45%" />
        </div>
      </div>
    </div>
  )
}

// Skeleton para tarjeta de servicio
export function ServiceCardSkeleton() {
  return (
    <div className={styles.serviceCard}>
      <Skeleton height={120} className={styles.serviceImage} />
      <div className={styles.serviceContent}>
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} width="50%" />
        <div style={{ display: 'flex', gap: '4px', margin: '4px 0' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width={10} height={10} borderRadius="50%" />
          ))}
          <Skeleton width={30} height={10} />
        </div>
        <Skeleton height={40} />
        <div className={styles.serviceFooter}>
          <Skeleton height={36} width="100%" />
        </div>
      </div>
    </div>
  )
}

// Skeleton para página de productos
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton para página de servicios
export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton para detalle de producto
export function ProductDetailSkeleton() {
  return (
    <div className={styles.productDetail}>
      <div className={styles.productDetailGallery}>
        <Skeleton height={400} borderRadius={12} />
        <div className={styles.thumbnails}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={60} width={60} borderRadius={8} />
          ))}
        </div>
      </div>
      <div className={styles.productDetailInfo}>
        <Skeleton height={32} width="80%" />
        <Skeleton height={20} width="40%" />
        <Skeleton height={48} width="60%" />
        <div className={styles.productDetailPrice}>
          <Skeleton height={40} width="30%" />
        </div>
        <Skeleton height={120} />
        <div className={styles.productDetailActions}>
          <Skeleton height={48} width="45%" />
          <Skeleton height={48} width="45%" />
        </div>
      </div>
    </div>
  )
}

// Skeleton para formulario
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className={styles.form}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className={styles.formField}>
          <Skeleton height={16} width="30%" />
          <Skeleton height={44} />
        </div>
      ))}
      <Skeleton height={48} width="100%" />
    </div>
  )
}

// Skeleton para dashboard
export function DashboardSkeleton() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.statCard}>
            <Skeleton height={24} width="40%" />
            <Skeleton height={36} width="60%" />
            <Skeleton height={14} width="80%" />
          </div>
        ))}
      </div>
      <div className={styles.dashboardContent}>
        <Skeleton height={300} />
      </div>
    </div>
  )
}

// Skeleton para carousel/hero
export function HeroSkeleton() {
  return (
    <div className={styles.hero}>
      <Skeleton height={400} borderRadius={16} />
    </div>
  )
}

// Skeleton para lista
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className={styles.list}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={styles.listItem}>
          <Skeleton height={50} width={50} borderRadius="50%" />
          <div className={styles.listItemContent}>
            <Skeleton height={16} width="60%" />
            <Skeleton height={14} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton para breadcrumb
export function BreadcrumbSkeleton() {
  return (
    <div className={styles.breadcrumb}>
      {Array.from({ length: 3 }).map((_, i) => (
        <React.Fragment key={i}>
          <Skeleton height={14} width={60} />
          <Skeleton height={14} width={20} />
        </React.Fragment>
      ))}
    </div>
  )
}

// Skeleton genérico para页
export function PageSkeleton() {
  return (
    <div className={styles.page}>
      <BreadcrumbSkeleton />
      <HeroSkeleton />
      <ProductGridSkeleton count={8} />
    </div>
  )
}