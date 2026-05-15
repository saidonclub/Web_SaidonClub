import React from 'react';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  Activity, 
  CreditCard, 
  ShieldCheck,
  MapPin,
  AlertCircle,
  FileText
} from 'lucide-react';
import { getAppointment } from '@/lib/actions/appointment';
import { getUser } from '@/lib/auth';
import styles from './CitaDetalle.module.css';
import CitaActions from './CitaActions';
import CitaQRCode from './CitaQRCode';

interface CitaDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CitaDetailPage({ params }: CitaDetailPageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  let appointment;
  try {
    appointment = await getAppointment(id);
   } catch (_error) {
     notFound();
   }

  // Double check permissions (client or provider)
  if (appointment.clientId !== user.id && appointment.providerId !== user.id) {
    redirect('/dashboard/citas');
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING_PROVIDER': 'Pendiente Proveedor',
      'SOLICITADA': 'Solicitada',
      'CONFIRMADA': 'Confirmada',
      'POR_ATENDER': 'Por Atender',
      'COMPLETADA': 'Completada',
      'CANCELLED_CLIENT': 'Cancelada por ti',
      'CANCELLED_PROVIDER': 'Cancelada por Proveedor',
      'CANCELADA': 'Cancelada',
      'IN_PROGRESS': 'En Progreso',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING_PROVIDER':
      case 'SOLICITADA':
        return styles.pending;
      case 'CONFIRMADA':
      case 'POR_ATENDER':
        return styles.confirmed;
      case 'COMPLETADA':
        return styles.completed;
      case 'CANCELLED_CLIENT':
      case 'CANCELLED_PROVIDER':
      case 'CANCELADA':
        return styles.cancelled;
      case 'IN_PROGRESS':
        return styles.in_progress;
      default:
        return '';
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Fecha no especificada";
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <Link href="/dashboard/citas" className={styles.backBtn}>
        <ChevronLeft size={16} />
        Volver a mis citas
      </Link>

      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.idLabel}>CITA #{appointment.id.slice(-8).toUpperCase()}</span>
          <h1>Detalles de la Cita</h1>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={16} />
              {formatDate(appointment.requestedDate)}
            </div>
            <div className={styles.metaItem}>
              <Clock size={16} />
              {appointment.requestedTimeSlot}
            </div>
          </div>
        </div>

        <div className={styles.statusWrapper}>
          <span className={`${styles.statusBadge} ${getStatusClass(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
          </span>
          {appointment.isEmergency && (
            <span style={{ color: 'var(--clr-error)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} /> EMERGENCIA
            </span>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          {/* Service Info */}
          <div className={styles.card}>
            <h2>
              <Activity size={20} color="var(--clr-orange)" />
              Servicio Solicitado
            </h2>
            <div className={styles.serviceInfo}>
              <div className={styles.serviceIcon}>
                <ShieldCheck size={32} />
              </div>
              <div className={styles.serviceDetails}>
                <span className={styles.categoryBadge}>{appointment.service.category}</span>
                <h3>{appointment.service.name}</h3>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>{appointment.service.description?.slice(0, 150)}...</p>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className={styles.card}>
            <h2>
              <User size={20} color="var(--clr-orange)" />
              Información del Proveedor
            </h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Nombre</span>
                <span className={styles.infoValue}>{appointment.provider.user.name}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Teléfono</span>
                <span className={styles.infoValue}>{appointment.provider.user.phone || 'No disponible'}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{appointment.provider.user.email}</span>
              </div>
            </div>
          </div>

          {/* Beneficiary Info if exists */}
          {appointment.beneficiary && (
            <div className={styles.card}>
              <h2>
                <ShieldCheck size={20} color="var(--clr-orange)" />
                Beneficiario
              </h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>Nombre Completo</span>
                  <span className={styles.infoValue}>{appointment.beneficiary.firstName} {appointment.beneficiary.lastName}</span>
                </div>
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>Parentesco</span>
                  <span className={styles.infoValue}>{appointment.beneficiary.relationship || 'No especificado'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Client Notes */}
          {appointment.clientNotes && (
            <div className={styles.card}>
              <h2>
                <FileText size={20} color="var(--clr-orange)" />
                Tus Notas / Síntomas
              </h2>
              <p style={{ color: 'var(--clr-text-primary)', whiteSpace: 'pre-wrap' }}>{appointment.clientNotes}</p>
            </div>
          )}

          {/* Provider Notes if exists */}
          {appointment.providerNotes && (
            <div className={styles.card} style={{ borderLeft: '4px solid var(--clr-primary)' }}>
              <h2>
                <AlertCircle size={20} color="var(--clr-primary)" />
                Notas del Proveedor
              </h2>
              <p style={{ color: 'var(--clr-text-primary)', whiteSpace: 'pre-wrap' }}>{appointment.providerNotes}</p>
            </div>
          )}

          {/* Timeline / Audit Log */}
          <div className={styles.card}>
            <h2>
              <Clock size={20} color="var(--clr-orange)" />
              Línea de Tiempo
            </h2>
            <div className={styles.timeline}>
              {appointment.auditLog.map((log: { id: string; toStatus: string; createdAt: Date; reason?: string | null }, index: number) => (
                <div key={log.id} className={`${styles.timelineItem} ${index === appointment.auditLog.length - 1 ? styles.timelineItemActive : ''}`}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineTitle}>{getStatusLabel(log.toStatus)}</span>
                    <span className={styles.timelineDate}>
                      {new Date(log.createdAt).toLocaleString('es-ES', { 
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                    {log.reason && <span className={styles.timelineReason}>{'\u201C'}{log.reason}{'\u201D'}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          {/* QR Code Card if confirmed/por_atender */}
          {['CONFIRMADA', 'POR_ATENDER', 'IN_PROGRESS', 'COMPLETADA'].includes(appointment.status) && appointment.qrCode && (
            <div className={styles.card}>
              <h2>
                <ShieldCheck size={20} color="var(--clr-orange)" />
                Pase de Atención
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
                Presenta este código al momento de tu cita para validar la atención.
              </p>
              <CitaQRCode value={appointment.qrCode} />
            </div>
          )}

          {/* Payment Summary */}
          <div className={styles.card}>
            <h2>
              <CreditCard size={20} color="var(--clr-orange)" />
              Resumen de Pago
            </h2>
            <div className={styles.summary}>
              <div className={styles.summaryLine}>
                <span>Precio Base</span>
                <span>${Number(appointment.appliedPublicPrice).toFixed(2)}</span>
              </div>
              {Number(appointment.appliedMemberPrice) < Number(appointment.appliedPublicPrice) && user.membershipType !== 'FREE' && (
                <div className={styles.summaryLine}>
                  <span style={{ color: 'var(--clr-primary)' }}>Descuento Miembro</span>
                  <span style={{ color: 'var(--clr-primary)' }}>-${(Number(appointment.appliedPublicPrice) - Number(appointment.appliedMemberPrice)).toFixed(2)}</span>
                </div>
              )}
              <div className={styles.summaryLine}>
                <span>IVA ({Number(appointment.appliedIvaPercentage)}%)</span>
                <span>${Number(appointment.ivaAmount).toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryLine} ${styles.total}`}>
                <span>Total</span>
                <span>${Number(appointment.totalCharged).toFixed(2)}</span>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 165, 0, 0.05)', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                <strong>Estado:</strong> {appointment.paymentStatus === 'COMPLETED' ? 'Pagado' : 'Pendiente de Pago'}
              </div>

              <CitaActions 
              appointmentId={appointment.id} 
              status={appointment.status} 
              isProvider={appointment.provider.userId === user.id}
            />
            </div>
          </div>

          <div className={styles.card}>
            <h2>
              <MapPin size={20} color="var(--clr-orange)" />
              Ubicación
            </h2>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Sede de Atención</span>
              <span className={styles.infoValue}>{appointment.provider.address || 'Consultorio Principal'}</span>
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.provider.address || 'Consultorio Principal')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.backBtn} 
              style={{ 
                marginTop: '1rem', 
                width: '100%', 
                justifyContent: 'center', 
                border: '1px solid var(--clr-border-glass)', 
                borderRadius: '8px', 
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <MapPin size={16} />
              Ver en Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
