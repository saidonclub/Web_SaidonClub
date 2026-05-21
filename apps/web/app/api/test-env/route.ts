import { NextResponse } from 'next/server';
import { getUser } from "@/lib/auth/core";
import { Role, Permission, hasPermission } from "@saidonclub/rbac";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción" }, { status: 403 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_SYSTEM_CONFIG)) {
    return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
  }

  return NextResponse.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10),
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd()
  });
}
