// ============================================================
// COMPONENT: Terminal Unificada por Tipo de Usuario
// PURPOSE: Muestra dashboard, herramientas y reportes segun el rol del usuario
// ROLES: ADMIN, PROVIDER, CLIENTE, AUDITOR, ACCOUNTANT
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Zap,
  Package,
  Calendar,
  CreditCard,
  Shield,
  BarChart3,
  AlertCircle,
  Building2,
  UserCog,
} from "lucide-react";
import styles from "./terminal.module.css";

// ============================================================
// TIPOS DE DATOS - Definiciones de tipos para la terminal
// ============================================================

// Roles posibles en el sistema (usado para referencia)
// type UserRole =
//   | "SUPER_ADMIN"
//   | "ADMIN"
//   | "ACCOUNTANT"
//   | "AUDITOR"
//   | "PROVIDER_SERVICES"
//   | "PROVIDER_PRODUCTS"
//   | "PREFERENTE"
//   | "PIONERO";

// Estadísticas para Admin
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProviders: number;
  activeProviders: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  warnings: number;
  blockedProviders: number;
  activeDebt: number;
  pendingWithdrawals: number;
  kycPending: number;
}

// Estadísticas para Proveedor
interface ProviderStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  paidPayments: number;
  warnings: number;
  blocked: boolean;
  rating: number;
  servicesCount: number;
}

// Estadísticas para Cliente
interface ClientStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalSpent: number;
  monthlySpent: number;
  favoriteProviders: number;
  membershipLevel: string;
}

// Entrada de log de actividad
interface LogEntry {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
  timestamp: string;
}

// ============================================================
// COMPONENTE PRINCIPAL - Terminal Unificada
// ============================================================

