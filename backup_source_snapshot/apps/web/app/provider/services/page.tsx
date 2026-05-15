/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// MODULE:     app/provider/services/page
// PURPOSE:    Lista de servicios del proveedor
// ============================================================

import { prisma } from "@saidonclub/database";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/core";
import { Role } from "@saidonclub/rbac";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import styles from "../products/products.module.css";

export default async function ProviderServicesPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const role = user.role as Role;
  if (role !== Role.PROVIDER_SERVICES && role !== Role.SUPER_ADMIN) {
    redirect("/dashboard");
  }

  const [services, activeCount, pendingCount] = await Promise.all([
    prisma.service.findMany({
      where: { providerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
      },
    }),
    prisma.service.count({ where: { providerId: user.id, status: "ACTIVE" } }),
    prisma.service.count({ where: { providerId: user.id, status: "PENDING" } }),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Servicios</h1>
          <p className={styles.subtitle}>
            Gestiona tu catálogo de servicios profesionales
          </p>
        </div>
        <Link href="/provider/services/new" className={styles.addButton}>
          <Plus size={18} />
          Nuevo Servicio
        </Link>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total"
          value={services.length}
          icon={<Briefcase size={20} />}
          color="blue"
        />
        <StatCard
          title="Activos"
          value={activeCount}
          icon={<Briefcase size={20} />}
          color="green"
        />
        <StatCard
          title="Pendientes"
          value={pendingCount}
          icon={<Briefcase size={20} />}
          color="yellow"
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
                  <th>Precio</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      No tienes servicios.{" "}
                      <Link href="/provider/services/new">Crea uno nuevo</Link>
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.productImage}>
                            {s.images?.[0] ? (
                              <img src={s.images[0]} alt={s.name} />
                            ) : (
                              <Briefcase size={20} />
                            )}
                          </div>
                          <div>
                            <div className={styles.productName}>{s.name}</div>
                            <div className={styles.productSku}>
                              {s.code || s.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{s.category?.name}</td>
                      <td className={styles.price}>
                        ${Number(s.pricePVP).toFixed(2)}
                      </td>
                      <td>{(s as any).duration || "N/A"} min</td>
                      <td>
                        <StatusBadge status={s.status} size="sm" />
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link
                            href={`/provider/services/${s.id}`}
                            className={styles.actionLink}
                          >
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

