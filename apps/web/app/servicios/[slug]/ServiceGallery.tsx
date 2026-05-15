"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ServiceGallery.module.css';

interface ServiceGalleryProps {
  images: string[];
  videos?: string[];
  serviceName: string;
}

export default function ServiceGallery({ 
  images, 
  videos = [], 
  serviceName 
}: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure at least 3 images by using fallbacks if necessary
  const displayImages = [...images];
  const fallbacks = [
    'https://images.unsplash.com/photo-1454165833767-131ef2155ee0?w=800&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
  ];

  while (displayImages.length < 3) {
    displayImages.push(fallbacks[displayImages.length % fallbacks.length]);
  }

  const allMedia = [
    ...displayImages.map((url, i) => ({ url, type: 'image' as const, id: `img-${i}` })),
    ...videos.map((url, i) => ({ url, type: 'video' as const, id: `vid-${i}` }))
  ];

  const currentMedia = allMedia[activeIndex] || allMedia[0];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % allMedia.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainContainer}>
        {currentMedia.type === 'video' ? (
          <div className={styles.videoWrapper}>
             {getYoutubeId(currentMedia.url) ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYoutubeId(currentMedia.url)}?autoplay=1`}
                  title="Service Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={currentMedia.url} controls autoPlay className={styles.videoPlayer} />
              )}
          </div>
        ) : (
          <div className={styles.imageWrapper}>
            <Image
              src={currentMedia.url}
              alt={serviceName}
              fill
              className={styles.mainImage}
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {allMedia.length > 1 && (
          <>
            <button onClick={handlePrev} className={`${styles.navBtn} ${styles.prev}`}>
              <ChevronLeft size={24} />
            </button>
            <button onClick={handleNext} className={`${styles.navBtn} ${styles.next}`}>
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      <div className={styles.thumbnails}>
        {allMedia.map((media, i) => (
          <button
            key={media.id}
            className={`${styles.thumbnail} ${activeIndex === i ? styles.active : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            {media.type === 'video' ? (
              <div className={styles.thumbVideoOverlay}>
                <PlayCircle size={20} />
              </div>
            ) : null}
            <Image
              src={media.type === 'video' ? images[0] : media.url}
              alt={`${serviceName} thumb ${i}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
