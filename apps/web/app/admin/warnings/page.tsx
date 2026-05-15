// ============================================================
// MODULE:     app/admin/warnings/page
// PURPOSE:    Gestión de advertencias por discrepancias de pago
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock,
  ShieldAlert,
} from "lucide-react";
import styles from "./warnings.module.css";

interface Warning {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  appointmentId: string;
  providerAmount: number;
  clientAmount: number;
  discrepancy: number;
  warningNumber: number;
  createdAt: string;
  status: "ACTIVE" | "RESOLVED" | "BLOCKED";
}

interface WarningStats {
  totalWarnings: number;
  activeWarnings: number;
  resolvedWarnings: number;
  blockedProviders: number;
  warningRate: number;
}

export default function WarningsManagementPage() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [stats, setStats] = useState<WarningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "active" | "resolved" | "blocked"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWarnings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        status: filter,
      });

      const response = await fetch(`/api/admin/warnings?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cargar advertencias");
      }

      const data = await response.json();
      setWarnings(data.warnings);
      setStats(data.stats);
      setTotalPages(data.pagination.pages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  const filteredWarnings = warnings.filter(
    (w) =>
      w.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.providerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string, warningNumber: number) => {
    if (status === "BLOCKED") {
      return (
        <span className={`${styles.statusBadge} ${styles.blocked}`}>
          Bloqueado
        </span>
      );
    }
    if (status === "RESOLVED") {
      return (
        <span className={`${styles.statusBadge} ${styles.resolved}`}>
          Resuelto
        </span>
      );
    }
    return (
      <span
        className={`${styles.statusBadge} ${warningNumber >= 2 ? styles.danger : styles.active}`}
      >
        {warningNumber === 1 ? "1ra Advertencia" : "2da Advertencia"}
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Advertencias</h1>
          <p className={styles.subtitle}>
            Controla las discrepancias de pago entre proveedor y cliente
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={fetchWarnings}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? styles.spinning : ""} />
          Actualizar
        </button>
      </header>

      {stats && (
        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.total}`}>
            <div className={styles.statIcon}>
              <AlertTriangle size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Advertencias</span>
              <span className={styles.statValue}>{stats.totalWarnings}</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.active}`}>
            <div className={styles.statIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Activas</span>
              <span className={styles.statValue}>{stats.activeWarnings}</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.resolved}`}>
            <div className={styles.statIcon}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Resueltas</span>
              <span className={styles.statValue}>{stats.resolvedWarnings}</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.blocked}`}>
            <div className={styles.statIcon}>
              <ShieldAlert size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Bloqueados</span>
              <span className={styles.statValue}>{stats.blockedProviders}</span>
            </div>
          </div>
        </section>
      )}

      <section className={styles.infoBox}>
        <AlertTriangle size={18} />
        <div>
          <strong>Regla de Bloqueo:</strong>
          <ul>
            <li>1ra discrepancia = 1ra advertencia (sin bloqueo)</li>
            <li>2da discrepancia = 2da advertencia (sin bloqueo)</li>
            <li>3ra discrepancia = Bloqueo automático del proveedor</li>
          </ul>
        </div>
      </section>

      <section className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por proveedor, email o cita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <Filter size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "active" | "resolved" | "blocked")}
            className={styles.filterSelect}
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="resolved">Resueltas</option>
            <option value="blocked">Bloqueados</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className={styles.loading}>
          <RefreshCw className={styles.spinning} size={32} />
          <p>Cargando...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <AlertTriangle size={24} />
          <p>{error}</p>
          <button onClick={fetchWarnings}>Reintentar</button>
        </div>
      ) : (
        <section className={styles.tableSection}>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Proveedor</th>
                    <th>Cita</th>
                    <th>Monto Proveedor</th>
                    <th>Monto Cliente</th>
                    <th>Discrepancia</th>
                    <th>Advertencia</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarnings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={styles.empty}>
                        No hay advertencias{" "}
                        {filter !== "all" ? `(${filter})` : ""}
                      </td>
                    </tr>
                  ) : (
                    filteredWarnings.map((warning) => (
                      <tr key={warning.id}>
                        <td data-label="Proveedor">
                          <div className={styles.providerInfo}>
                            <div>
                              <span className={styles.providerName}>
                                {warning.providerName}
                              </span>
                              <span className={styles.providerEmail}>
                                {warning.providerEmail}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td data-label="Cita" className={styles.appointmentId}>
                          {warning.appointmentId.slice(0, 8)}...
                        </td>
                        <td data-label="Monto Prov.">${warning.providerAmount.toFixed(2)}</td>
                        <td data-label="Monto Client.">${warning.clientAmount.toFixed(2)}</td>
                        <td data-label="Discrepancia" className={styles.discrepancy}>
                          ${warning.discrepancy.toFixed(2)}
                        </td>
                        <td data-label="Advertencia">
                          <span
                            className={`${styles.warningNumber} ${warning.warningNumber >= 2 ? styles.danger : ""}`}
                          >
                            #{warning.warningNumber}
                          </span>
                        </td>
                        <td data-label="Fecha" className={styles.date}>
                          {new Date(warning.createdAt).toLocaleDateString(
                            "es-EC",
                          )}
                        </td>
                        <td data-label="Estado">
                          {getStatusBadge(
                            warning.status,
                            warning.warningNumber,
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
