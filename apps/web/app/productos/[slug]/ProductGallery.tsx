"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import styles from "./ProductDetail.module.css";
import { PlayCircle, X, Maximize2 } from "lucide-react";

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

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const handleThumbnailClick = (index: number, isVideo: boolean) => {
    setActiveIndex(index);
    setIsVideoActive(isVideo);
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderVideoPlayer = (url: string, autoPlay = false) => {
    const youtubeId = getYoutubeId(url);
    if (youtubeId) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
          title="Product Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.videoPlayer}
        ></iframe>
      );
    }
    return (
      <video 
        src={url} 
        controls 
        autoPlay={autoPlay}
        className={styles.videoPlayer} 
        playsInline
      />
    );
  };

  return (
    <>
      <div className={styles.imageSection}>
        <div className={styles.mainImageWrapper}>
          {isVideoActive && videos[activeIndex] ? (
            <div className={styles.videoWrapper}>
              {renderVideoPlayer(videos[activeIndex])}
              <button 
                className={styles.expandBtn} 
                onClick={openLightbox}
                title="Ampliar video"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          ) : (
            <div className={styles.imageClickArea} onClick={openLightbox}>
              <Image
                src={galleryImages[activeIndex] || fallbackImage}
                alt={productName}
                fill
                style={{ objectFit: "contain" }}
                className={styles.mainImage}
                priority
              />
            </div>
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
            {videos.map((vid, i) => (
              <button
                key={`vid-${i}`}
                className={`${styles.thumbnail} ${styles.videoThumbnail} ${
                  isVideoActive && activeIndex === i ? styles.activeThumbnail : ""
                }`}
                onClick={() => handleThumbnailClick(i, true)}
                aria-label={`Ver video ${i + 1}`}
              >
                <div className={styles.videoIconOverlay}>
                  <PlayCircle size={24} color="var(--clr-primary)" />
                </div>
                {/* For video thumbnails, we use the first image as cover with lower opacity */}
                <Image
                  src={galleryImages[0] || fallbackImage}
                  alt={`${productName} video thumbnail ${i + 1}`}
                  fill
                  style={{ objectFit: "cover", opacity: 0.4 }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Overlay (Supports both Images and Videos) */}
      <div
        className={`${styles.lightboxOverlay} ${isLightboxOpen ? styles.open : ""}`}
        onClick={closeLightbox}
      >
        <button
          className={styles.lightboxClose}
          onClick={closeLightbox}
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
          {isVideoActive && videos[activeIndex] ? (
            <div className={styles.lightboxVideoContainer}>
              {renderVideoPlayer(videos[activeIndex], true)}
            </div>
          ) : (
            <Image
              src={galleryImages[activeIndex] || fallbackImage}
              alt={productName}
              width={1600}
              height={1600}
              style={{ objectFit: "contain" }}
              className={styles.lightboxImage}
            />
          )}
          
          <div className={styles.lightboxCaption}>
            {isVideoActive ? "Video Demostrativo" : `Imagen ${activeIndex + 1} de ${galleryImages.length}`}
          </div>
        </div>
      </div>

      <style jsx>{`
        .${styles.expandBtn} {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          transition: all 0.2s ease;
        }
        .${styles.expandBtn}:hover {
          background: var(--clr-primary);
          color: black;
          transform: scale(1.1);
        }
        .${styles.imageClickArea} {
          width: 100%;
          height: 100%;
          cursor: zoom-in;
        }
        .${styles.lightboxVideoContainer} {
          width: 80vw;
          aspect-ratio: 16 / 9;
          background: black;
          border-radius: 12px;
          overflow: hidden;
        }
        .${styles.lightboxCaption} {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        @media (max-width: 768px) {
          .${styles.lightboxVideoContainer} {
            width: 95vw;
          }
        }
      `}</style>
    </>
  );
}
