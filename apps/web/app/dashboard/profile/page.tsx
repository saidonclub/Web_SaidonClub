/**
 * [AI_CONTEXT]
 * Profile Page Server Component.
 * Fetches user data via Prisma and passes it to ProfileClient.
 * Path: app/dashboard/profile/page.tsx
 */
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Perfil | SaidonClub",
  description: "Actualiza tu información personal, seguridad y preferencias en SaidonClub.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login");
  }

  // Obtenemos los datos extendidos del usuario desde Prisma
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      membership: true,
      city: true,
      providerProfile: true,
    }
  });

  if (!user) {
    redirect("/dashboard");
  }

  return (
    <ProfileClient 
      initialUser={JSON.parse(JSON.stringify(user))} 
    />
  );
}
