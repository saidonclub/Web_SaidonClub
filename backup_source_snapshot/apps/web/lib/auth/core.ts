// ============================================================
// MODULE:     lib/auth
// PURPOSE:    Helper functions para autenticación y autorización
//             Usa @supabase/ssr para compatibilidad con Next.js 15
// ============================================================

import { prisma } from "@saidonclub/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Role } from "@saidonclub/rbac";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  status: string;
  name: string | null;
  avatar: string | null;
  membershipType: string | null;
}

/**
 * Obtiene el usuario autenticado actualmente desde Supabase SSR
 */
export async function getUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignorar si es Server Component
            }
          },
        },
      }
    );

    const { data: { user: sbUser }, error } = await supabase.auth.getUser();

    if (error || !sbUser) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: sbUser.email },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        name: true,
        avatar: true,
        membership: {
          select: {
            type: true,
          },
        },
      },
    });

    if (!dbUser) {
      return null;
    }

    return {
      ...dbUser,
      role: dbUser.role as Role,
      membershipType: dbUser.membership?.type || null,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Obtiene el usuario autenticado o lanza error si no existe
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  return user;
}

/**
 * Obtiene el usuario autenticado y verifica que tenga uno de los roles especificados
 */
export async function requireRole(roles: Role[]): Promise<AuthUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error("No tiene permisos para esta acción");
  }
  return user;
}

/**
 * Verifica si el usuario actual tiene un rol específico
 */
export async function hasRole(role: Role): Promise<boolean> {
  const user = await getUser();
  return user?.role === role;
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 */
export async function hasAnyRole(roles: Role[]): Promise<boolean> {
  const user = await getUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Obtiene el ID del usuario actual o null
 */
export async function getUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.id ?? null;
}

/**
 * Actualiza la fecha del último login del usuario
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}