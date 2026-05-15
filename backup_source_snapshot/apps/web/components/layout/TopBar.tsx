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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (topNavRef.current && !topNavRef.current.contains(e.target as Node)) {
        setActiveTopDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarInner}>
        <TopTicker />
        
        <div className={styles.topLinks} ref={topNavRef}>
          {TOP_NAV_DATA.map((menu) => (
            <div 
              key={menu.label} 
              className={styles.topLinkWrap}
              onMouseEnter={() => setActiveTopDropdown(menu.label)}
              onMouseLeave={() => setActiveTopDropdown(null)}
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
                <div className={styles.topDropdown}>
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
          {/* BOTÓN DE ACCESO (VISTA PÚBLICA): 
              Color reactivo: Naranja Saidon al hover.
              Estilo: Transparente, sin bordes, enfoque en tipografía premium. */}
          <Link href="/auth/login" className={styles.topLogin} data-tooltip="Ingresar a mi cuenta existente">
            <LogIn size={14} /> Iniciar sesión
          </Link>
          
          {/* DIVISOR DE SEGURIDAD: 
              Estilo: Línea vertical punteada gris que separa elegantemente las acciones de cuenta. */}
          <div className={styles.topDivider}/>
          
          {/* BOTÓN DE REGISTRO (ÚNETE A LA RED): 
              Color reactivo: Violeta MLM al hover.
              Estilo: Transparente, minimalismo ejecutivo. */}
          <Link href="/auth/register" className={styles.topRegister} data-tooltip="Crear una nueva cuenta SaidonClub">
            <UserPlus size={14} /> Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
