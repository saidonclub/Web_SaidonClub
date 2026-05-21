// ============================================================
// MODULE:     app/provider/products/page
// PURPOSE:    Lista de productos del proveedor
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../products/products.module.css';

export default async function ProviderProductsPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (role !== Role.PROVIDER_PRODUCTS && role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  const [products, activeCount, pendingCount] = await Promise.all([
    prisma.product.findMany({
      where: { providerId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
      },
    }),
    prisma.product.count({ where: { providerId: user.id, status: 'ACTIVE' } }),
    prisma.product.count({ where: { providerId: user.id, status: 'PENDING' } }),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Productos</h1>
          <p className={styles.subtitle}>
            Gestiona tu catálogo de productos
          </p>
        </div>
        <Link href="/provider/products/new" className={styles.addButton}>
          <Plus size={18} />
          Nuevo Producto
        </Link>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total"
          value={products.length}
          icon={<Package size={20} />}
          color="blue"
        />
        <StatCard
          title="Activos"
          value={activeCount}
          icon={<Package size={20} />}
          color="green"
        />
        <StatCard
          title="Pendientes"
          value={pendingCount}
          icon={<Package size={20} />}
          color="yellow"
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
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      No tienes productos. <Link href="/provider/products/new">Crea uno nuevo</Link>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.productImage}>
                            {p.images?.[0] ? (
                              <Image src={p.images[0]} alt={p.name} width={40} height={40} style={{ objectFit: 'cover' }} />
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
                      <td>{p.category?.name}</td>
                      <td className={styles.price}>
                        ${Number(p.pricePVP).toFixed(2)}
                      </td>
                      <td>{p.stock}</td>
                      <td>
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link href={`/provider/products/${p.id}`} className={styles.actionLink}>
                            Editar
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
