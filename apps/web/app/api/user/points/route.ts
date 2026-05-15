import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { points: 0, error: "No autenticado" },
        { status: 401 },
      );
    }

    const { prisma } = await import("@saidonclub/database");

    const pointsAgg = await prisma.pointsLedger.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
    });

    const currentPoints = Number(pointsAgg._sum.amount) || 0;

    const { config } = await import("@saidonclub/config-engine");
    const exchangeRate = await config.get<number>("POINTS_EXCHANGE_RATE", 100);

    return NextResponse.json({ points: currentPoints, exchangeRate });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { points: 0, error: "Error interno" },
      { status: 500 },
    );
  }
}
