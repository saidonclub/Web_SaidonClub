import React from 'react';
import { redirect } from 'next/navigation';
import { Calendar, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getMyAppointments } from '@/lib/actions/appointment';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import styles from './Citas.module.css';

export default async function CitasPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getUser();
  const { tab = 'todas' } = await searchParams;

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch all appointments for stats
  const allAppointments = await getMyAppointments({ role: 'client' });
  
  // Filtering logic
  const now = new Date();
  let appointments = [...allAppointments];
  
  if (tab === 'proximas') {
    appointments = allAppointments.filter(a => 
      ['PENDING_PROVIDER', 'SOLICITADA', 'CONFIRMADA', 'POR_ATENDER', 'IN_PROGRESS'].includes(a.status) &&
      a.requestedDate && new Date(a.requestedDate) >= new Date(now.setHours(0,0,0,0))
    );
  } else if (tab === 'pasadas') {
    appointments = allAppointments.filter(a => 
      ['COMPLETADA', 'CANCELLED_CLIENT', 'CANCELLED_PROVIDER', 'CANCELADA'].includes(a.status) ||
      a.requestedDate && new Date(a.requestedDate) < new Date(now.setHours(0,0,0,0))
    );
  }

  // Stats calculation (always from allAppointments)
  const pendingCount = allAppointments.filter(a => a.status === 'PENDING_PROVIDER' || a.status === 'SOLICITADA').length;
  const confirmedCount = allAppointments.filter(a => a.status === 'CONFIRMADA' || a.status === 'POR_ATENDER').length;
  const completedCount = allAppointments.filter(a => a.status === 'COMPLETADA').length;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING_PROVIDER':
      case 'SOLICITADA':
        return styles.statusPending;
      case 'CONFIRMADA':
      case 'POR_ATENDER':
        return styles.statusConfirmed;
      case 'COMPLETADA':
        return styles.statusCompleted;
      case 'CANCELLED_CLIENT':
      case 'CANCELLED_PROVIDER':
      case 'CANCELADA':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING_PROVIDER': 'Pendiente Proveedor',
      'SOLICITADA': 'Solicitada',
      'CONFIRMADA': 'Confirmada',
      'POR_ATENDER': 'Por Atender',
      'COMPLETADA': 'Completada',
      'CANCELLED_CLIENT': 'Cancelada (Tú)',
      'CANCELLED_PROVIDER': 'Cancelada (Proveedor)',
      'CANCELADA': 'Cancelada',
      'IN_PROGRESS': 'En Progreso',
    };
    return labels[status] || status;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Citas Médicas</h1>
          <p style={{ color: 'var(--clr-text-muted)', marginTop: '0.5rem' }}>
            Gestiona tus citas programadas y el historial de tus atenciones.
          </p>
        </div>
        <Link href="/productos?category=Salud" className={styles.btnPrimary} style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
          Nueva Cita
        </Link>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(255, 165, 0, 0.1)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span className={styles.statValue}>{pendingCount}</span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(0, 200, 0, 0.1)' }}>
            <Calendar size={24} />
          </div>
          <div>
            <span className={styles.statValue}>{confirmedCount}</span>
            <span className={styles.statLabel}>Confirmadas</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(0, 100, 255, 0.1)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className={styles.statValue}>{completedCount}</span>
            <span className={styles.statLabel}>Historial</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabs}>
        <Link href="/dashboard/citas?tab=todas" className={`${styles.tab} ${tab === 'todas' ? styles.tabActive : ''}`}>Todas</Link>
        <Link href="/dashboard/citas?tab=proximas" className={`${styles.tab} ${tab === 'proximas' ? styles.tabActive : ''}`}>Próximas</Link>
        <Link href="/dashboard/citas?tab=pasadas" className={`${styles.tab} ${tab === 'pasadas' ? styles.tabActive : ''}`}>Pasadas</Link>
      </div>


      {/* Appointments List */}
      <div className={styles.content}>
        {appointments.length > 0 ? (
          <div className={styles.appointmentList}>
            {appointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.serviceIcon}>
                  <AlertCircle size={24} />
                </div>
                
                <div className={styles.info}>
                  <h3 className={styles.serviceName}>{appointment.service.name}</h3>
                  <div className={styles.providerName}>
                    <User size={14} />
                    {appointment.provider.user.name}
                    {appointment.beneficiary && (
                      <span style={{ fontSize: '0.8rem', background: 'var(--clr-surface-elevated)', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>
                        Para: {appointment.beneficiary.firstName}
                      </span>
                    )}
                  </div>
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      {appointment.requestedDate ? new Date(appointment.requestedDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) : 'N/A'}
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      {appointment.requestedTimeSlot}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                  <span className={`${styles.status} ${getStatusClass(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                  <div className={styles.actions}>
                    <Link href={`/dashboard/citas/${appointment.id}`} className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
                      Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--clr-surface-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--clr-border-subtle)' }}>
            <Calendar size={48} color="var(--clr-text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--clr-text-primary)' }}>No tienes citas programadas</h3>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>Solicita tu primera atención médica desde el marketplace.</p>
            <Link href="/productos?category=Salud" className={styles.btnPrimary} style={{ textDecoration: 'none', display: 'inline-block' }}>
              Ver Servicios de Salud
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
