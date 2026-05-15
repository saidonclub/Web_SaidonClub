import { NextRequest, NextResponse } from "next/server";
import {
  getProviderReviews,
  getProviderRatingSummary,
} from "@/lib/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> },
) {
  try {
    const { providerId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const summary = searchParams.get("summary") === "true";

    if (summary) {
      const result = await getProviderRatingSummary(providerId);
      return NextResponse.json(result);
    }

    const result = await getProviderReviews(providerId, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en GET /api/reviews/provider/[providerId]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
