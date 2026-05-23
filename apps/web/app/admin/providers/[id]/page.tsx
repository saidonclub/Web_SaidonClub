"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  approveServiceProvider,
  rejectServiceProvider,
  suspendServiceProvider,
  reactivateServiceProvider,
  requestProviderUpdate,
  getServiceProviderDetail,
} from "@/lib/actions/service-provider";
import styles from "./detail.module.css";

type ProviderWithRelations = Awaited<ReturnType<typeof getServiceProviderDetail>>;
type NonNullProvider = NonNullable<ProviderWithRelations>;
type ServiceListing = NonNullProvider["services"][number];
type Appointment = NonNullProvider["appointments"][number];
type ProviderReview = NonNullProvider["providerReviews"][number];
type ClientReview = NonNullProvider["clientReviews"][number];
type DebtSettlementType = NonNullProvider["debtSettlements"][number];
type ProviderWarning = NonNullProvider["warnings"][number];
type ProviderSchedule = NonNullProvider["schedules"][number];
type ProviderBlockedDate = NonNullProvider["blockedDates"][number];

const TAB_KEYS = ["resumen", "kyc", "servicios", "citas", "resenas", "deuda", "advertencias", "horario"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const CLIENT_PROVIDER_STATUS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Activo", color: "green" },
  INACTIVE: { label: "Inactivo", color: "gray" },
  SUSPENDED: { label: "Suspendido", color: "red" },
};

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function serializeDecimal(val: unknown): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val);
  if (typeof val === "object" && val !== null && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return 0;
}

