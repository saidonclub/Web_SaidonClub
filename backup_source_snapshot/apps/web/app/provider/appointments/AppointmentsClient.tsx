/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// ============================================================
// MODULE:     app/provider/appointments/AppointmentsClient
// PURPOSE:    Interfaz interactiva de gestión de citas — Client Component
// ============================================================

import { useState, useMemo } from 'react';
import { QrCode, CheckCircle, Clock, XCircle, Calendar, Search, AlertTriangle } from 'lucide-react';
import styles from './appointments.module.css';
import type { SerializableAppointment } from './page';
import { verifyAppointmentByQR, startAppointment } from '@/lib/actions/appointment';
import { useRouter } from 'next/navigation';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusIcon(status: string) {
  switch (status) {
    case 'SOLICITADA':
    case 'PENDING_PROVIDER':
    case 'PENDING_CLIENT':
      return <Clock className={styles.statusIconYellow} />;
    case 'CONFIRMADA':
      return <CheckCircle className={styles.statusIconBlue} />;
    case 'COMPLETADA':
      return <CheckCircle className={styles.statusIconGreen} />;
    case 'CANCELADA':
    case 'NO_SHOW':
      return <XCircle className={styles.statusIconRed} />;
    case 'IN_PROGRESS':
      return <AlertTriangle className={styles.statusIconOrange} />;
    default:
      return <Clock className={styles.statusIconGray} />;
  }
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_PROVIDER: 'Pendiente Proveedor',
  PENDING_CLIENT: 'Pendiente Cliente',
  CONFIRMADA: 'Confirmada',
  IN_PROGRESS: 'En Progreso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
  NO_SHOW: 'No se presentó',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  appointments: SerializableAppointment[];
}

