// ============================================================
// MODULE:     app/admin/layout
// PURPOSE:    Layout principal para el dashboard de administración
// ============================================================

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const role = user.role as Role;

  // Verificar que el usuario tenga permisos de administración
  const hasAccess = hasPermission(role, Permission.MANAGE_USERS) ||
                    hasPermission(role, Permission.VIEW_ALL_TRANSACTIONS);

  if (!hasAccess) {
    redirect('/dashboard');
  }

  return <AdminShell userRole={user.role}>{children}</AdminShell>;
}
