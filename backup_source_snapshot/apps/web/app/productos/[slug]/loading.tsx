import React from 'react';
import styles from './ProductDetail.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      {/* Breadcrumb Skeleton */}
      <div className={`${styles.skeleton} ${styles.skeletonTextSmall}`} style={{ margin: '20px auto', width: '200px' }}></div>

      <div className={styles.mainContent}>
        {/* Gallery Skeleton */}
        <div className={styles.gallerySection}>
          <div className={`${styles.skeleton} ${styles.skeletonImage}`} style={{ aspectRatio: '1/1', borderRadius: '16px' }}></div>
          <div className={styles.thumbnails}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonImage}`} style={{ height: '80px', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className={styles.infoSection}>
          <div className={`${styles.skeleton} ${styles.skeletonTextSmall}`} style={{ width: '100px', marginBottom: '8px' }}></div>
          <div className={`${styles.skeleton} ${styles.skeletonTextLarge}`} style={{ height: '40px', width: '80%', marginBottom: '16px' }}></div>
          <div className={`${styles.skeleton} ${styles.skeletonTextSmall}`} style={{ width: '120px', marginBottom: '24px' }}></div>
          
          <div className={`${styles.skeleton}`} style={{ height: '80px', width: '100%', borderRadius: '16px', marginBottom: '32px' }}></div>
          
          <div className={`${styles.skeleton} ${styles.skeletonTextLarge}`} style={{ height: '100px', width: '100%', marginBottom: '24px' }}></div>
          
          <div className={`${styles.skeleton}`} style={{ height: '60px', width: '100%', borderRadius: '16px' }}></div>
        </div>
      </div>
    </div>
  );
}
