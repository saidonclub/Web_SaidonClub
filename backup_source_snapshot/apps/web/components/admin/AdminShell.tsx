// ============================================================
// MODULE:     components/admin/AdminShell
// PURPOSE:    Layout shell para páginas de administración
//             Incluye sidebar con navegación y contenido
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  X,
  Image,
} from "lucide-react";
import styles from "./AdminShell.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  permission?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <Home size={20} /> },
  { href: "/admin/users", label: "Usuarios", icon: <Users size={20} /> },
  { href: "/admin/products", label: "Productos", icon: <Package size={20} /> },
  {
    href: "/admin/services",
    label: "Servicios",
    icon: <Briefcase size={20} />,
  },
  { href: "/admin/kyc", label: "KYC", icon: <Shield size={20} /> },
  { href: "/admin/withdrawals", label: "Retiros", icon: <Wallet size={20} /> },
  { href: "/admin/providers", label: "Proveedores", icon: <Store size={20} /> },
  { href: "/admin/multimedia", label: "Multimedia", icon: <Image size={20} /> },
  { href: "/admin/audit", label: "Auditoría", icon: <FileText size={20} /> },
  {
    href: "/admin/config",
    label: "Configuración",
    icon: <Settings size={20} />,
  },
];

interface AdminShellProps {
  children: React.ReactNode;
  userRole?: string;
}

export function AdminShell({ children, userRole: _userRole }: AdminShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (!mounted) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* Mobile header */}
      <header className={styles.mobileHeader}>
        <button
          className={styles.menuButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className={styles.mobileTitle}>Admin Panel</span>
      </header>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            <img
              src="/logotipo.png"
              alt="SaidonClub Admin Logo"
              className={styles.logoImage}
            />
          </Link>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navItem}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/dashboard" className={styles.navItem}>
            <Home size={20} />
            <span>Volver al Dashboard</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
