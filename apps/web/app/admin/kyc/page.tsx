// ============================================================
// MODULE:     app/admin/kyc/page
// PURPOSE:    Verificación KYC de usuarios
// ============================================================

import { prisma, Prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Shield, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './kyc.module.css';

export const dynamic = "force-dynamic";

async function KYCContent({ searchParams }: { searchParams: Promise<{ search?: string; status?: string }> }) {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const currentUserRole = user.role as Role;
  if (!hasPermission(currentUserRole, Permission.MANAGE_KYC)) {
    redirect('/dashboard');
  }

  const { search, status } = await searchParams;

   const where: Prisma.KYCWhereInput = {};
  if (search) {
    where.OR = [
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { documentNumber: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) (where as Record<string, unknown>).status = status;

  const [kycList, stats] = await Promise.all([
    prisma.kYC.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
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

      <div className={styles.filtersRow}>
        <form className={styles.searchForm}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input 
              type="text" 
              name="search" 
              placeholder="Buscar por email, nombre o documento..." 
              defaultValue={search}
            />
          </div>
          <select name="status" defaultValue={status}>
            <option value="">Todos los Estados</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="APROBADO">Aprobado</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
          <button type="submit" className={styles.filterBtn}>
            <Filter size={16} />
            Filtrar
          </button>
          {(search || status) && (
            <Link href="/admin/kyc" className={styles.clearBtn}>
              Limpiar
            </Link>
          )}
        </form>
      </div>

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
                    <td colSpan={8}>
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🛡️</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--clr-text-primary)' }}>
                          No hay solicitudes KYC
                        </h3>
                        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                          Las solicitudes de verificación de identidad aparecerán aquí cuando los usuarios las envíen.
                        </p>
                        {(search || status) ? (
                          <a href="/admin/kyc" style={{ color: 'var(--clr-orange)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                            Limpiar filtros
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : (
                  kycList.map((kyc) => (
                    <tr key={kyc.id}>
                      <td data-label="Usuario">{kyc.user?.name || '-'}</td>
                      <td data-label="Email">{kyc.user?.email}</td>
                      <td data-label="Tipo Documento">{kyc.documentType || '-'}</td>
                      <td data-label="Número">{kyc.documentNumber || '-'}</td>
                      <td data-label="Nivel">Nivel {kyc.level}</td>
                      <td data-label="Estado">
                        <StatusBadge status={kyc.status} size="sm" />
                      </td>
                      <td data-label="Fecha">{kyc.createdAt.toLocaleDateString()}</td>
                      <td data-label="Acciones">
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

function LoadingSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.loading}>Cargando...</div>
    </div>
  );
}

export default function AdminKYCPage(props: { searchParams: Promise<{ search?: string; status?: string }> }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <KYCContent {...props} />
    </Suspense>
  );
}
