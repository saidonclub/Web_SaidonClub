export const dynamic = "force-dynamic";

// ============================================================
// MODULE:     app/admin/config/page
// PURPOSE:    Configuración del sistema (Solo Super Admin)
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import styles from './config.module.css';

export default async function AdminConfigPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_SYSTEM_CONFIG)) {
    redirect('/dashboard');
  }

  const configs = await prisma.systemConfig.findMany({
    orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
  });

  // Agrupar por categoría
  const configsByCategory = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, typeof configs>);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Configuración del Sistema</h1>
          <p className={styles.subtitle}>
            Configura los parámetros del sistema (Solo Super Admin)
          </p>
        </div>
      </header>

      {Object.entries(configsByCategory).map(([category, categoryConfigs]) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.sectionTitle}>{category}</h2>
          <div className={styles.configGrid}>
            {categoryConfigs.map((config) => (
              <div key={config.id} className={styles.configItem}>
                <div className={styles.configHeader}>
                  <span className={styles.configKey}>{config.key}</span>
                  <span className={`${styles.configBadge} ${config.isActive ? styles.active : styles.inactive}`}>
                    {config.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className={styles.configDescription}>{config.description}</p>
                <div className={styles.configValue}>
                  <span className={styles.valueLabel}>Valor:</span>
                  <code className={styles.valueCode}>{String(config.value)}</code>
                </div>
                {config.minValue && config.maxValue && (
                  <div className={styles.configRange}>
                    Rango: {String(config.minValue)} - {String(config.maxValue)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