export function UnifiedTerminal() {
  const { profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<
    AdminStats | ProviderStats | ClientStats | null
  >(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Obtener el tipo de terminal según el rol
  const getTerminalType = ():
    | "admin"
    | "provider"
    | "client"
    | "auditor"
    | "accountant" => {
    if (!profile?.role) return "client";

    switch (profile.role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "admin";
      case "PROVIDER_SERVICES":
      case "PROVIDER_PRODUCTS":
        return "provider";
      case "AUDITOR":
        return "auditor";
      case "ACCOUNTANT":
        return "accountant";
      default:
        return "client";
    }
  };

  const terminalType = getTerminalType();

  // ============================================================
  // OBTENER ESTADÍSTICAS SEGÚN TIPO DE USUARIO
  // ============================================================

  const fetchStats = useCallback(async (signal?: AbortSignal) => {
    try {
      // Construir endpoint según el tipo de usuario
      const endpoint = `/api/terminal/${terminalType}/stats`;
      const response = await fetch(endpoint, { signal });

      if (!response.ok) throw new Error("Error al cargar");

      const data = await response.json();
      
      if (signal?.aborted) return;

      setStats(data.stats);
      setLastUpdate(new Date());

      // Agregar log de actualización
      const revenueMsg = data.stats.monthlyRevenue
        ? `Ingresos del mes: $${data.stats.monthlyRevenue.toFixed(2)}`
        : data.stats.monthlySpent
          ? `Gastos del mes: $${data.stats.monthlySpent.toFixed(2)}`
          : "Estadísticas actualizadas";

      setLogs((prev) => [
        {
          id: Date.now().toString(),
          type: "info",
          message: revenueMsg,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 19),
      ]);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          type: "error",
          message: "Error al cargar estadísticas",
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 19),
      ]);
    } finally {
      setLoading(false);
    }
  }, [terminalType]);

  // ============================================================
  // EFECTO DE CARGA Y AUTO-ACTUALIZACIÓN
  // ============================================================

  useEffect(() => {
    const controller = new AbortController();
    
    if (!authLoading && profile) {
      fetchStats(controller.signal);
    }

    return () => controller.abort();
  }, [authLoading, profile, fetchStats]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const controller = new AbortController();

    if (autoRefresh && profile) {
      interval = setInterval(() => fetchStats(controller.signal), 30000); // 30 segundos
    }
    
    return () => {
      if (interval) clearInterval(interval);
      controller.abort();
    };
  }, [fetchStats, autoRefresh, profile]);

  // Initialize lastUpdate on client to avoid hydration mismatch
  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  // ============================================================
  // FUNCIONES AUXILIARES
  // ============================================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={14} />;
      case "warning":
        return <AlertTriangle size={14} />;
      case "error":
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getRoleLabel = (role: string | undefined): string => {
    if (!role) return "Usuario";
    const labels: Record<string, string> = {
      SUPER_ADMIN: "Super Administrador",
      ADMIN: "Administrador",
      ACCOUNTANT: "Contador",
      AUDITOR: "Auditor",
      PROVIDER_SERVICES: "Proveedor de Servicios",
      PROVIDER_PRODUCTS: "Proveedor de Productos",
      PREFERENTE: "Miembro Preferente",
      PIONERO: "Miembro Pionero",
    };
    return labels[role] || role;
  };

  const getRoleIcon = (type: string) => {
    switch (type) {
      case "admin":
        return <UserCog size={18} />;
      case "provider":
        return <Building2 size={18} />;
      case "auditor":
        return <Shield size={18} />;
      case "accountant":
        return <BarChart3 size={18} />;
      default:
        return <Users size={18} />;
    }
  };

  // ============================================================
  // RENDERIZAR ESTADÍSTICAS SEGÚN TIPO DE USUARIO
  // ============================================================

  const renderAdminStats = (s: AdminStats) => (
    <>
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.users}`}>
            <Users size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Usuarios Activos</span>
            <span className={styles.statValue}>{s.activeUsers}</span>
            <span className={styles.statSub}>/ {s.totalUsers} total</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.providers}`}>
            <Building2 size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Proveedores Activos</span>
            <span className={styles.statValue}>{s.activeProviders}</span>
            <span className={styles.statSub}>/ {s.totalProviders} total</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.appointments}`}>
            <Calendar size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Citas Completadas</span>
            <span className={styles.statValue}>{s.completedAppointments}</span>
            <span className={styles.statSub}>
              {s.pendingAppointments} pendientes
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.revenue}`}>
            <DollarSign size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Ingresos del Mes</span>
            <span className={styles.statValue}>
              {formatCurrency(s.monthlyRevenue)}
            </span>
            <span className={styles.statSub}>
              {s.monthlyRevenue >= s.weeklyRevenue * 4 ? (
                <>
                  <TrendingUp size={12} /> En crecimiento
                </>
              ) : (
                <>
                  <TrendingDown size={12} /> Por debajo del promedio
                </>
              )}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.warning}`}>
            <AlertTriangle size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Advertencias</span>
            <span className={styles.statValue}>{s.warnings}</span>
            <span className={styles.statSub}>
              {s.blockedProviders} bloqueados
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.debt}`}>
            <CreditCard size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Deuda Activa</span>
            <span className={styles.statValue}>
              {formatCurrency(s.activeDebt)}
            </span>
            <span className={styles.statSub}>
              {s.pendingWithdrawals} retiros pendientes
            </span>
          </div>
        </div>
      </section>

      <section className={styles.statsGridSecondary}>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Ingresos Totales</span>
          <span className={styles.miniValue}>
            {formatCurrency(s.totalRevenue)}
          </span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Comisiones Totales</span>
          <span className={styles.miniValue}>
            {formatCurrency(s.totalCommissions)}
          </span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>KYC Pendiente</span>
          <span className={styles.miniValue}>{s.kycPending}</span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Proveedores Bloqueados</span>
          <span
            className={`${styles.miniValue} ${s.blockedProviders > 0 ? styles.danger : ""}`}
          >
            {s.blockedProviders}
          </span>
        </div>
      </section>
    </>
  );

  const renderProviderStats = (s: ProviderStats) => (
    <>
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.appointments}`}>
            <Calendar size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Mis Citas</span>
            <span className={styles.statValue}>{s.completedAppointments}</span>
            <span className={styles.statSub}>
              {s.pendingAppointments} pendientes
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.revenue}`}>
            <DollarSign size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Ingresos del Mes</span>
            <span className={styles.statValue}>
              {formatCurrency(s.monthlyRevenue)}
            </span>
            <span className={styles.statSub}>
              Total: {formatCurrency(s.totalRevenue)}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.providers}`}>
            <Package size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Mis Servicios</span>
            <span className={styles.statValue}>{s.servicesCount}</span>
            <span className={styles.statSub}>
              {s.rating > 0 ? `⭐ ${s.rating.toFixed(1)}` : "Sin rating"}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${s.blocked ? styles.danger : styles.success}`}
          >
            {s.blocked ? (
              <AlertTriangle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Estado de Cuenta</span>
            <span className={styles.statValue}>
              {s.blocked ? "Bloqueado" : "Activo"}
            </span>
            <span className={styles.statSub}>{s.warnings} advertencias</span>
          </div>
        </div>
      </section>

      <section className={styles.statsGridSecondary}>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Citas Totales</span>
          <span className={styles.miniValue}>{s.totalAppointments}</span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Pagos Pendientes</span>
          <span className={`${styles.miniValue} ${styles.warning}`}>
            {formatCurrency(s.pendingPayments)}
          </span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Pagos Recibidos</span>
          <span className={styles.miniValue}>
            {formatCurrency(s.paidPayments)}
          </span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Advertencias</span>
          <span
            className={`${styles.miniValue} ${s.warnings > 0 ? styles.warning : ""}`}
          >
            {s.warnings}
          </span>
        </div>
      </section>
    </>
  );

  const renderClientStats = (s: ClientStats) => (
    <>
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.appointments}`}>
            <Calendar size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Mis Citas</span>
            <span className={styles.statValue}>{s.completedAppointments}</span>
            <span className={styles.statSub}>
              {s.pendingAppointments} pendientes
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.revenue}`}>
            <DollarSign size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Gastado este Mes</span>
            <span className={styles.statValue}>
              {formatCurrency(s.monthlySpent)}
            </span>
            <span className={styles.statSub}>
              Total: {formatCurrency(s.totalSpent)}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.users}`}>
            <Building2 size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Proveedores Favoritos</span>
            <span className={styles.statValue}>{s.favoriteProviders}</span>
            <span className={styles.statSub}>Guardados</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.membership}`}>
            <Users size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Mi Membresía</span>
            <span className={styles.statValue}>{s.membershipLevel}</span>
            <span className={styles.statSub}>Nivel actual</span>
          </div>
        </div>
      </section>

      <section className={styles.statsGridSecondary}>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Citas Totales</span>
          <span className={styles.miniValue}>{s.totalAppointments}</span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Citas Canceladas</span>
          <span
            className={`${styles.miniValue} ${s.cancelledAppointments > 0 ? styles.danger : ""}`}
          >
            {s.cancelledAppointments}
          </span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Total Gastado</span>
          <span className={styles.miniValue}>
            {formatCurrency(s.totalSpent)}
          </span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniLabel}>Nivel Membresía</span>
          <span className={styles.miniValue}>{s.membershipLevel}</span>
        </div>
      </section>
    </>
  );

  // ============================================================
  // RENDERIZAR SEGÚN TIPO DE USUARIO
  // ============================================================

  const renderStats = () => {
    if (!stats) return null;

    switch (terminalType) {
      case "admin":
        return renderAdminStats(stats as AdminStats);
      case "provider":
        return renderProviderStats(stats as ProviderStats);
      case "client":
        return renderClientStats(stats as ClientStats);
      default:
        return renderClientStats(stats as ClientStats);
    }
  };

  // ============================================================
  // RENDERIZAR PRINCIPAL
  // ============================================================

  if (authLoading) {
    return (
      <div className={styles.terminal}>
        <div className={styles.loading}>
          <RefreshCw className={styles.spinning} size={24} />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.terminal}>
        <div className={styles.loading}>
          <AlertTriangle size={24} />
          <span>Debes iniciar sesión para ver la terminal</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.terminal}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Zap size={18} className={styles.zapIcon} />
          <h2>Terminal {getRoleLabel(profile.role)}</h2>
          <span className={styles.roleBadge}>
            {getRoleIcon(terminalType)}
            {getRoleLabel(profile.role)}
          </span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.lastUpdate}>
            Actualizado: {lastUpdate ? lastUpdate.toLocaleTimeString("es-EC") : "--:--:--"}
          </span>
          <label className={styles.autoRefresh}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-actualizar
          </label>
          <button
            className={styles.refreshBtn}
            onClick={() => fetchStats()}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? styles.spinning : ""} />
          </button>
        </div>
      </header>

      {loading && !stats ? (
        <div className={styles.loading}>
          <RefreshCw className={styles.spinning} size={24} />
          <span>Cargando estadísticas...</span>
        </div>
      ) : (
        renderStats()
      )}

      <section className={styles.logsSection}>
        <h3>Actividad Reciente</h3>
        <div className={styles.logsList}>
          {logs.length === 0 ? (
            <div className={styles.emptyLogs}>Sin actividad reciente</div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`${styles.logEntry} ${styles[log.type]}`}
              >
                {getLogIcon(log.type)}
                <span className={styles.logMessage}>{log.message}</span>
                <span className={styles.logTime}>
                  {new Date(log.timestamp).toLocaleTimeString("es-EC")}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
