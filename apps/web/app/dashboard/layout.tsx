export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/core";
import { Role, canAccessRoute } from "@saidonclub/rbac";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";

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

  return (
    <div className={styles.layout}>
      <Sidebar role={role} userEmail={user.email || ""} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
