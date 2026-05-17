/**
 * [AI_CONTEXT]
 * Server component wrapper for the Saidon AI Financial Desk.
 * Authenticates user session and passes initial wallet balance to the Client Component.
 * Estética: Obsidian & Safety Orange.
 */

import { getUser } from "@/lib/auth/core";
import { getDashboardData } from "@/lib/data/dashboard";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AITradingClient from "./AITradingClient";

export const metadata: Metadata = {
  title: "AI Trading Desk | SaidonClub OS",
  description: "Terminal de Operación Cuántica & Arbitraje Automatizado SaidonClub.",
  robots: { index: false, follow: false },
};

export default async function AITradingPage() {
  // Validate active session
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch real financial stats for the user from the DB
  const dashboardData = await getDashboardData(user.id);
  const initialBalance = dashboardData.wallet.available;

  return (
    <AITradingClient
      initialBalance={initialBalance}
      userEmail={user.email}
      userRole={user.role}
      userName={user.name}
    />
  );
}
