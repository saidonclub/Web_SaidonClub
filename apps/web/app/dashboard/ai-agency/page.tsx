/**
 * [AI_CONTEXT]
 * Server component wrapper for the Saidon AI Development & Research Agency.
 * Authenticates user session and delegates rendering to the client component.
 * Estética: Obsidian & Safety Orange.
 */

import { getUser } from "@/lib/auth/core";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AIAgencyClient from "./AIAgencyClient";

export const metadata: Metadata = {
  title: "Saidon AI Agency | SaidonClub OS",
  description: "Terminal de Simulación de Agentes Autónomos (CrewAI & LangGraph) - SaidonClub OS.",
  robots: { index: false, follow: false },
};

export default async function AIAgencyPage() {
  // Validate active session
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <AIAgencyClient
      userEmail={user.email}
      userRole={user.role}
      userName={user.name}
    />
  );
}
