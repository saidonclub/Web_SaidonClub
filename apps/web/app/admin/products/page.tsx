// ============================================================
// MODULE:     app/admin/products/page
// PURPOSE:    Moderación de productos
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Package, PackageCheck, PackageX, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './products.module.css';

export default async function AdminProductsPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MODERATE_PRODUCTS)) {
    redirect('/dashboard');
  }

  const [products, stats] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        provider: { select: { email: true, name: true } },
        category: { select: { name: true } },
      },
    }),
    Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { status: 'REJECTED' } }),
    ]),
  ]);

  const [total, active, pending, rejected] = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Moderación de Productos</h1>
          <p className={styles.subtitle}>
            Revisa y aprueba productos publicados por proveedores
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total Productos"
          value={total}
          icon={<Package size={20} />}
          color="blue"
        />
        <StatCard
          title="Activos"
          value={active}
          icon={<PackageCheck size={20} />}
          color="green"
        />
        <StatCard
          title="Pendientes"
          value={pending}
          href="/admin/products?status=PENDING"
          icon={<Clock size={20} />}
          color="yellow"
        />
        <StatCard
          title="Rechazados"
          value={rejected}
          icon={<PackageX size={20} />}
          color="red"
        />
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Lista de Productos</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Proveedor</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📦</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--clr-text-primary)' }}>
                          No hay productos registrados
                        </h3>
                        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '14px', marginBottom: 0 }}>
                          Los productos publicados por proveedores aparecerán aquí para su revisión y moderación.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Producto">
                        <div className={styles.productCell}>
                           <div className={styles.productImage}>
                             {p.images?.[0] ? (
                               <Image src={p.images[0]} alt={p.name} width={50} height={50} />
                             ) : (
                               <Package size={20} />
                             )}
                           </div>
                          <div>
                            <div className={styles.productName}>{p.name}</div>
                            <div className={styles.productSku}>{p.code || p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Categoría">{p.category?.name}</td>
                      <td data-label="Proveedor">{p.provider?.email}</td>
                      <td data-label="Precio" className={styles.price}>
                        ${Number(p.pricePVP).toFixed(2)}
                      </td>
                      <td data-label="Estado">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td data-label="Fecha">{p.createdAt.toLocaleDateString()}</td>
                      <td data-label="Acciones">
                        <div className={styles.actions}>
                          <Link
                            href={`/admin/products/${p.id}`}
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
