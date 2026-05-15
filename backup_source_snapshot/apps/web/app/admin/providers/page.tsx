// ============================================================
// MODULE:     app/admin/providers/page
// PURPOSE:    Aprobación de proveedores
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Store, Clock } from 'lucide-react';
import styles from './providers.module.css';

export const dynamic = "force-dynamic";

export default async function AdminProvidersPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.APPROVE_PROVIDERS)) {
    redirect('/dashboard');
  }

  const [providers, stats] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: { in: ['PROVIDER_PRODUCTS', 'PROVIDER_SERVICES'] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        providerProfile: true,
        _count: {
          select: { products: true, services: true },
        },
      },
    }),
    Promise.all([
      prisma.user.count({ where: { role: 'PROVIDER_PRODUCTS' } }),
      prisma.user.count({ where: { role: 'PROVIDER_SERVICES' } }),
      prisma.user.count({ where: { role: { in: ['PROVIDER_PRODUCTS', 'PROVIDER_SERVICES'] }, status: 'PENDING_APPROVAL' } }),
    ]),
  ]);

  const [productProviders, serviceProviders, pendingApproval] = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Proveedores</h1>
          <p className={styles.subtitle}>
            Aprueba y gestiona cuentas de proveedores
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Proveedores Productos"
          value={productProviders}
          icon={<Store size={20} />}
          color="purple"
        />
        <StatCard
          title="Proveedores Servicios"
          value={serviceProviders}
          icon={<Store size={20} />}
          color="cyan"
        />
        <StatCard
          title="Pendientes"
          value={pendingApproval}
          icon={<Clock size={20} />}
          color="yellow"
        />
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Lista de Proveedores</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Productos</th>
                  <th>Servicios</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.empty}>
                      No hay proveedores registrados
                    </td>
                  </tr>
                ) : (
                  providers.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Empresa">{p.providerProfile?.companyName || p.name || '-'}</td>
                      <td data-label="Email">{p.email}</td>
                      <td data-label="Tipo">
                        <span className={`${styles.providerType} ${p.role === 'PROVIDER_PRODUCTS' ? styles.products : styles.services}`}>
                          {p.role === 'PROVIDER_PRODUCTS' ? 'Productos' : 'Servicios'}
                        </span>
                      </td>
                      <td data-label="Productos">{p._count.products}</td>
                      <td data-label="Servicios">{p._count.services}</td>
                      <td data-label="Estado">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td data-label="Acciones">
                        <div className={styles.actions}>
                          <button className={styles.approveBtn}>Aprobar</button>
                          <button className={styles.viewBtn}>Ver</button>
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
