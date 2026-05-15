'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LoadingIntro.module.css';

/**
 * LoadingIntro — Experiencia Cinematográfica Saidon OS
 * Secuencia: 
 * 1. El logotipo emerge con un destello.
 * 2. Se inicia la barra de carga tras la aparición del logo.
 * 3. Transición suave al Home al completar la carga.
 */
export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Iniciando sistemas...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Mensajes dinámicos según el progreso
        if (prev > 20 && prev < 40) setStatus('Sincronizando Marketplace...');
        if (prev > 60 && prev < 80) setStatus('Cifrando conexiones seguras...');
        if (prev > 80 && prev < 95) setStatus('Bienvenido a SaidonClub');
        if (prev >= 95) setStatus('Preparando entorno...');
        
        return prev + 1;
      });
    }, 25);

    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3800); // Duración total ajustada para no aburrir pero ser premium

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={styles.container}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
        >
          {/* Fondo de Partículas Sutiles */}
          <div className={styles.particles}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.particle}
                initial={{ 
                  x: Math.random() * 100 + "vw", 
                  y: Math.random() * 100 + "vh",
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, "-100vh"],
                  opacity: [0, 0.4, 0] 
                }}
                transition={{ 
                  duration: Math.random() * 5 + 5, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          <div className={styles.cinematicGlow} />

          <div className={styles.content}>
            <div className={styles.logoContainer}>
              {/* Logo con Animación de Surgimiento */}
              <motion.div
                className={styles.logoWrapper}
                initial={{ scale: 0.85, opacity: 0, filter: 'blur(20px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <Image 
                  src="/logotipo.png" 
                  alt="SaidonClub Logo" 
                  width={300} 
                  height={80} 
                  className={styles.logo}
                  priority
                />
              </motion.div>

              {/* Área de Carga — Evita Solapamiento con Gap Generoso */}
              <motion.div 
                className={styles.loaderArea}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className={styles.statusRow}>
                  <span className={styles.statusText}>{status}</span>
                  <span className={styles.percentage}>{progress}%</span>
                </div>

                <div className={styles.progressTrack}>
                  <motion.div 
                    className={styles.progressBar}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className={styles.progressShine} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
