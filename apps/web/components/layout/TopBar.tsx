import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';
import TopTicker from './TopTicker';
import styles from './Navbar.module.css';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TOP_NAV_DATA } from './NavbarData';

export default function TopBar() {
  const pathname = usePathname();
  const [activeTopDropdown, setActiveTopDropdown] = useState<string | null>(null);
  const topNavRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (topNavRef.current && !topNavRef.current.contains(e.target as Node)) {
        setActiveTopDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveTopDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveTopDropdown(null);
    }, 75); // 75ms delay keeps the menu open while crossing gaps but feels snappier
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarInner}>
        <TopTicker />
        
        <div className={styles.topLinks} ref={topNavRef}>
          {TOP_NAV_DATA.map((menu) => (
            <div 
              key={menu.label} 
              className={styles.topLinkWrap}
              onMouseEnter={() => handleMouseEnter(menu.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                href={menu.href} 
                className={`${styles.topLinkItem} ${pathname === menu.href ? styles.activeTopLink : ''}`}
              >
                {menu.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.topChevron}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </Link>
              
              {activeTopDropdown === menu.label && (
                <div 
                  className={styles.topDropdown}
                  onMouseEnter={() => handleMouseEnter(menu.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.topDropdownScrollable}>
                    {menu.subcategories.map((sub) => (
                      <Link 
                        key={sub.label} 
                        href={sub.href} 
                        className={styles.topDropdownItem}
                        onClick={() => setActiveTopDropdown(null)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.topActions}>
          <Link href="/auth/login" className={styles.topLogin} data-tooltip="Ingresar a mi cuenta existente">
            <LogIn size={14} /> Iniciar sesión
          </Link>
          
          <div className={styles.topDivider}/>
          
          <Link href="/auth/register" className={styles.topRegister} data-tooltip="Crear una nueva cuenta SaidonClub">
            <UserPlus size={14} /> Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
