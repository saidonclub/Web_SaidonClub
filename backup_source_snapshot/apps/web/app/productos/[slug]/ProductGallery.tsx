"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ProductDetail.module.css";
import { PlayCircle } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  videos?: string[];
  productName: string;
  discount?: number;
}

export default function ProductGallery({
  images,
  videos = [],
  productName,
  discount,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

  const galleryImages = images.length > 0 ? images : [fallbackImage];

  const openLightbox = () => {
    if (!isVideoActive) setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);

  const handleThumbnailClick = (index: number, isVideo: boolean) => {
    setActiveIndex(index);
    setIsVideoActive(isVideo);
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <>
      <div className={styles.imageSection}>
        <div className={styles.mainImageWrapper} onClick={openLightbox}>
          {isVideoActive && videos[activeIndex] ? (
            <div className={styles.videoWrapper}>
              {getYoutubeId(videos[activeIndex]) ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYoutubeId(videos[activeIndex])}?autoplay=0`}
                  title="Product Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={videos[activeIndex]} controls className={styles.videoPlayer} />
              )}
            </div>
          ) : (
            <Image
              src={galleryImages[activeIndex] || fallbackImage}
              alt={productName}
              fill
              style={{ objectFit: "contain" }}
              className={styles.mainImage}
              priority
            />
          )}
          
          {discount && discount > 0 ? (
            <div className={styles.detailBadge}>-{discount}% Club</div>
          ) : null}
        </div>

        {(galleryImages.length > 1 || videos.length > 0) && (
          <div className={styles.thumbnailGrid}>
            {/* Image Thumbnails */}
            {galleryImages.map((img, i) => (
              <button
                key={`img-${i}`}
                className={`${styles.thumbnail} ${
                  !isVideoActive && activeIndex === i ? styles.activeThumbnail : ""
                }`}
                onClick={() => handleThumbnailClick(i, false)}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
            
            {/* Video Thumbnails */}
            {videos.map((_vid, i) => (
              <button
                key={`vid-${i}`}
                className={`${styles.thumbnail} ${styles.videoThumbnail} ${
                  isVideoActive && activeIndex === i ? styles.activeThumbnail : ""
                }`}
                onClick={() => handleThumbnailClick(i, true)}
                aria-label={`Ver video ${i + 1}`}
              >
                <div className={styles.videoIconOverlay}>
                  <PlayCircle size={24} color="white" />
                </div>
                {/* Fallback thumbnail for video if no specific thumbnail provided */}
                <Image
                  src={galleryImages[0] || fallbackImage}
                  alt={`${productName} video thumbnail ${i + 1}`}
                  fill
                  style={{ objectFit: "cover", opacity: 0.6 }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Overlay (Only for images) */}
      {!isVideoActive && (
        <div 
          className={`${styles.lightboxOverlay} ${isLightboxOpen ? styles.open : ""}`}
          onClick={closeLightbox}
        >
          <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close lightbox">
            ✕
          </button>
          
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[activeIndex] || fallbackImage}
              alt={productName}
              width={1600}
              height={1600}
              style={{ objectFit: "contain" }}
              className={styles.lightboxImage}
            />
          </div>
        </div>
      )}
    </>
  );
}
