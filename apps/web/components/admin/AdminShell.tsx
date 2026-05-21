// ============================================================
// MODULE:     components/admin/AdminShell
// PURPOSE:    Layout shell para páginas de administración inspirado en AdminLTE
//             Se adapta según el rol del usuario
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Home,
  Users,
  Package,
  Briefcase,
  Shield,
  Wallet,
  Store,
  FileText,
  Settings,
  LogOut,
  Menu,
  Image as ImageIcon,
  Bell,
  Search,
  ChevronDown,
  ShoppingBag,
  BarChart3,
  Download
} from "lucide-react";
import styles from "./AdminShell.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[]; // Si no se provee, todos pueden verlo
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <Home size={20} /> },
  { href: "/admin/users", label: "Usuarios", icon: <Users size={20} />, roles: ["SUPERADMIN", "ADMIN"] },
  { href: "/admin/products", label: "Productos", icon: <Package size={20} />, roles: ["SUPERADMIN", "ADMIN", "PROVIDER"] },
  { href: "/admin/services", label: "Servicios", icon: <Briefcase size={20} />, roles: ["SUPERADMIN", "ADMIN", "PROVIDER"] },
  { href: "/admin/kyc", label: "KYC & Verificación", icon: <Shield size={20} />, roles: ["SUPERADMIN", "ADMIN"] },
  { href: "/admin/orders", label: "Historial de Pedidos", icon: <ShoppingBag size={20} />, roles: ["SUPERADMIN", "ADMIN", "ACCOUNTANT"] },
  { href: "/admin/withdrawals", label: "Retiros & Finanzas", icon: <Wallet size={20} />, roles: ["SUPERADMIN", "ADMIN", "ACCOUNTANT"] },
  { href: "/admin/balances", label: "Saldos Globales", icon: <BarChart3 size={20} />, roles: ["SUPERADMIN", "ADMIN", "ACCOUNTANT"] },
  { href: "/admin/providers", label: "Proveedores", icon: <Store size={20} />, roles: ["SUPERADMIN", "ADMIN"] },
  { href: "/admin/multimedia", label: "Multimedia", icon: <ImageIcon size={20} />, roles: ["SUPERADMIN", "ADMIN"] },
  { href: "/admin/audit", label: "Auditoría", icon: <FileText size={20} />, roles: ["SUPERADMIN"] },
  { href: "/admin/import", label: "Importar Datos", icon: <Download size={20} />, roles: ["SUPERADMIN", "ADMIN"] },
  { href: "/admin/config", label: "Configuración", icon: <Settings size={20} />, roles: ["SUPERADMIN"] },
];

interface AdminShellProps {
  children: React.ReactNode;
  userRole?: string;
}

export function AdminShell({ children, userRole = "ADMIN" }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("admin@saidonclub.com");

  useEffect(() => {
    setMounted(true);
    
    // Check screen size
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Fetch user
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    };
    fetchUser();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Filtrar navegación por rol
  const filteredNav = NAV_ITEMS.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  if (!mounted) return null;

  return (
    <div className={`${styles.shell} ${sidebarOpen ? styles.sidebarExpanded : styles.sidebarCollapsed}`}>
      {/* ── Top Navbar ── */}
      <nav className={styles.topNavbar}>
        <div className={styles.navbarLeft}>
          <button className={styles.menuToggle} onClick={toggleSidebar} aria-label="Toggle Menu">
            <Menu size={20} />
          </button>
          
          {/* Breadcrumb / Title area */}
          <div className={styles.navbarTitle}>
            SaidonClub <span className={styles.roleBadge}>{userRole}</span>
          </div>
        </div>

        <div className={styles.navbarRight}>
          <div className={styles.navAction}>
            <Search size={18} />
          </div>
          <div className={styles.navAction}>
            <Bell size={18} />
            <span className={styles.badge}>3</span>
          </div>
          <div className={styles.userDropdown}>
            <div className={styles.userAvatar}>
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userName}>{userEmail.split('@')[0]}</span>
            <ChevronDown size={14} className={styles.chevron} />
          </div>
        </div>
      </nav>

      {/* ── Main Sidebar ── */}
      <aside className={`${styles.mainSidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        {/* Brand Logo */}
        <Link href="/admin" className={styles.brandLink}>
          <div className={styles.brandIcon}>SC</div>
          <span className={styles.brandText}>Admin<strong>Panel</strong></span>
        </Link>

        {/* User Panel */}
        <div className={styles.userPanel}>
          <div className={styles.userPanelAvatar}>
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userPanelInfo}>
            <div className={styles.userPanelName}>{userEmail.split('@')[0]}</div>
            <div className={styles.userPanelStatus}>
              <span className={styles.statusDot}></span> Online
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className={styles.sidebarMenu}>
          <div className={styles.menuHeader}>NAVEGACIÓN PRINCIPAL</div>
          <ul className={styles.navList}>
            {filteredNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href} className={styles.navItem}>
                  <Link 
                    href={item.href} 
                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <p className={styles.navText}>{item.label}</p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.menuHeader}>ACCIONES</div>
          <ul className={styles.navList}>
             <li className={styles.navItem}>
              <Link href="/dashboard" className={styles.navLink}>
                <span className={styles.navIcon}><Home size={20} /></span>
                <p className={styles.navText}>Volver al Portal</p>
              </Link>
            </li>
            <li className={styles.navItem}>
              <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutLink}`}>
                <span className={styles.navIcon}><LogOut size={20} /></span>
                <p className={styles.navText}>Cerrar Sesión</p>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Content Wrapper ── */}
      <div className={styles.contentWrapper}>
        <div className={styles.contentHeader}>
          <div className={styles.contentHeaderInner}>
            <h1 className={styles.pageTitle}>
              {filteredNav.find(n => pathname === n.href)?.label || "Dashboard"}
            </h1>
            <ol className={styles.breadcrumb}>
              <li><Link href="/admin">Inicio</Link></li>
              {pathname !== "/admin" && <li className={styles.active}>{filteredNav.find(n => pathname === n.href)?.label}</li>}
            </ol>
          </div>
        </div>

        <section className={styles.content}>
          <div className={styles.containerFluid}>
            {children}
          </div>
        </section>
      </div>
      
      {/* ── Main Footer ── */}
      <footer className={styles.mainFooter}>
        <div className={styles.floatRight}>
          <b>Versión</b> 9.5
        </div>
        <strong>Copyright &copy; 2026 <Link href="/">SaidonClub</Link>.</strong> Todos los derechos reservados.
      </footer>
    </div>
  );
}
