// ============================================================
// MODULE:     app/admin/users/page
// PURPOSE:    Gestión de usuarios del sistema
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';
import styles from './users.module.css';

export default async function AdminUsersPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.VIEW_ALL_USERS)) {
    redirect('/dashboard');
  }

  const [users, stats] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: { referrals: true },
        },
      },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.user.count({ where: { status: 'PENDING_APPROVAL' } }),
    ]),
  ]);

  const [total, active, suspended, pending] = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>
            Administra todos los usuarios del sistema
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total Usuarios"
          value={total}
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="Usuarios Activos"
          value={active}
          icon={<UserCheck size={20} />}
          color="green"
        />
        <StatCard
          title="Suspendidos"
          value={suspended}
          icon={<UserX size={20} />}
          color="red"
        />
        <StatCard
          title="Pendientes"
          value={pending}
          icon={<UserPlus size={20} />}
          color="yellow"
        />
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Lista de Usuarios</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Referidos</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                        </div>
                        <span>{u.name || '-'}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`${styles.role} ${styles[`role${u.role}`]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={u.status} size="sm" />
                    </td>
                    <td>{u._count.referrals}</td>
                    <td>{u.createdAt.toLocaleDateString()}</td>
                    <td>
                      <Link
                        href={`/admin/users/${u.id}`}
                        className={styles.actionLink}
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
