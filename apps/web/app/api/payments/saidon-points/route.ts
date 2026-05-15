import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit, API_RATE_LIMITS } from "@/lib/auth/rate-limit";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

function rateLimitResponse(remaining: number, resetTime: number) {
  return new NextResponse(
    JSON.stringify({ success: false, message: "Too Many Requests", error: "Rate limit exceeded" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(API_RATE_LIMITS.payment.maxRequests),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, API_RATE_LIMITS.payment);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.remaining, rateLimit.resetTime);
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 },
      );
    }

    const { planId, points } = await request.json();

    // SERVER-SIDE PLAN VALIDATION
    const PLAN_COSTS: Record<string, { price: number; points: number }> = {
      preferente: { price: 29, points: 2900 }, // Assuming 1 USD = 100 points based on UI
      pionero: { price: 97, points: 9700 },
    };

    const validPlan = PLAN_COSTS[planId as keyof typeof PLAN_COSTS];
    if (!validPlan) {
      return NextResponse.json(
        { success: false, message: "Plan no válido" },
        { status: 400 },
      );
    }

    // Validate that the points requested match the server-side cost
    if (points !== validPlan.points) {
       return NextResponse.json(
        { success: false, message: "Monto de puntos incorrecto para este plan" },
        { status: 400 },
      );
    }

    const { prisma } = await import("@saidonclub/database");

    try {
      const result = await prisma.$transaction(async (tx) => {
        const pointsAgg = await tx.pointsLedger.aggregate({
          where: { userId: user.id },
          _sum: { amount: true },
        });

        const availablePoints = Number(pointsAgg._sum.amount) || 0;

        if (availablePoints < points) {
          throw new Error("Puntos insuficientes");
        }

        await tx.pointsLedger.create({
          data: {
            userId: user.id,
            sourceType: "REDEMPTION",
            amount: -points,
            description: `Pago de membresía ${planId}`,
            cycleMonth: new Date().getMonth() + 1,
            cycleYear: new Date().getFullYear(),
          },
        });

        const membership = await tx.membership.create({
          data: {
            userId: user.id,
            type: planId === 'pionero' ? 'PIONERO' : 'PREFERENTE',
            price: validPlan.price,
            purchaseDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });

        return { membership, pointsUsed: points };
      });

      return NextResponse.json({
        success: true,
        message: "Pago procesado correctamente",
        membershipId: result.membership.id,
        pointsUsed: result.pointsUsed,
      });
    } catch (txError: unknown) {
      return NextResponse.json(
        { success: false, message: txError instanceof Error ? txError.message : "Error procesando el pago" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error processing points payment:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
