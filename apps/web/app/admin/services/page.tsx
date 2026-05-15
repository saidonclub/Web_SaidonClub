// ============================================================
// MODULE:     app/admin/services/page
// PURPOSE:    Moderación de servicios
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../products/products.module.css';

export default async function AdminServicesPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MODERATE_SERVICES)) {
    redirect('/dashboard');
  }

  const [services, stats] = await Promise.all([
    prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        provider: { select: { email: true, name: true } },
        category: { select: { name: true } },
      },
    }),
    Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { status: 'ACTIVE' } }),
      prisma.service.count({ where: { status: 'PENDING' } }),
      prisma.service.count({ where: { status: 'REJECTED' } }),
    ]),
  ]);

  const [total, active, pending, rejected] = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Moderación de Servicios</h1>
          <p className={styles.subtitle}>
            Revisa y aprueba servicios publicados por proveedores
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total Servicios"
          value={total}
          icon={<Briefcase size={20} />}
          color="blue"
        />
        <StatCard
          title="Activos"
          value={active}
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatCard
          title="Pendientes"
          value={pending}
          href="/admin/services?status=PENDING"
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
            <h2>Lista de Servicios</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Categoría</th>
                  <th>Proveedor</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>💼</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--clr-text-primary)' }}>
                          No hay servicios registrados
                        </h3>
                        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '14px', marginBottom: 0 }}>
                          Los servicios publicados por proveedores aparecerán aquí para su revisión y moderación.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id}>
                      <td data-label="Servicio">
                        <div className={styles.productCell}>
                           <div className={styles.productImage}>
                             {s.images?.[0] ? (
                               <Image src={s.images[0]} alt={s.name} width={80} height={80} />
                             ) : (
                               <Briefcase size={20} />
                             )}
                           </div>
                          <div>
                            <div className={styles.productName}>{s.name}</div>
                            <div className={styles.productSku}>{s.code || s.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Categoría">{s.category?.name}</td>
                      <td data-label="Proveedor">{s.provider?.email}</td>
                      <td data-label="Precio" className={styles.price}>
                        ${Number(s.pricePVP).toFixed(2)}
                      </td>
                      <td data-label="Estado">
                        <StatusBadge status={s.status} size="sm" />
                      </td>
                      <td data-label="Fecha">{s.createdAt.toLocaleDateString()}</td>
                      <td data-label="Acciones">
                        <div className={styles.actions}>
                          <Link
                            href={`/admin/services/${s.id}`}
                            className={styles.actionLink}
                          >
                            Revisar
                          </Link>
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
