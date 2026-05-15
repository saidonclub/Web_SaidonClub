// ============================================================
// MODULE:     app/provider/page
// PURPOSE:    Dashboard principal del proveedor
// ============================================================

import { prisma } from "@saidonclub/database";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/core";
import { Role } from "@saidonclub/rbac";
import { StatCard } from "@/components/admin/StatCard";
import {
  Package,
  Briefcase,
  DollarSign,
  ShoppingCart,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import styles from "./provider.module.css";

export default async function ProviderDashboard() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const role = user.role as Role;

  const isProductsProvider =
    role === Role.PROVIDER_PRODUCTS || role === Role.SUPER_ADMIN;
  const isServicesProvider =
    role === Role.PROVIDER_SERVICES || role === Role.SUPER_ADMIN;

  const [products, services, orders, wallet] = await Promise.all([
    isProductsProvider
      ? prisma.product.count({ where: { providerId: user.id } })
      : 0,
    isServicesProvider
      ? prisma.service.count({ where: { providerId: user.id } })
      : 0,
    prisma.order.count({ where: { providerId: user.id } }),
    prisma.wallet.findUnique({
      where: { userId: user.id },
      select: {
        balanceAvailable: true,
        balancePending: true,
        totalEarned: true,
      },
    }),
  ]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Proveedor</h1>
          <p className={styles.subtitle}>
            Gestiona tus productos o servicios y ventas
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        {isProductsProvider && (
          <StatCard
            title="Productos"
            value={products}
            href="/provider/products"
            icon={<Package size={20} />}
            color="purple"
          />
        )}
        {isServicesProvider && (
          <>
            <StatCard
              title="Servicios"
              value={services}
              href="/provider/services"
              icon={<Briefcase size={20} />}
              color="cyan"
            />
            <StatCard
              title="Citas"
              value={0}
              href="/provider/appointments"
              icon={<QrCode size={20} />}
              color="orange"
            />
          </>
        )}
        <StatCard
          title="Órdenes"
          value={orders}
          icon={<ShoppingCart size={20} />}
          color="blue"
        />
        <StatCard
          title="Balance Disponible"
          value={`$${Number(wallet?.balanceAvailable || 0).toFixed(2)}`}
          icon={<DollarSign size={20} />}
          color="green"
        />
      </section>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        <div className={styles.actionsGrid}>
          {isProductsProvider && (
            <Link href="/provider/products/new" className={styles.actionCard}>
              <Package size={24} />
              <span>Crear Producto</span>
            </Link>
          )}
          {isServicesProvider && (
            <>
              <Link href="/provider/services/new" className={styles.actionCard}>
                <Briefcase size={24} />
                <span>Crear Servicio</span>
              </Link>
              <Link href="/provider/appointments" className={styles.actionCard}>
                <QrCode size={24} />
                <span>Gestionar Citas</span>
              </Link>
            </>
          )}
          <Link href="/dashboard" className={styles.actionCard}>
            <DollarSign size={24} />
            <span>Ver Wallet</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
