"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./ProductDetail.module.css";
import { PlayCircle, ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

  const galleryImages = images.length > 0 ? images : [fallbackImage];

  /* ─── Lightbox helpers ─────────────────────────────────── */
  const openLightbox = useCallback(
    (idx: number) => {
      if (!isVideoActive) {
        setLightboxIndex(idx);
        setIsLightboxOpen(true);
      }
    },
    [isVideoActive],
  );

  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

  const lightboxPrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLightboxIndex(
        (i) => (i - 1 + galleryImages.length) % galleryImages.length,
      );
    },
    [galleryImages.length],
  );

  const lightboxNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLightboxIndex((i) => (i + 1) % galleryImages.length);
    },
    [galleryImages.length],
  );

  /* ─── Keyboard navigation ──────────────────────────────── */
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  /* ─── Swipe support for lightbox ──────────────────────── */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? lightboxNext() : lightboxPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  /* ─── Thumbnail click ──────────────────────────────────── */
  const handleThumbnailClick = (index: number, isVideo: boolean) => {
    setActiveIndex(index);
    setIsVideoActive(isVideo);
  };

  /* ─── YouTube ID extractor ─────────────────────────────── */
  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <>
      <div className={styles.imageSection}>
        {/* ─── Main Image ─── */}
        <div
          className={styles.mainImageWrapper}
          onClick={() => openLightbox(activeIndex)}
          role="button"
          tabIndex={0}
          aria-label={`Ver imagen ampliada de ${productName}`}
          onKeyDown={(e) => e.key === "Enter" && openLightbox(activeIndex)}
        >
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
                />
              ) : (
                <video
                  src={videos[activeIndex]}
                  controls
                  className={styles.videoPlayer}
                />
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
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {discount && discount > 0 ? (
            <div className={styles.detailBadge}>-{discount}% Club</div>
          ) : null}
        </div>

        {/* ─── Thumbnail Grid ─── */}
        {(galleryImages.length > 1 || videos.length > 0) && (
          <div className={styles.thumbnailGrid}>
            {galleryImages.map((img, i) => (
              <button
                key={`img-${i}`}
                className={`${styles.thumbnail} ${
                  !isVideoActive && activeIndex === i
                    ? styles.activeThumbnail
                    : ""
                }`}
                onClick={() => handleThumbnailClick(i, false)}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} miniatura ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="80px"
                />
              </button>
            ))}

            {videos.map((_vid, i) => (
              <button
                key={`vid-${i}`}
                className={`${styles.thumbnail} ${styles.videoThumbnail} ${
                  isVideoActive && activeIndex === i
                    ? styles.activeThumbnail
                    : ""
                }`}
                onClick={() => handleThumbnailClick(i, true)}
                aria-label={`Ver video ${i + 1}`}
              >
                <div className={styles.videoIconOverlay}>
                  <PlayCircle size={24} color="white" />
                </div>
                <Image
                  src={galleryImages[0] || fallbackImage}
                  alt={`${productName} miniatura de video ${i + 1}`}
                  fill
                  style={{ objectFit: "cover", opacity: 0.6 }}
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Lightbox Overlay ─── */}
      {isLightboxOpen && !isVideoActive && (
        <div
          className={`${styles.lightboxOverlay} ${styles.open}`}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes"
        >
          {/* Close */}
          <button
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Cerrar galería"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {galleryImages.length > 1 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={lightboxPrev}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightboxIndex] || fallbackImage}
              alt={`${productName} — imagen ${lightboxIndex + 1}`}
              width={1400}
              height={1400}
              style={{ objectFit: "contain" }}
              className={styles.lightboxImage}
              priority
            />
          </div>

          {/* Next */}
          {galleryImages.length > 1 && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={lightboxNext}
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Counter */}
          <div className={styles.lightboxCounter}>
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
}
