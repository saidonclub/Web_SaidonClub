import { NextRequest, NextResponse } from "next/server";
import {
  createSystemEvent,
  getPendingEvents,
  getEventStats,
  listEventsByEntity,
} from "@/lib/actions/event";
import { getUser } from "@/lib/auth/core";
import { Role, Permission, hasPermission } from "@saidonclub/rbac";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const role = user.role as Role;
    if (!hasPermission(role, Permission.MANAGE_SYSTEM_CONFIG)) {
      return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
    }

    const body = await request.json();

    const result = await createSystemEvent(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Error al crear evento" },
        { status: 400 },
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Error al crear el evento" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const role = user.role as Role;
    if (!hasPermission(role, Permission.VIEW_AUDIT_LOGS)) {
      return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (entityType && entityId) {
      const result = await listEventsByEntity(entityType, entityId);
      return NextResponse.json(result);
    }

    if (action === "stats") {
      const result = await getEventStats();
      return NextResponse.json(result);
    }

    if (action === "pending") {
      const result = await getPendingEvents();
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error in events API:", error);
    return NextResponse.json(
      { error: "Error en la API de eventos" },
      { status: 500 },
    );
  }
}
