'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import TopBar from './TopBar';
import MainSearch from './MainSearch';
import SubNav from './SubNav';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const displayCount = mounted ? totalItems : 0;

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      {/* ── Top Bar ── */}
      <TopBar />

      {/* ── Main Nav ── */}
      <nav className={styles.mainNav}>
        <div className={styles.navInner}>
          {/* BOTÓN HAMBURGUESA: Navegación móvil ultra-compacta */}
          <button className={styles.hamburger} onClick={() => setMenuOpen(v => !v)} aria-label="Menú móvil">
            <span className={menuOpen ? styles.barOpen : ''}/>
            <span className={menuOpen ? styles.barOpen : ''}/>
            <span className={menuOpen ? styles.barOpen : ''}/>
          </button>

          <div className={styles.navLeft}>
            <Link href="/" className={styles.logo}>
              <Image 
                src="/logotipo.png" 
                alt="SaidonClub Logo" 
                width={180} 
                height={50} 
                priority
                className={styles.logoImage}
              />
            </Link>
          </div>

          <div className={styles.searchRow}>
            <MainSearch />
          </div>

          <div className={styles.navRight}>
            <div className={styles.navActions}>
              <div 
                data-tooltip={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                data-tooltip-pos="bottom"
                className={styles.tooltipContainer}
              >
                <button 
                  className={styles.themeToggleBtn} 
                  onClick={toggleTheme}
                  aria-label="Cambiar ambiente visual"
                >
                  <div className={styles.themeIconWrapper}>
                    <svg className={`${styles.themeIcon} ${theme === 'light' ? styles.activeIcon : styles.previewIcon}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    <svg className={`${styles.themeIcon} ${theme === 'dark' ? styles.activeIcon : styles.previewIcon}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  </div>
                </button>
              </div>

              <div
                data-tooltip="Ir a Mi Carrito"
                data-tooltip-pos="bottom"
                className={styles.tooltipContainer}
              >
                <Link 
                  href="/carrito" 
                  className={styles.cartBtn} 
                >
                  <ShoppingCart size={20} color="white" />
                  {displayCount > 0 && <span className={styles.cartBadge}>{displayCount}</span>}
                </Link>
              </div>

              <div
                data-tooltip="Ir a Mi Panel de Control"
                data-tooltip-pos="bottom"
                className={styles.tooltipContainer}
              >
                <Link 
                  href="/dashboard" 
                  className={styles.btnPrimary}
                >
                  Cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>


      {/* ── Sub-Nav (Quick Categories) ── */}
      <SubNav />

      {/* ── Mobile Menu ── */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </header>
  );
}
