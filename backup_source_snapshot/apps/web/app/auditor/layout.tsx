// ============================================================
// MODULE:     app/auditor/layout
// PURPOSE:    Layout para el dashboard del auditor
// ============================================================

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AuditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const role = user.role as Role;

  // Solo AUDITOR y SUPER_ADMIN pueden acceder
  if (role !== Role.AUDITOR && role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  return <AdminShell userRole={user.role}>{children}</AdminShell>;
}
