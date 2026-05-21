import { NextRequest, NextResponse } from "next/server";
import { getClientReviews } from "@/lib/actions";
import { getUser } from "@/lib/auth/core";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { clientId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getClientReviews(clientId, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en GET /api/reviews/client/[clientId]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
