'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search as SearchIcon, 
  ShoppingCart, 
  Menu, 
  LogIn, 
  UserPlus, 
  MapPin, 
  Laptop, 
  Home, 
  Sparkles, 
  Car, 
  Trophy, 
  Gamepad2, 
  Dog, 
  Baby, 
  Heart, 
  Briefcase,
  Layers,
  Code,
  Megaphone,
  Stethoscope,
  Scale,
  GraduationCap,
  Wrench,
  LocateFixed,
  Truck,
  Palette,
  Shirt,
  Footprints,
  Gem,
  BookOpen,
  ToyBrick,
  Brush,
  Zap,
  DollarSign,
  Hammer
} from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';
import { usePathname } from 'next/navigation';
import TopTicker from './TopTicker';
import RegionSelector from './RegionSelector';

/**
 * SaidónClub Navbar Component — Premium OS v5.1
 * Separación clara de Productos vs Servicios (10+10 + All Buttons)
 */
const SUBNAV_CATEGORIES = [
  // ─── PRODUCTOS (12 Categorías + Botón Especial) ───
  { label: 'Tecnología', slug: 'tecnologia', type: 'product', icon: <Laptop size={18} /> },
  { label: 'Hogar', slug: 'hogar', type: 'product', icon: <Home size={18} /> },
  { label: 'Belleza', slug: 'belleza', type: 'product', icon: <Sparkles size={18} /> },
  { label: 'Automotriz', slug: 'automotriz', type: 'product', icon: <Car size={18} /> },
  { label: 'Deportes', slug: 'deportes', type: 'product', icon: <Trophy size={18} /> },
  { label: 'Gaming', slug: 'gaming', type: 'product', icon: <Gamepad2 size={18} /> },
  { label: 'Mascotas', slug: 'mascotas', type: 'product', icon: <Dog size={18} /> },
  { label: 'Moda', slug: 'moda', type: 'product', icon: <Shirt size={18} /> },
  { label: 'Calzado', slug: 'calzado', type: 'product', icon: <Footprints size={18} /> },
  { label: 'Juguetería', slug: 'juguetes', type: 'product', icon: <ToyBrick size={18} /> },
  { label: 'Ferretería', slug: 'ferreteria', type: 'product', icon: <Hammer size={18} /> },
  { label: 'Papelería', slug: 'papeleria', type: 'product', icon: <BookOpen size={18} /> },
  { label: 'Ver todos los productos', slug: 'all-products', type: 'product', isAll: true, icon: <Layers size={18} /> },

  { type: 'divider', slug: 'div-1' },

  // ─── SERVICIOS (12 Categorías + Botón Especial) ───
  { label: 'Tech & Dev', slug: 'tech', type: 'service', icon: <Code size={18} /> },
  { label: 'Marketing', slug: 'marketing', type: 'service', icon: <Megaphone size={18} /> },
  { label: 'Salud', slug: 'salud', type: 'service', icon: <Stethoscope size={18} /> },
  { label: 'Legal', slug: 'legal', type: 'service', icon: <Scale size={18} /> },
  { label: 'Consultoría', slug: 'consultoria', type: 'service', icon: <Briefcase size={18} /> },
  { label: 'Educación', slug: 'educacion', type: 'service', icon: <GraduationCap size={18} /> },
  { label: 'Reparaciones', slug: 'reparaciones', type: 'service', icon: <Wrench size={18} /> },
  { label: 'Logística', slug: 'logistica', type: 'service', icon: <Truck size={18} /> },
  { label: 'Diseño', slug: 'diseno', type: 'service', icon: <Palette size={18} /> },
  { label: 'Construcción', slug: 'construccion', type: 'service', icon: <Hammer size={18} /> },
  { label: 'Inmobiliaria', slug: 'inmobiliaria', type: 'service', icon: <MapPin size={18} /> },
  { label: 'Eventos', slug: 'eventos', type: 'service', icon: <Trophy size={18} /> },
  { label: 'Ver todos los servicios', slug: 'all-services', type: 'service', isAll: true, icon: <Zap size={18} /> }
];

