import { NextRequest, NextResponse } from "next/server";
import {
  moderateProviderReview,
  hideClientReview,
  getProviderRatingSummary,
} from "@/lib/actions";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  try {
    const { reviewId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    if (type === "providerSummary") {
      const result = await getProviderRatingSummary(reviewId);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Tipo de resumen inválido. Usa: type=providerSummary" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error en GET /api/reviews/[reviewId]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const supabase = await createClient();
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { role: true },
    });
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { reviewId } = await params;
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "moderateProvider") {
      const result = await moderateProviderReview(
        reviewId,
        data.action as "hide" | "show",
      );
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "hideClientReview") {
      const result = await hideClientReview(reviewId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Acción inválida. Usa: moderateProvider o hideClientReview" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error en PUT /api/reviews/[reviewId]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
