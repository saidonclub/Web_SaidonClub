// ============================================================
// MODULE:     app/admin/audit/page
// PURPOSE:    Logs de auditoría de transiciones de citas
// ============================================================

import { prisma } from "@saidonclub/database";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/core";
import { Role, hasPermission, Permission } from "@saidonclub/rbac";
import styles from "./audit.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAuditPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const role = user.role as Role;
  if (!hasPermission(role, Permission.VIEW_AUDIT_LOGS)) {
    redirect("/dashboard");
  }

  // Carga los últimos 200 logs con datos de la cita asociada
  const logs = await prisma.appointmentAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      appointment: {
        select: {
          id: true,
          status: true,
          client: { select: { name: true } },
          provider: { select: { businessName: true } },
        },
      },
    },
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Auditoría de Citas</h1>
          <p className={styles.subtitle}>
            Registro de todas las transiciones de estado — últimas {logs.length}{" "}
            entradas
          </p>
        </div>
      </header>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Logs de Transiciones</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cita</th>
                  <th>Cliente / Proveedor</th>
                  <th>Rol que actuó</th>
                  <th>De → A</th>
                  <th>Razón</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      No hay logs de auditoría registrados aún
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td data-label="Fecha" className={styles.dateCell}>
                        {log.createdAt.toLocaleString("es-EC", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td data-label="Cita" className={styles.idCell}>
                        <code>{log.appointmentId.slice(0, 10)}…</code>
                      </td>
                      <td data-label="Participantes">
                        <div className={styles.parties}>
                          <span>{log.appointment.client?.name ?? "—"}</span>
                          <span className={styles.separator}>↔</span>
                          <span>
                            {log.appointment.provider?.businessName ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td data-label="Actor">
                        <span
                          className={`${styles.roleBadge} ${
                            styles[`role${log.triggeredByRole}`]
                          }`}
                        >
                          {log.triggeredByRole}
                        </span>
                      </td>
                      <td data-label="Transición" className={styles.transition}>
                        <span className={styles.fromStatus}>
                          {log.fromStatus || "—"}
                        </span>
                        <span className={styles.arrow}>→</span>
                        <span className={styles.toStatus}>{log.toStatus}</span>
                      </td>
                      <td data-label="Razón" className={styles.reason}>
                        {log.reason ?? "Sin descripción"}
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