export default function AppointmentsClient({ appointments }: Props) {
  const [scanMode, setScanMode] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [verifiedAppointment, setVerifiedAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ── Derived list ────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.service.name.toLowerCase().includes(q) ||
        (a.client.name ?? '').toLowerCase().includes(q) ||
        a.client.email.toLowerCase().includes(q) ||
        (a.qrCode ?? '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [appointments, filterStatus, search]);

  // ── QR scan ─────────────────────────────────────────────────────────────────

  const handleScanQR = async () => {
    if (!qrInput.trim()) return;
    setLoading(true);
    setScanResult(null);
    setVerifiedAppointment(null);

    try {
      const result = await verifyAppointmentByQR(qrInput.trim());
      if (result.success) {
        setVerifiedAppointment(result.appointment);
        setScanResult(null);
      } else {
        setScanResult(`❌ ${result.error}`);
      }
    } catch (error) {
      setScanResult('❌ Error al verificar el código QR.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAppointment = async (id: string) => {
    setLoading(true);
    try {
      await startAppointment(id);
      setScanMode(false);
      setVerifiedAppointment(null);
      setQrInput('');
      router.refresh();
    } catch (error) {
      alert('Error al iniciar la cita');
    } finally {
      setLoading(false);
    }
  };

  // ── Counts ──────────────────────────────────────────────────────────────────

  const pending = appointments.filter((a) =>
    ['PENDING_PROVIDER', 'PENDING_CLIENT'].includes(a.status),
  ).length;
  const confirmed = appointments.filter((a) =>
    ['CONFIRMADA', 'IN_PROGRESS'].includes(a.status),
  ).length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Citas</h1>
          <p className={styles.subtitle}>
            {appointments.length} citas en total · {pending} pendientes · {confirmed} activas
          </p>
        </div>
        <button
          className={`${styles.scanButton} ${scanMode ? styles.scanButtonActive : ''}`}
          onClick={() => { setScanMode(!scanMode); setScanResult(null); setQrInput(''); }}
        >
          <QrCode size={18} />
          {scanMode ? 'Cerrar Escáner' : 'Escanear QR'}
        </button>
      </header>

      {/* QR Scanner */}
      {scanMode && (
        <section className={styles.scanSection}>
          <div className={styles.scanner}>
            <QrCode size={48} />
            <p>Ingresa el código QR del cliente</p>
            <div className={styles.scanInput}>
              <input
                id="qr-input"
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScanQR()}
                placeholder="Código QR..."
                autoFocus
                disabled={loading}
              />
              <button onClick={handleScanQR} disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>

            {verifiedAppointment && (
              <div className={styles.verifiedCard}>
                <div className={styles.verifiedHeader}>
                  <CheckCircle className={styles.statusIconGreen} />
                  <h4>Cita Verificada</h4>
                </div>
                <div className={styles.verifiedDetails}>
                  <p><strong>Servicio:</strong> {verifiedAppointment.serviceName}</p>
                  <p><strong>Cliente:</strong> {verifiedAppointment.clientName}</p>
                  {verifiedAppointment.beneficiaryName && (
                    <p><strong>Beneficiario:</strong> {verifiedAppointment.beneficiaryName}</p>
                  )}
                  <p><strong>Estado:</strong> {STATUS_LABELS[verifiedAppointment.status] || verifiedAppointment.status}</p>
                </div>
                {verifiedAppointment.status === 'CONFIRMADA' && (
                  <button
                    className={styles.startButton}
                    onClick={() => handleStartAppointment(verifiedAppointment.id)}
                    disabled={loading}
                  >
                    Iniciar Servicio Ahora
                  </button>
                )}
              </div>
            )}

            {scanResult && (
              <p className={styles.scanResult}>{scanResult}</p>
            )}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className={styles.filtersBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} />
          <input
            id="appointments-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, servicio o QR..."
            className={styles.searchInput}
          />
        </div>
        <select
          id="appointments-filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.statusFilter}
        >
          <option value="all">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </section>

      {/* List */}
      <section className={styles.appointmentsList}>
        <h2 className={styles.sectionTitle}>
          <Calendar size={18} />
          Citas Programadas
          {filtered.length !== appointments.length && (
            <span className={styles.filterBadge}>{filtered.length} de {appointments.length}</span>
          )}
        </h2>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Calendar size={48} />
            <p>{appointments.length === 0
              ? 'No tienes citas programadas'
              : 'No hay citas que coincidan con el filtro'}
            </p>
            <span>
              {appointments.length === 0
                ? 'Las citas aparecerán aquí cuando los clientes reserven tus servicios'
                : 'Prueba cambiando los filtros de búsqueda'}
            </span>
          </div>
        ) : (
          <div className={styles.appointmentsGrid}>
            {filtered.map((apt) => (
              <div key={apt.id} className={styles.appointmentCard}>
                <div className={styles.appointmentHeader}>
                  {getStatusIcon(apt.status)}
                  <span className={styles.appointmentStatus}>
                    {STATUS_LABELS[apt.status] ?? apt.status}
                  </span>
                  {apt.isEmergency && (
                    <span className={styles.emergencyBadge}>🚨 Urgente</span>
                  )}
                </div>
                <h3>{apt.service.name}</h3>
                <p className={styles.clientInfo}>
                  {apt.client.name ?? apt.client.email}
                </p>
                {apt.beneficiary && (
                  <p className={styles.beneficiaryInfo}>
                    Beneficiario: {apt.beneficiary.name}
                  </p>
                )}
                <div className={styles.appointmentTime}>
                  <Clock size={14} />
                  {apt.scheduledAt
                    ? new Date(apt.scheduledAt).toLocaleString('es-VE')
                    : apt.requestedDate
                      ? `${new Date(apt.requestedDate).toLocaleDateString('es-VE')}${apt.requestedTimeSlot ? ` · ${apt.requestedTimeSlot}` : ''}`
                      : 'Fecha por confirmar'}
                </div>

                <div className={styles.appointmentTotal}>
                  Total: <strong>${apt.totalCharged.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

