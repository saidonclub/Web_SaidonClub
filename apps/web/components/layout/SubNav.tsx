import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Zap } from 'lucide-react';
import styles from './Navbar.module.css';
import { SUBNAV_CATEGORIES } from './NavbarData';

interface SubnavCategory {
  label: string;
  slug: string;
  type: 'product' | 'service' | 'divider';
  icon?: React.ReactNode;
  isAll?: true;
}

export default function SubNav() {
  const pathname = usePathname();
  const [activeQuery, setActiveQuery] = useState('');


  useEffect(() => {
    setActiveQuery(window.location.search);
  }, [pathname]);

  const products = SUBNAV_CATEGORIES.filter(c => c.type === 'product') as SubnavCategory[];
  const services = SUBNAV_CATEGORIES.filter(c => c.type === 'service') as SubnavCategory[];

  const renderItem = (c: SubnavCategory) => {
    const itemHref = c.type === 'service' ? `/servicios?category=${c.slug}` : `/productos?category=${c.slug}`;
         
    const isActive = activeQuery.includes(`category=${c.slug}`);
    
    return (
        <div 
          key={c.slug} 
          className={`${styles.subNavItemWrapper} ${c.type === 'product' ? styles.navSectionProducts : styles.navSectionServices}`}
          data-tooltip={c.label}
          data-tooltip-pos="bottom"
        >
          <Link 
            href={itemHref} 
            className={`${styles.subNavItem} ${c.type === 'service' ? styles.iconService : styles.iconProduct} ${isActive ? styles.activeSubNavItem : ''}`}
          >
            {c.icon}
          </Link>
        </div>
    );
  };

  return (
    <div className={styles.subNav}>
      <div className={styles.subNavInner}>
        {/* Grupo Productos */}
        <div className={styles.subGroup}>
          <Link href="/productos" className={`${styles.subGroupLabel} ${styles.labelProduct}`}>
            <ShoppingBag size={14} />
            <span>PRODUCTOS</span>
          </Link>
          <div className={styles.subGroupItems}>
            {products.map(renderItem)}
          </div>
        </div>

        <div className={styles.subDivider} />

        {/* Grupo Servicios */}
        <div className={styles.subGroup}>
          <Link href="/servicios" className={`${styles.subGroupLabel} ${styles.labelService}`}>
            <Zap size={14} />
            <span>SERVICIOS</span>
          </Link>
          <div className={styles.subGroupItems}>
            {services.map(renderItem)}
          </div>
        </div>
      </div>
    </div>
  );
}
