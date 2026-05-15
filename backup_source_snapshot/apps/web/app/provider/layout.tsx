// ============================================================
// MODULE:     app/provider/layout
// PURPOSE:    Layout para el dashboard de proveedor
// ============================================================

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/core";
import { Role } from "@saidonclub/rbac";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const role = user.role as Role;

  // PROVIDER_PRODUCTS, PROVIDER_SERVICES o SUPER_ADMIN
  const isProvider = [
    Role.PROVIDER_PRODUCTS,
    Role.PROVIDER_SERVICES,
    Role.SUPER_ADMIN,
  ].includes(role);

  if (!isProvider) {
    redirect("/dashboard");
  }

  return <AdminShell userRole={user.role}>{children}</AdminShell>;
}