function formatMoney(val: unknown): string {
  const n = serializeDecimal(val);
  return `$${n.toFixed(2)}`;
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.tabButton} ${active ? styles.tabActive : ""}`}
    >
      {label}
    </button>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button type="button" onClick={onClose} className={styles.modalClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<ProviderWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("resumen");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [modalState, setModalState] = useState<{ type: string; open: boolean }>({ type: "", open: false });
  const [modalText, setModalText] = useState("");
  const [suspendPermanent, setSuspendPermanent] = useState(false);

  const fetchProvider = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getServiceProviderDetail(providerId);
      if (!data) {
        setError("Proveedor no encontrado");
      } else {
        setProvider(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proveedor");
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  function openModal(type: string) {
    setModalText("");
    setSuspendPermanent(false);
    setModalState({ type, open: true });
  }

  function closeModal() {
    setModalState({ type: "", open: false });
  }

  async function handleApprove() {
    setActionLoading("approve");
    try {
      await approveServiceProvider(providerId);
      await fetchProvider();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al aprobar");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject() {
    if (!modalText.trim()) return;
    setActionLoading("reject");
    try {
      await rejectServiceProvider(providerId, modalText.trim());
      closeModal();
      await fetchProvider();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al rechazar");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRequestUpdate() {
    if (!modalText.trim()) return;
    setActionLoading("requestUpdate");
    try {
      await requestProviderUpdate(providerId, modalText.trim());
      closeModal();
      await fetchProvider();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al solicitar actualización");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSuspend() {
    setActionLoading("suspend");
    try {
      await suspendServiceProvider(providerId, suspendPermanent);
      closeModal();
      await fetchProvider();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al suspender");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReactivate() {
    setActionLoading("reactivate");
    try {
      await reactivateServiceProvider(providerId);
      await fetchProvider();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al reactivar");
    } finally {
      setActionLoading(null);
    }
  }

  const isLoading = actionLoading !== null;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <div className={styles.skeleton} style={{ width: 120, height: 16, marginBottom: 8 }} />
            <div className={styles.skeleton} style={{ width: 300, height: 28, marginBottom: 6 }} />
            <div className={styles.skeleton} style={{ width: 200, height: 16 }} />
          </div>
          <div className={styles.skeleton} style={{ width: 80, height: 24, borderRadius: 12 }} />
        </div>
        <div className={styles.tabs}>
          {TAB_KEYS.map((k) => (
            <div key={k} className={styles.skeleton} style={{ width: 120, height: 32, borderRadius: 6 }} />
          ))}
        </div>
        <div className={styles.content}>
          <div className={styles.statsGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.skeleton} style={{ width: 40, height: 28, margin: "0 auto 4px" }} />
                <div className={styles.skeleton} style={{ width: 80, height: 14, margin: "0 auto" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error || "Proveedor no encontrado"}</p>
          <Link href="/admin/providers" className={styles.backLink}>Volver a proveedores</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/providers" className={styles.backLink}>&larr; Proveedores</Link>
          <h1 className={styles.title}>{provider.businessName}</h1>
          <p className={styles.subtitle}>
            {provider.user?.name} &middot; {provider.profession}
            {provider.city ? ` &middot; ${provider.city}` : ""}
          </p>
        </div>
        <div className={styles.headerActions}>
          <StatusBadge status={provider.status} size="md" />
        </div>
      </div>

      <div className={styles.tabs}>
        {TAB_KEYS.map((key) => (
          <TabButton
            key={key}
            active={activeTab === key}
            onClick={() => setActiveTab(key)}
            label={
              key === "resumen" ? "Resumen" :
              key === "kyc" ? "KYC / Documentos" :
              key === "servicios" ? "Servicios" :
              key === "citas" ? "Citas" :
              key === "resenas" ? "Reseñas" :
              key === "deuda" ? "Deuda" :
              key === "advertencias" ? "Advertencias" :
              key === "horario" ? "Horario" : key
            }
          />
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === "resumen" && <ResumenTab provider={provider} />}
        {activeTab === "kyc" && (
          <KycTab
            provider={provider}
            onApprove={handleApprove}
            onReject={() => openModal("reject")}
            onRequestUpdate={() => openModal("requestUpdate")}
            onSuspend={() => openModal("suspend")}
            onReactivate={handleReactivate}
            actionLoading={actionLoading}
            isLoading={isLoading}
          />
        )}
        {activeTab === "servicios" && <ServiciosTab services={provider.services} />}
        {activeTab === "citas" && <CitasTab appointments={provider.appointments} />}
        {activeTab === "resenas" && (
          <ResenasTab providerReviews={provider.providerReviews} clientReviews={provider.clientReviews} />
        )}
        {activeTab === "deuda" && <DeudaTab settlements={provider.debtSettlements} />}
        {activeTab === "advertencias" && <AdvertenciasTab warnings={provider.warnings} providerId={providerId} onWarningIssued={fetchProvider} />}
        {activeTab === "horario" && (
          <HorarioTab schedules={provider.schedules} blockedDates={provider.blockedDates} />
        )}
      </div>

      <Modal open={modalState.type === "reject"} onClose={closeModal} title="Rechazar Proveedor">
        <div className={styles.modalContent}>
          <p className={styles.modalDesc}>Se notificará al proveedor el motivo del rechazo.</p>
          <label className={styles.fieldLabel}>Motivo de rechazo</label>
          <textarea
            className={styles.fieldInput}
            rows={3}
            value={modalText}
            onChange={(e) => setModalText(e.target.value)}
            placeholder="Indica el motivo..."
          />
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={closeModal}>Cancelar</button>
            <button type="button" className={styles.btnDanger} onClick={handleReject} disabled={isLoading || !modalText.trim()}>
              {actionLoading === "reject" ? "Rechazando..." : "Rechazar Proveedor"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modalState.type === "requestUpdate"} onClose={closeModal} title="Solicitar Actualización">
        <div className={styles.modalContent}>
          <p className={styles.modalDesc}>Se notificará al proveedor que debe actualizar su información.</p>
          <label className={styles.fieldLabel}>Instrucciones</label>
          <textarea
            className={styles.fieldInput}
            rows={3}
            value={modalText}
            onChange={(e) => setModalText(e.target.value)}
            placeholder="Indica qué debe actualizar..."
          />
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={closeModal}>Cancelar</button>
            <button type="button" className={styles.btnPrimary} onClick={handleRequestUpdate} disabled={isLoading || !modalText.trim()}>
              {actionLoading === "requestUpdate" ? "Enviando..." : "Solicitar Actualización"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modalState.type === "suspend"} onClose={closeModal} title="Suspender Proveedor">
        <div className={styles.modalContent}>
          <p className={styles.modalDesc}>El proveedor no podrá aceptar nuevas citas mientras esté suspendido.</p>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={suspendPermanent}
              onChange={(e) => setSuspendPermanent(e.target.checked)}
            />
            Suspensión permanente
          </label>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={closeModal}>Cancelar</button>
            <button type="button" className={styles.btnDanger} onClick={handleSuspend} disabled={isLoading}>
              {actionLoading === "suspend" ? "Suspendiendo..." : "Suspender Proveedor"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ResumenTab({ provider }: { provider: NonNullProvider }) {
  const prices = provider.services.map((s) => serializeDecimal(s.publicPrice));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const userStatus = provider.user
    ? CLIENT_PROVIDER_STATUS[provider.user.status as string] || { label: provider.user.status, color: "gray" }
    : null;

  return (
    <div className={styles.tabPanel}>
      <div className={styles.statsGrid}>
        <StatCard label="Servicios" value={provider._count.services} />
        <StatCard label="Citas" value={provider._count.appointments} />
        <StatCard label="Reseñas Recibidas" value={provider._count.providerReviews} />
        <StatCard label="Reseñas Emitidas" value={provider._count.clientReviews} />
        <StatCard label="Advertencias" value={provider._count.warnings} />
        <StatCard label="Liquidaciones" value={provider._count.debtSettlements} />
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Información General</h3>
        <InfoRow label="Negocio" value={provider.businessName} />
        <InfoRow label="Profesión" value={provider.profession} />
        <InfoRow label="Categoría" value={provider.professionCategory} />
        <InfoRow label="Estado" value={<StatusBadge status={provider.status} size="sm" />} />
        <InfoRow label="Resolución / Acuerdo" value={provider.agreementNumber || "—"} />
        <InfoRow label="Registrado" value={formatDateTime(provider.createdAt)} />
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Contacto</h3>
        <InfoRow label="Nombre" value={provider.user?.name || "—"} />
        <InfoRow label="Email" value={provider.user?.email || provider.email || "—"} />
        <InfoRow label="Teléfono" value={provider.phone || "—"} />
        <InfoRow label="WhatsApp" value={provider.whatsapp || "—"} />
        <InfoRow label="Dirección" value={provider.address || "—"} />
        <InfoRow label="Ciudad" value={provider.city || "—"} />
        {provider.user && <InfoRow label="Estado Usuario" value={<StatusBadge status={provider.user.status} size="sm" />} />}
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Redes Sociales</h3>
        <InfoRow label="Instagram" value={provider.instagram ? <a href={`https://instagram.com/${provider.instagram}`} target="_blank" rel="noopener noreferrer">@{provider.instagram}</a> : "—"} />
        <InfoRow label="Facebook" value={provider.facebook ? <a href={`https://facebook.com/${provider.facebook}`} target="_blank" rel="noopener noreferrer">{provider.facebook}</a> : "—"} />
        <InfoRow label="Telegram" value={provider.telegram ? <a href={`https://t.me/${provider.telegram}`} target="_blank" rel="noopener noreferrer">@{provider.telegram}</a> : "—"} />
        <InfoRow label="Sitio Web" value={provider.website ? <a href={provider.website} target="_blank" rel="noopener noreferrer">{provider.website}</a> : "—"} />
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Bio</h3>
        <p className={styles.bioText}>{provider.bio || "Sin biografía"}</p>
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Rango de Precios</h3>
        {prices.length > 0 ? (
          <p>{formatMoney(minPrice)} — {formatMoney(maxPrice)}</p>
        ) : (
          <p>No hay servicios registrados</p>
        )}
      </div>
    </div>
  );
}