const TOP_NAV_DATA = [
  {
    label: 'Membresías & Beneficios',
    href: '/membresias',
    subcategories: [
      { label: 'Planes de Membresía', href: '/membresias' },
      { label: 'Beneficios Exclusivos', href: '/membresias#beneficios' },
      { label: 'Sistema de Puntos', href: '/nosotros#economia' },
    ]
  },
  {
    label: 'Productos',
    href: '/productos',
    subcategories: [
      { label: 'Todos los productos', href: '/productos' },
      { label: 'Tecnología', href: '/productos?cat=tecnologia' },
      { label: 'Hogar', href: '/productos?cat=hogar' },
      { label: 'Moda', href: '/productos?cat=moda' },
    ]
  },
  {
    label: 'Servicios',
    href: '/servicios',
    subcategories: [
      { label: 'Todos los servicios', href: '/servicios' },
      { label: 'Salud y Bienestar', href: '/servicios?cat=salud' },
      { label: 'Tech & Dev', href: '/servicios?cat=tech' },
      { label: 'Asesoría y Consultoría', href: '/servicios?cat=consultoria' },
    ]
  },
  {
    label: 'SaidonClub',
    href: '/nosotros',
    subcategories: [
      { label: '¿Qué es SaidonClub?', href: '/nosotros' },
      { label: 'Oportunidad de Negocio', href: '/nosotros#red' },
      { label: 'Vender con nosotros', href: '/vender' },
    ]
  },
  {
    label: 'Soporte',
    href: '/ayuda',
    subcategories: [
      { label: 'Centro de Ayuda', href: '/ayuda' },
      { label: 'Contacto', href: '/contacto' },
    ]
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [search, setSearch]       = useState('');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeTopDropdown, setActiveTopDropdown] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  const topNavRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveQuery(window.location.search);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (topNavRef.current && !topNavRef.current.contains(e.target as Node)) {
        setActiveTopDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const displayCount = mounted ? totalItems : 0;

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      {/* ── Top Bar ── */}
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
            <Link href="/auth/login" className={styles.topLogin}>
              <LogIn size={14} /> Iniciar sesión
            </Link>
            <div className={styles.topDivider}/>
            <Link href="/auth/register" className={styles.topRegister}>
              <UserPlus size={14} /> Registrarse
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <div className={styles.mainNav}>
        <div className={styles.navInner}>

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
            <div className={styles.mainNavDivider} />
          </div>

          <div className={styles.navRight}>
            
            <form 
              className={styles.searchBar} 
              onSubmit={e => { 
                e.preventDefault(); 
                if (search.trim()) {
                  window.location.href = `/productos?q=${encodeURIComponent(search)}`;
                }
              }}
            >
              {/* Customizable Search Module (RegionSelector) */}
              <div className={styles.navRegionWrapper}>
                <RegionSelector />
              </div>
              
              <div className={styles.searchInputWrapper}>
                <SearchIcon size={18} className={styles.searchIcon} />
                <input 
                  type="text" 
                  className={styles.searchInput}
                  placeholder="Buscar productos, servicios, marcas..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.searchBtn}>BUSCAR</button>
            </form>

            <div className={styles.navActions}>
              <button 
                className={styles.iconBtn} 
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {theme === 'dark' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>

              <Link href="/carrito" className={styles.cartBtn} title="Ver carrito">
                <ShoppingCart size={22} />
                {displayCount > 0 && <span className={styles.cartBadge}>{displayCount}</span>}
              </Link>

              <Link href="/dashboard" className={styles.btnPrimary}>
                Mi Cuenta
              </Link>
            </div>

            <button className={styles.hamburger} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <span className={menuOpen ? styles.barOpen : ''}/>
              <span className={menuOpen ? styles.barOpen : ''}/>
              <span className={menuOpen ? styles.barOpen : ''}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-Nav (Quick Categories) ── */}
      <div className={styles.subNav}>
        <div className={styles.subNavInner}>
          {SUBNAV_CATEGORIES.map((c, i) => {
            if (c.type === 'divider') {
              return <div key={`div-${i}`} className={styles.subDivider} />;
            }

            const itemHref = c.isAll 
                ? (c.type === 'service' ? '/servicios' : '/productos')
                : (c.type === 'service' ? `/servicios?cat=${c.slug}` : `/productos?cat=${c.slug}`);
                
            const isActive = c.isAll 
                  ? pathname === (c.type === 'service' ? '/servicios' : '/productos') && !activeQuery
                  : activeQuery.includes(`cat=${c.slug}`);
            
            return (
              <div 
                key={c.slug} 
                className={styles.subNavItemWrapper}
                onMouseEnter={() => setHoveredCategory(c.label)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link 
                  href={itemHref} 
                  className={`${styles.subNavItem} ${c.type === 'service' ? styles.iconService : styles.iconProduct} ${isActive ? styles.activeSubNavItem : ''} ${c.isAll ? styles.isAllBtn : ''}`}
                >
                  {c.icon}
                </Link>
                {/* React Tooltip — rendered in wrapper to avoid being clipped */}
                {hoveredCategory === c.label && (
                  <div className={styles.reactTooltip}>
                    {c.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile Menu ── */}
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
              href={c.isAll ? (c.type === 'service' ? '/servicios' : '/productos') : (c.type === 'service' ? `/servicios?cat=${c.slug}` : `/productos?cat=${c.slug}`)}
              className={styles.mobileGridItem}
              onClick={() => setMenuOpen(false)}
            >
              {c.icon}
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
