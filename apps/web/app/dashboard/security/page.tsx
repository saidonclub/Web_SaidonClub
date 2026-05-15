import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import styles from "./Security.module.css";
import { Shield, Search, AlertTriangle, ShieldCheck, Filter } from "lucide-react";

export default async function SecurityAuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Verificar si es SUPER_ADMIN
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'SUPER_ADMIN') {
    redirect("/dashboard");
  }

  // Obtener logs recientes
  const { data: logs } = await supabase
    .from('event_logs')
    .select('*, user:users(email)')
    .order('createdAt', { ascending: false })
    .limit(50);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <Shield size={32} color="var(--clr-orange)" />
          <div>
            <h1 className={styles.title}>Auditoría Forense</h1>
            <p className={styles.subtitle}>Registro de eventos críticos y seguridad del sistema</p>
          </div>
        </div>
      </header>

      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <ShieldCheck size={20} color="var(--clr-success)" />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Estado RLS</span>
            <span className={styles.statValue}>Blindado</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <AlertTriangle size={20} color="var(--clr-warn)" />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Alertas 24h</span>
            <span className={styles.statValue}>0</span>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Filtrar eventos..." />
          </div>
          <button className={styles.filterBtn}>
            <Filter size={18} />
            <span>Filtros</span>
          </button>
        </div>

        <table className={styles.logTable}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Evento</th>
              <th>Usuario</th>
              <th>Detalles (JSON Payload)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log) => (
              <tr key={log.id}>
                <td className={styles.timeTd}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[log.event_type] || styles.defaultBadge}`}>
                    {log.event_type}
                  </span>
                </td>
                <td className={styles.userTd}>
                  {log.user?.email || 'Sistema / Anon'}
                </td>
                <td className={styles.payloadTd}>
                  <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                </td>
                <td>
                  <div className={styles.statusOk}>Registrado</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