function KycTab({
  provider, onApprove, onReject, onRequestUpdate, onSuspend, onReactivate, actionLoading, isLoading,
}: {
  provider: NonNullProvider;
  onApprove: () => void;
  onReject: () => void;
  onRequestUpdate: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  actionLoading: string | null;
  isLoading: boolean;
}) {
  const canApprove = provider.kycStatus === "SUBMITTED" || provider.kycStatus === "IN_PROGRESS";
  const canReject = provider.kycStatus !== "REJECTED" && provider.kycStatus !== "APPROVED";
  const canSuspend = provider.status === "ACTIVE";

  return (
    <div className={styles.tabPanel}>
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Estado KYC</h3>
        <InfoRow label="Estado KYC" value={<StatusBadge status={provider.kycStatus} size="sm" />} />
        <InfoRow label="Estado Proveedor" value={<StatusBadge status={provider.status} size="sm" />} />
        <InfoRow label="Enviado" value={formatDateTime(provider.kycSubmittedAt)} />
        <InfoRow label="Aprobado" value={formatDateTime(provider.kycApprovedAt)} />
        {provider.kycRejectionReason && (
          <InfoRow label="Motivo Rechazo" value={<span className={styles.rejectionText}>{provider.kycRejectionReason}</span>} />
        )}
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Documentos</h3>
        <InfoRow label="Documento ID" value={provider.idDocumentUrl ? <a href={provider.idDocumentUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>Ver documento</a> : "—"} />
        <InfoRow label="Documento ID (Reverso)" value={provider.idDocumentBackUrl ? <a href={provider.idDocumentBackUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>Ver documento</a> : "—"} />
        <InfoRow label="Selfie con ID" value={provider.selfieWithIdUrl ? <a href={provider.selfieWithIdUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>Ver foto</a> : "—"} />
        <InfoRow label="Título Profesional" value={provider.professionalTitleUrl && provider.professionalTitleUrl.length > 0 ? <a href={provider.professionalTitleUrl[0]} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>Ver título</a> : "—"} />
        <InfoRow label="Foto de Perfil" value={provider.profilePhotoUrl ? <a href={provider.profilePhotoUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>Ver foto</a> : "—"} />
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Acciones</h3>
        <div className={styles.actionButtons}>
          {canApprove && (
            <button type="button" className={styles.btnPrimary} onClick={onApprove} disabled={isLoading}>
              {actionLoading === "approve" ? "Aprobando..." : "Aprobar KYC"}
            </button>
          )}
          {canReject && (
            <button type="button" className={styles.btnDanger} onClick={onReject} disabled={isLoading}>
              {actionLoading === "reject" ? "Rechazando..." : "Rechazar"}
            </button>
          )}
          <button type="button" className={styles.btnWarning} onClick={onRequestUpdate} disabled={isLoading}>
            {actionLoading === "requestUpdate" ? "Enviando..." : "Solicitar Actualización"}
          </button>
          {canSuspend && (
            <button type="button" className={styles.btnDanger} onClick={onSuspend} disabled={isLoading}>
              {actionLoading === "suspend" ? "Suspendiendo..." : "Suspender"}
            </button>
          )}
          {provider.status === "SUSPENDED_TEMP" || provider.status === "SUSPENDED_PERM" ? (
            <button type="button" className={styles.btnPrimary} onClick={onReactivate} disabled={isLoading}>
              {actionLoading === "reactivate" ? "Reactivando..." : "Reactivar"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ServiciosTab({ services }: { services: ServiceListing[] }) {
  if (services.length === 0) {
    return <div className={styles.tabPanel}><p className={styles.emptyText}>No hay servicios registrados.</p></div>;
  }

  return (
    <div className={styles.tabPanel}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Modalidad</th>
              <th>Duración</th>
              <th>Precio Público</th>
              <th>Precio Miembro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td><StatusBadge status={s.category} size="sm" /></td>
                <td><StatusBadge status={s.modality} size="sm" /></td>
                <td>{s.duration} min</td>
                <td>{formatMoney(s.publicPrice)}</td>
                <td>{formatMoney(s.memberPrice)}</td>
                <td><StatusBadge status={s.isActive ? "ACTIVE" : "INACTIVE"} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CitasTab({ appointments }: { appointments: Appointment[] }) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = appointments.filter((a) =>
    !search ||
    (a.client?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.service?.name || "").toLowerCase().includes(search.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 5);

  if (appointments.length === 0) {
    return <div className={styles.tabPanel}><p className={styles.emptyText}>No hay citas registradas.</p></div>;
  }

  return (
    <div className={styles.tabPanel}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Citas ({appointments.length})</h3>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por cliente o servicio..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Fecha Solicitud</th>
              <th>Fecha Confirmada</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={6} className={styles.emptyText}>Sin resultados</td></tr>
            ) : (
              displayed.map((a) => (
                <tr key={a.id}>
                  <td>{a.client?.name || "—"}</td>
                  <td>{a.service?.name || "—"}</td>
                  <td><StatusBadge status={a.status} size="sm" /></td>
                  <td><StatusBadge status={a.paymentStatus || "PENDING"} size="sm" /></td>
                  <td>{formatDateTime(a.createdAt)}</td>
                  <td>{formatDateTime(a.confirmedDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 5 && (
        <button type="button" className={styles.showMoreBtn} onClick={() => setShowAll(!showAll)}>
          {showAll ? "Mostrar menos" : `Mostrar más (${filtered.length - 5} restantes)`}
        </button>
      )}
    </div>
  );
}

function ResenasTab({ providerReviews, clientReviews }: { providerReviews: ProviderReview[]; clientReviews: ClientReview[] }) {
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [showAllClients, setShowAllClients] = useState(false);

  const displayedProviderReviews = showAllProviders ? providerReviews : providerReviews.slice(0, 5);
  const displayedClientReviews = showAllClients ? clientReviews : clientReviews.slice(0, 5);

  return (
    <div className={styles.tabPanel}>
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Reseñas Recibidas ({providerReviews.length})</h3>
        {providerReviews.length === 0 ? (
          <p className={styles.emptyText}>No hay reseñas recibidas.</p>
        ) : (
          <>
            {displayedProviderReviews.map((r) => (
              <div key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <strong>{r.client?.name || "Anónimo"}</strong>
                  <span className={styles.rating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className={styles.reviewComment}>{r.comment}</p>
                <span className={styles.reviewMeta}>{formatDate(r.createdAt)} &middot; {r.service?.name || ""}</span>
                <span className={styles.reviewBadge}>{r.isVisible ? "Visible" : "Oculta"}</span>
              </div>
            ))}
            {providerReviews.length > 5 && (
              <button type="button" className={styles.showMoreBtn} onClick={() => setShowAllProviders(!showAllProviders)}>
                {showAllProviders ? "Mostrar menos" : `Mostrar más (${providerReviews.length - 5} restantes)`}
              </button>
            )}
          </>
        )}
      </div>

      {clientReviews.length > 0 && (
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Reseñas Emitidas ({clientReviews.length})</h3>
          {displayedClientReviews.map((r) => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <strong>{r.client?.name || "—"}</strong>
                <span className={styles.rating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p className={styles.reviewComment}>{r.comment}</p>
              <span className={styles.reviewMeta}>{formatDate(r.createdAt)}</span>
              <span className={styles.reviewBadge}>{r.isVisible ? "Visible" : "Oculta"}</span>
            </div>
          ))}
          {clientReviews.length > 5 && (
            <button type="button" className={styles.showMoreBtn} onClick={() => setShowAllClients(!showAllClients)}>
              {showAllClients ? "Mostrar menos" : `Mostrar más (${clientReviews.length - 5} restantes)`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DeudaTab({ settlements }: { settlements: DebtSettlementType[] }) {
  if (settlements.length === 0) {
    return <div className={styles.tabPanel}><p className={styles.emptyText}>No hay historial de liquidaciones de deuda.</p></div>;
  }

  return (
    <div className={styles.tabPanel}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Deuda Anterior</th>
              <th>Nueva Deuda</th>
              <th>Estado</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((s) => (
              <tr key={s.id}>
                <td>{formatDateTime(s.settlementDate)}</td>
                <td>{formatMoney(s.amount)}</td>
                <td><StatusBadge status={s.paymentMethod} size="sm" /></td>
                <td>{formatMoney(s.previousDebt)}</td>
                <td>{formatMoney(s.newDebt)}</td>
                <td><StatusBadge status={s.status} size="sm" /></td>
                <td>{s.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdvertenciasTab({ warnings, providerId, onWarningIssued }: { warnings: ProviderWarning[]; providerId: string; onWarningIssued: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: "INFO", reason: "", details: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleIssueWarning() {
    if (!formData.reason.trim()) return;
    setSubmitting(true);
    try {
      const { issueProviderWarning } = await import("@/lib/actions/service-provider");
      await issueProviderWarning(providerId, formData.type as any, formData.reason.trim(), formData.details.trim() || undefined);
      setShowForm(false);
      setFormData({ type: "INFO", reason: "", details: "" });
      onWarningIssued();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al emitir advertencia");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.tabPanel}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Advertencias ({warnings.length})</h3>
        {!showForm && (
          <button type="button" className={styles.btnPrimary} onClick={() => setShowForm(true)}>
            Emitir Advertencia
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.sectionCard}>
          <h4>Nueva Advertencia</h4>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Tipo</label>
            <select
              className={styles.fieldInput}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="INFO">Informativa</option>
              <option value="WARNING">Amonestación</option>
              <option value="SUSPENSION_TEMP">Suspensión Temp.</option>
              <option value="SUSPENSION_PERM">Suspensión Perm.</option>
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Motivo</label>
            <input
              className={styles.fieldInput}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Motivo de la advertencia"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Detalles (opcional)</label>
            <textarea
              className={styles.fieldInput}
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Detalles adicionales..."
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={() => setShowForm(false)}>Cancelar</button>
            <button type="button" className={styles.btnDanger} onClick={handleIssueWarning} disabled={submitting || !formData.reason.trim()}>
              {submitting ? "Emitiendo..." : "Emitir Advertencia"}
            </button>
          </div>
        </div>
      )}

      {warnings.length === 0 ? (
        <p className={styles.emptyText}>No hay advertencias.</p>
      ) : (
        <div className={styles.warningsList}>
          {warnings.map((w) => (
            <div key={w.id} className={`${styles.warningCard} ${styles[`warning_${w.type}`] || ""}`}>
              <div className={styles.warningHeader}>
                <StatusBadge status={w.type} size="sm" />
                <span className={styles.warningDate}>{formatDateTime(w.issuedAt)}</span>
              </div>
              <p className={styles.warningReason}>{w.reason}</p>
              {w.details && <p className={styles.warningDetails}>{w.details}</p>}
              {w.resolvedAt && (
                <p className={styles.warningResolved}>Resuelta: {formatDateTime(w.resolvedAt)}{w.resolutionNotes ? ` — ${w.resolutionNotes}` : ""}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HorarioTab({ schedules, blockedDates }: { schedules: ProviderSchedule[]; blockedDates: ProviderBlockedDate[] }) {
  return (
    <div className={styles.tabPanel}>
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Horario Semanal</h3>
        {schedules.length === 0 ? (
          <p className={styles.emptyText}>No hay horario configurado.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Duración</th>
                  <th>Descanso</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td>{DAY_NAMES[s.dayOfWeek] || s.dayOfWeek}</td>
                    <td>{s.startTime}</td>
                    <td>{s.endTime}</td>
                    <td>{s.slotDurationMinutes} min</td>
                    <td>{s.breakStart && s.breakEnd ? `${s.breakStart} - ${s.breakEnd}` : "—"}</td>
                    <td><StatusBadge status={s.isActive ? "ACTIVE" : "INACTIVE"} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Fechas Bloqueadas</h3>
        {blockedDates.length === 0 ? (
          <p className={styles.emptyText}>No hay fechas bloqueadas.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {blockedDates.map((b) => (
                  <tr key={b.id}>
                    <td>{formatDate(b.date)}</td>
                    <td>{b.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
