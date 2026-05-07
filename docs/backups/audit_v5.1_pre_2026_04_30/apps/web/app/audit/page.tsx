// ============================================================
// MODULE:     app/admin/audit/page
// PURPOSE:    Logs de auditoría
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { FileText } from 'lucide-react';
import styles from './audit.module.css';

export default async function AdminAuditPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.VIEW_AUDIT_LOGS)) {
    redirect('/dashboard');
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Auditoría</h1>
          <p className={styles.subtitle}>
            Registro de todas las acciones administrativas
          </p>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Logs de Auditoría</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Entidad</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No hay logs de auditoría
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.createdAt.toLocaleString()}</td>
                      <td>{log.userId || '-'}</td>
                      <td>
                        <span className={`${styles.action} ${styles[`action${log.action}`]}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>{log.entityType}</td>
                      <td className={styles.details}>
                        {log.entityId ? `ID: ${log.entityId.slice(0, 8)}...` : '-'}
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
