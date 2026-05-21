'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Wallet, 
  Settings, 
  Shield, 
  Briefcase, 
  Activity,
  User,
  Package,
  FileText,
  TrendingUp,
  MessageSquare,
  LogOut,
  ChevronRight,
  X,
  Menu,
  Cpu
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { Role } from '@saidonclub/rbac';

interface MobileMenuProps {
  role: Role;
  userEmail: string;
}

export default function MobileMenu({ role, userEmail }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: 'Principal',
      links: [
        { href: '/dashboard', label: 'Centro de Comando', icon: <LayoutDashboard size={20} />, roles: ['*'] },
        { href: '/tienda', label: 'Mercado Saidon', icon: <ShoppingBag size={20} />, roles: ['*'] },
      ]
    },
    {
      title: 'Inteligencia Artificial',
      links: [
        { href: '/dashboard/ai-trading', label: 'Mesa Financiera Cuántica', icon: <TrendingUp size={20} />, roles: ['*'] },
        { href: '/dashboard/ai-agency', label: 'Agencia de Desarrollo IA', icon: <Cpu size={20} />, roles: ['*'] },
      ]
    },
    {
      title: 'Mi Negocio',
      links: [
        { href: '/dashboard/network', label: 'Mi Red de Socios', icon: <Users size={20} />, roles: ['*'] },
        { href: '/dashboard/transfer', label: 'Transferencias', icon: <Wallet size={20} />, roles: ['*'] },
        { href: '/dashboard/withdraw', label: 'Retiros', icon: <TrendingUp size={20} />, roles: ['*'] },
        { href: '/dashboard/scripts', label: 'Scripts de Venta', icon: <MessageSquare size={20} />, roles: ['*'] },
      ]
    },
    {
      title: 'Operaciones',
      links: [
        { href: '/dashboard/pedidos', label: 'Mis Compras', icon: <Package size={20} />, roles: ['*'] },
        { href: '/dashboard/ventas', label: 'Gestión de Ventas', icon: <Activity size={20} />, roles: ['PROVIDER_PRODUCTS', 'PROVIDER_SERVICES', 'SUPER_ADMIN', 'ADMIN'] },
        { href: '/dashboard/productos', label: 'Mi Catálogo', icon: <Briefcase size={20} />, roles: ['PROVIDER_PRODUCTS', 'PROVIDER_SERVICES', 'SUPER_ADMIN', 'ADMIN'] },
      ]
    },
    {
      title: 'Sistema & Admin',
      links: [
        { href: '/admin/users', label: 'Usuarios', icon: <User size={20} />, roles: ['SUPER_ADMIN', 'ADMIN'] },
        { href: '/admin/inventory', label: 'Inventario Global', icon: <Shield size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'AUDITOR'] },
        { href: '/dashboard/ledger', label: 'Libro Mayor', icon: <FileText size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT'] },
      ]
    },
    {
      title: 'Configuración',
      links: [
        { href: '/dashboard/settings', label: 'Mi Perfil', icon: <Settings size={20} />, roles: ['*'] },
        { href: '/dashboard/security', label: 'Seguridad', icon: <Shield size={20} />, roles: ['*'] },
      ]
    }
  ];

  const filteredMenu = menuItems.map(section => ({
    ...section,
    links: section.links.filter(link => 
      link.roles.includes('*') || link.roles.includes(role)
    )
  })).filter(section => section.links.length > 0);

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button 
        className={styles.mobileMenuBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú móvil deslizable */}
      <aside className={`${styles.sidebar} ${styles.mobileSidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>S</div>
          <div className={styles.brandText}>
            <span className={styles.name}>SaidonClub</span>
            <span className={styles.version}>v9.5 OS</span>
          </div>
          <button 
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.userSection}>
          <div className={styles.avatar}>
            <User size={24} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{userEmail}</span>
            <span className={styles.userRole}>{role}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {filteredMenu.map((section, idx) => (
            <div key={idx} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <ul className={styles.list}>
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href} 
                      className={styles.link}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={styles.icon}>{link.icon}</span>
                      <span className={styles.label}>{link.label}</span>
                      <ChevronRight size={14} className={styles.chevron} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <button className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}