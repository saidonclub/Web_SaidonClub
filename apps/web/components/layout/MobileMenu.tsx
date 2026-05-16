import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';
import styles from './MobileMenu.module.css';
import { SUBNAV_CATEGORIES } from './NavbarData';

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({ menuOpen, setMenuOpen }: MobileMenuProps) {
  return (
    <>
      <div 
        className={`${styles.mobileOverlay} ${menuOpen ? styles.active : ''}`} 
        onClick={() => setMenuOpen(false)}
      />
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.active : ''}`}>
        <div className={styles.mobileActions}>
          <Link href="/auth/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <LogIn size={18} /> Iniciar sesión
          </Link>
          <Link href="/auth/register" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            <UserPlus size={18} /> Registrarse
          </Link>
        </div>
        <div className={styles.mobileDivider}/>
        <div className={styles.mobileSectionTitle}>Categorías</div>
        <div className={styles.mobileGrid}>
          {SUBNAV_CATEGORIES.filter(c => c.type !== 'divider').map(c => (
            <Link 
              key={c.slug} 
              href={c.type === 'service' ? `/servicios?category=${c.slug}` : `/productos?category=${c.slug}`}
              className={styles.mobileGridItem}
              onClick={() => setMenuOpen(false)}
            >
              {c.icon}
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
