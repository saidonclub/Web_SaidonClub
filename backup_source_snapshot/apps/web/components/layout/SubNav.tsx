import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { SUBNAV_CATEGORIES } from './NavbarData';

export default function SubNav() {
  const pathname = usePathname();
  const [activeQuery, setActiveQuery] = useState('');


  useEffect(() => {
    setActiveQuery(window.location.search);
  }, [pathname]);

  const products = SUBNAV_CATEGORIES.filter(c => c.type === 'product');
  const services = SUBNAV_CATEGORIES.filter(c => c.type === 'service');

  const renderItem = (c: any) => {
    const itemHref = c.isAll 
        ? (c.type === 'service' ? '/servicios' : '/productos')
        : (c.type === 'service' ? `/servicios?category=${c.slug}` : `/productos?category=${c.slug}`);
         
    const isActive = c.isAll 
          ? pathname === (c.type === 'service' ? '/servicios' : '/productos') && !activeQuery
          : activeQuery.includes(`category=${c.slug}`);
    
    return (
        <div 
          key={c.slug} 
          className={`${styles.subNavItemWrapper} ${c.type === 'product' ? styles.navSectionProducts : styles.navSectionServices}`}
          data-tooltip={c.label}
        >
          <Link 
            href={itemHref} 
            className={`${styles.subNavItem} ${c.type === 'service' ? styles.iconService : styles.iconProduct} ${isActive ? styles.activeSubNavItem : ''} ${c.isAll ? styles.isAllBtn : ''}`}
          >
            {c.icon}
            {c.isAll && <span className={styles.isAllText}>{c.label.replace('Ver ', '')}</span>}
          </Link>
        </div>
    );
  };

  return (
    <div className={styles.subNav}>
      <div className={styles.subNavInner}>
        {/* Grupo Productos */}
        <div className={styles.subGroup}>
          <span className={`${styles.subGroupLabel} ${styles.labelProduct}`}>PRODUCTOS</span>
          <div className={styles.subGroupItems}>
            {products.map(renderItem)}
          </div>
        </div>

        <div className={styles.subDivider} />

        {/* Grupo Servicios */}
        <div className={styles.subGroup}>
          <span className={`${styles.subGroupLabel} ${styles.labelService}`}>SERVICIOS</span>
          <div className={styles.subGroupItems}>
            {services.map(renderItem)}
          </div>
        </div>
      </div>
    </div>
  );
}
