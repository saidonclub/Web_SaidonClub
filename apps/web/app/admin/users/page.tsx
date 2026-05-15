// ============================================================
// MODULE:     app/admin/users/page
// PURPOSE:    Gestión de usuarios del sistema
// ============================================================

import { prisma, Prisma, UserRole, UserStatus } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Users, UserPlus, UserCheck, UserX, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './users.module.css';

export const dynamic = "force-dynamic";

async function UsersContent({ searchParams }: { searchParams: Promise<{ search?: string; role?: string; status?: string }> }) {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const currentUserRole = user.role as Role;
  if (!hasPermission(currentUserRole, Permission.VIEW_ALL_USERS)) {
    redirect('/dashboard');
  }

  const { search, role, status } = await searchParams;

   // Construir filtros de Prisma
   const where: Prisma.UserWhereInput = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role as UserRole;
  if (status) where.status = status as UserStatus;

  const [users, stats] = await Promise.all([
    prisma.user.findMany({
      where,
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

      {/* Filtros */}
      <section className={styles.filterSection}>
        <form className={styles.filterForm}>
          <div className={styles.searchGroup}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              name="search"
              placeholder="Buscar por email o nombre..."
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.selectGroup}>
            <Filter className={styles.filterIcon} size={18} />
            <select
              name="role"
              defaultValue={role}
              className={styles.selectInput}
            >
              <option value="">Todos los Roles</option>
              {Object.values(Role).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <Filter className={styles.filterIcon} size={18} />
            <select
              name="status"
              defaultValue={status}
              className={styles.selectInput}
            >
              <option value="">Todos los Estados</option>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="SUSPENDED">Suspendido</option>
              <option value="PENDING_APPROVAL">Pendiente</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.filterBtn}>
              Filtrar
            </button>
            {(search || role || status) && (
              <Link href="/admin/users" className={styles.clearBtn}>
                Limpiar
              </Link>
            )}
          </div>
        </form>
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>👥</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--clr-text-primary)' }}>
                          No se encontraron usuarios
                        </h3>
                        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                          {search || role || status ? 'Ningún usuario coincide con los filtros aplicados.' : 'Aún no hay usuarios registrados en el sistema.'}
                        </p>
                        {(search || role || status) && (
                          <a href="/admin/users" style={{ color: 'var(--clr-orange)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                            Limpiar filtros
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                  <tr key={u.id}>
                    <td data-label="Usuario">
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                        </div>
                        <span>{u.name || '-'}</span>
                      </div>
                    </td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Rol">
                      <span className={`${styles.role} ${styles[`role${u.role}`]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td data-label="Estado">
                      <StatusBadge status={u.status} size="sm" />
                    </td>
                    <td data-label="Referidos">{u._count.referrals}</td>
                    <td data-label="Fecha Registro">{u.createdAt.toLocaleDateString()}</td>
                    <td data-label="Acciones">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className={styles.actionLink}
                      >
                        Ver
                      </Link>
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

function LoadingSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.loading}>Cargando...</div>
    </div>
  );
}

export default function AdminUsersPage(props: { searchParams: Promise<{ search?: string; role?: string; status?: string }> }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <UsersContent {...props} />
    </Suspense>
  );
}
