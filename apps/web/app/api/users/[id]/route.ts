import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { logSecurityEvent } from "@/lib/security-logger";
import validator from "validator";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user: sessionUser } } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow the user to see their own profile or an ADMIN
    if (sessionUser.id !== id && sessionUser.user_metadata?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        membership: {
          select: {
            type: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response to match the UserProfile interface
    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      membershipType: user.membership?.type || null,
    };

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();
    const { data: { user: sessionUser } } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Solo el usuario o un ADMIN pueden editar
    if (sessionUser.id !== id && sessionUser.user_metadata?.role !== 'ADMIN') {
      await logSecurityEvent(sessionUser.id, 'SUSPICIOUS_ACTIVITY', { 
        action: 'UNAUTHORIZED_PROFILE_UPDATE_ATTEMPT',
        targetId: id 
      }, 'ACCESS_CONTROL');
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // SANITIZACIÓN Y VALIDACIÓN
    const { name: rawName, avatar } = body;
    let name: string | undefined;

    if (rawName) {
      name = validator.escape(validator.trim(rawName));
      if (name.length > 100) return NextResponse.json({ error: "Nombre demasiado largo" }, { status: 400 });
    }

    if (avatar && !validator.isURL(avatar, { require_protocol: true, protocols: ['http', 'https'] })) {
      if (!avatar.startsWith('data:image/')) {
         return NextResponse.json({ error: "URL de avatar inválida" }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        avatar,
      },
    });

    // Auditoría: Registrar el cambio
    await logSecurityEvent(sessionUser.id, 'SECURITY_SETTING_CHANGE', { 
      action: 'UPDATE_PROFILE',
      fields: Object.keys(body)
    }, 'USER_MANAGEMENT');

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

