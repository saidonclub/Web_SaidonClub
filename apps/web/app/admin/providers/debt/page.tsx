// ============================================================
// MODULE:     app/admin/providers/debt/page
// PURPOSE:    Gestión de deudas de proveedores
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Building,
} from "lucide-react";
import styles from "./debt.module.css";

interface ProviderDebt {
  id: string;
  businessName: string;
  profession: string;
  email: string;
  phone: string;
  pendingDebt: number;
  totalDebtPaid: number;
  isBlocked: boolean;
  lastSettlement: string | null;
  completedAppointments: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SummaryInfo {
  totalProviders: number;
  totalPendingDebt: number;
  totalDebtPaid: number;
  blockedProviders: number;
}

export default function DebtManagementPage() {
  const [providers, setProviders] = useState<ProviderDebt[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [summary, setSummary] = useState<SummaryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "blocked" | "active">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ProviderDebt | null>(
    null,
  );
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [adjustAction, setAdjustAction] = useState<"add" | "subtract">("add");
  const [submitting, setSubmitting] = useState(false);

  const fetchDebts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: "20",
        status: filter,
      });

      const response = await fetch(`/api/admin/providers/debt?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cargar deudas");
      }

      const data = await response.json();
      setProviders(data.providers);
      setPagination(data.pagination);
      setSummary(data.summary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filter]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const handleAction = async (
    providerId: string,
    action: "block" | "unblock" | "waive",
  ) => {
    if (
      !confirm(
        `¿Estás seguro de ${action === "block" ? "bloquear" : action === "unblock" ? "desbloquear" : "condonar"} este proveedor?`,
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/providers/debt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, action, notes: "" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      alert(
        action === "block"
          ? "Proveedor bloqueado"
          : action === "unblock"
            ? "Proveedor desbloqueado"
            : "Deuda condonada",
      );
      fetchDebts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjust = async () => {
    if (!selectedProvider || !adjustAmount) return;

    setSubmitting(true);
    try {
      const amount =
        adjustAction === "add"
          ? parseFloat(adjustAmount)
          : -parseFloat(adjustAmount);
      const response = await fetch("/api/admin/providers/debt", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: selectedProvider.id,
          action: "adjust",
          amount,
          notes: adjustNotes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();
      alert(`Deuda ajustada. Nueva deuda: $${data.newDebt.toFixed(2)}`);
      setShowAdjustModal(false);
      setAdjustAmount("");
      setAdjustNotes("");
      setSelectedProvider(null);
      fetchDebts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProviders = providers.filter(
    (p) =>
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Deudas</h1>
          <p className={styles.subtitle}>
            Controla y gestiona las deudas de comisiones de proveedores
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={fetchDebts}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? styles.spinning : ""} />
          Actualizar
        </button>
      </header>

      {summary && (
        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.debt}`}>
            <div className={styles.statIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Deuda Total Pendiente</span>
              <span className={styles.statValue}>
                ${summary.totalPendingDebt.toFixed(2)}
              </span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.paid}`}>
            <div className={styles.statIcon}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Pagado</span>
              <span className={styles.statValue}>
                ${summary.totalDebtPaid.toFixed(2)}
              </span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.providers}`}>
            <div className={styles.statIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Proveedores Activos</span>
              <span className={styles.statValue}>{summary.totalProviders}</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.blocked}`}>
            <div className={styles.statIcon}>
              <XCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Proveedores Bloqueados</span>
              <span className={styles.statValue}>
                {summary.blockedProviders}
              </span>
            </div>
          </div>
        </section>
      )}

      <section className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por empresa o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <Filter size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "blocked" | "active")}
            className={styles.filterSelect}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
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
          <button onClick={fetchDebts}>Reintentar</button>
        </div>
      ) : (
        <section className={styles.tableSection}>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Email</th>
                    <th>Servicios</th>
                    <th>Deuda Pendiente</th>
                    <th>Total Pagado</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.empty}>
                        No hay proveedores con{" "}
                        {filter === "blocked"
                          ? "deuda bloqueada"
                          : filter === "active"
                            ? "deuda activa"
                            : "deuda"}
                      </td>
                    </tr>
                  ) : (
                    filteredProviders.map((provider) => (
                      <tr key={provider.id}>
                        <td data-label="Empresa">
                          <div className={styles.providerInfo}>
                            <Building size={16} />
                            <div>
                              <span className={styles.providerName}>
                                {provider.businessName}
                              </span>
                              <span className={styles.providerProfession}>
                                {provider.profession}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td data-label="Email">{provider.email}</td>
                        <td data-label="Servicios">{provider.completedAppointments}</td>
                        <td data-label="Deuda Pendiente" className={styles.debtAmount}>
                          ${provider.pendingDebt.toFixed(2)}
                        </td>
                        <td data-label="Total Pagado">${provider.totalDebtPaid.toFixed(2)}</td>
                        <td data-label="Estado">
                          <span
                            className={`${styles.statusBadge} ${provider.isBlocked ? styles.blocked : styles.active}`}
                          >
                            {provider.isBlocked ? "Bloqueado" : "Activo"}
                          </span>
                        </td>
                        <td data-label="Acciones">
                          <div className={styles.actions}>
                            <button
                              className={styles.adjustBtn}
                              onClick={() => {
                                setSelectedProvider(provider);
                                setShowAdjustModal(true);
                              }}
                              title="Ajustar deuda"
                            >
                              <DollarSign size={14} />
                            </button>
                            {provider.isBlocked ? (
                              <button
                                className={styles.unblockBtn}
                                onClick={() =>
                                  handleAction(provider.id, "unblock")
                                }
                                disabled={submitting}
                                title="Desbloquear"
                              >
                                <CheckCircle size={14} />
                              </button>
                            ) : (
                              <button
                                className={styles.blockBtn}
                                onClick={() =>
                                  handleAction(provider.id, "block")
                                }
                                disabled={submitting}
                                title="Bloquear"
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                            <button
                              className={styles.waiveBtn}
                              onClick={() => handleAction(provider.id, "waive")}
                              disabled={submitting || provider.pendingDebt <= 0}
                              title="Condonar deuda"
                            >
                              <AlertTriangle size={14} />
                            </button>
                          </div>
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

      {pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Anterior
          </button>
          <span>
            Página {pagination.page} de {pagination.pages}
          </span>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Siguiente
          </button>
        </div>
      )}

      {showAdjustModal && selectedProvider && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Ajustar Deuda</h3>
            <p className={styles.modalSubtitle}>
              {selectedProvider.businessName} - Deuda actual: $
              {selectedProvider.pendingDebt.toFixed(2)}
            </p>

            <div className={styles.modalForm}>
              <label>
                <input
                  type="radio"
                  name="adjustAction"
                  checked={adjustAction === "add"}
                  onChange={() => setAdjustAction("add")}
                />
                Agregar monto
              </label>
              <label>
                <input
                  type="radio"
                  name="adjustAction"
                  checked={adjustAction === "subtract"}
                  onChange={() => setAdjustAction("subtract")}
                />
                Restar monto
              </label>
            </div>

            <div className={styles.modalField}>
              <label>Monto ($)</label>
              <input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.modalField}>
              <label>Notas (opcional)</label>
              <textarea
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
                placeholder="Razón del ajuste..."
                rows={3}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowAdjustModal(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleAdjust}
                disabled={submitting || !adjustAmount}
              >
                {submitting ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
