// ============================================================
// MODULE:     app/admin/kyc/page
// PURPOSE:    Verificación KYC de usuarios
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from './kyc.module.css';

export default async function AdminKYCPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_KYC)) {
    redirect('/dashboard');
  }

  const [kycList, stats] = await Promise.all([
    prisma.kYC.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true, phone: true },
        },
      },
    }),
    Promise.all([
      prisma.kYC.count(),
      prisma.kYC.count({ where: { status: 'APROBADO' } }),
      prisma.kYC.count({ where: { status: 'EN_REVISION' } }),
      prisma.kYC.count({ where: { status: 'RECHAZADO' } }),
    ]),
  ]);

  const [total, approved, inReview, rejected] = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Verificación KYC</h1>
          <p className={styles.subtitle}>
            Revisa y aprueba documentos de identidad de usuarios
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total Solicitudes"
          value={total}
          icon={<Shield size={20} />}
          color="blue"
        />
        <StatCard
          title="Aprobados"
          value={approved}
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatCard
          title="En Revisión"
          value={inReview}
          icon={<Clock size={20} />}
          color="yellow"
        />
        <StatCard
          title="Rechazados"
          value={rejected}
          icon={<XCircle size={20} />}
          color="red"
        />
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Lista de Solicitudes KYC</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Tipo Documento</th>
                  <th>Número</th>
                  <th>Nivel</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {kycList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.empty}>
                      No hay solicitudes KYC
                    </td>
                  </tr>
                ) : (
                  kycList.map((kyc) => (
                    <tr key={kyc.id}>
                      <td>{kyc.user?.name || '-'}</td>
                      <td>{kyc.user?.email}</td>
                      <td>{kyc.documentType || '-'}</td>
                      <td>{kyc.documentNumber || '-'}</td>
                      <td>Nivel {kyc.level}</td>
                      <td>
                        <StatusBadge status={kyc.status} size="sm" />
                      </td>
                      <td>{kyc.createdAt.toLocaleDateString()}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.actionLink}>Revisar</button>
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
    </div>
  );
}
