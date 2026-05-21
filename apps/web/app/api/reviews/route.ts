import { NextRequest, NextResponse } from "next/server";
import {
  createProviderReview,
  createClientReview,
  getProviderReviews,
  getClientReviews,
  getReviewByAppointment,
} from "@/lib/actions/review";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

import { getUser } from "@/lib/auth/core";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (type === "provider" && id) {
      const result = await getProviderReviews(id, page, limit);
      return NextResponse.json(result);
    }

    if (type === "client" && id) {
      const user = await getUser();
      if (!user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      const result = await getClientReviews(id, page, limit);
      return NextResponse.json(result);
    }

    if (type === "appointment" && id) {
      const user = await getUser();
      if (!user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
      }

      const isClient = appointment.clientId === user.id;
      const isProvider = appointment.providerId === user.id;
      const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

      if (!isClient && !isProvider && !isAdmin) {
        return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
      }

      const result = await getReviewByAppointment(id);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        error:
          "Parámetros inválidos. Usa: type=provider|client|appointment&id=...",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error en GET /api/reviews:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "createProviderReview") {
      const result = await createProviderReview(data);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "createClientReview") {
      const result = await createClientReview(data);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        error:
          "Acción inválida. Usa: createProviderReview o createClientReview",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error en POST /api/reviews:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
