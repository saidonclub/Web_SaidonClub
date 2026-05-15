// ============================================================
// MODULE:     app/admin/multimedia/page
// PURPOSE:    Página del dashboard multimedia
// ============================================================

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { MultimediaDashboard } from '@/components/admin/MultimediaDashboard';
import styles from '../admin.module.css';

export default async function MultimediaPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_CONTENT)) {
    redirect('/dashboard');
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión Multimedia</h1>
        <p className={styles.subtitle}>
          Optimiza, comprime y gestiona los archivos multimedia del sistema
        </p>
      </div>

      <MultimediaDashboard />
    </div>
  );
}