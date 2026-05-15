import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/core";
import { Role, canAccessRoute } from "@saidonclub/rbac";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const role = user.role as Role;

  if (!canAccessRoute(role, "/dashboard")) {
    redirect("/");
  }

  return <>{children}</>;
}
