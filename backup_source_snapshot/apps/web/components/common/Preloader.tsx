'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preloader.module.css';

const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if it's the first time in this session to avoid annoyance
    const hasSeenIntro = sessionStorage.getItem('saidon_intro_seen');

    if (hasSeenIntro) {
      setLoading(false);
      return;
    }

    // Sequence timing: 
    // 0.0s - 1.2s: Logo Entry
    // 1.5s - 4.0s: Progress Bar fills up
    // 4.5s: Start exit transition
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('saidon_intro_seen', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -20,
            transition: { 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1],
              when: "afterChildren"
            }
          }}
        >
          <div className={styles.container}>
            {/* Ambient Glow */}
            <motion.div 
              className={styles.bgGlow}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.6 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />

            {/* Logo Animation (Stage 1) */}
            <motion.div
              className={styles.logoWrapper}
              initial={{ scale: 0.8, opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                filter: 'blur(0px)',
                transition: { 
                  duration: 1.5, 
                  ease: [0.16, 1, 0.3, 1] 
                }
              }}
            >
              <div className={styles.logoEffect}>
                <Image
                  src="/logotipo.png"
                  alt="SaidonClub Logo"
                  width={380}
                  height={110}
                  className={styles.logo}
                  priority
                />
                <motion.div 
                  className={styles.shimmer}
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ 
                    delay: 1.2,
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              </div>
            </motion.div>

            {/* Progress Section (Stage 2) */}
            <motion.div 
              className={styles.progressSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className={styles.progressContainer}>
                <motion.div
                  className={styles.progressBar}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ 
                    delay: 1.8, 
                    duration: 2.5, 
                    ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for "premium" feel
                  }}
                />
              </div>

              {/* Premium Loading Text */}
              <motion.p
                className={styles.loadingText}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ 
                  delay: 2, 
                  duration: 2,
                  times: [0, 0.2, 0.5, 1],
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                Cargando Ecosistema...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
