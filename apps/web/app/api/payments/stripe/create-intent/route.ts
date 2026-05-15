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

    const { planId, amount } = await request.json();

    if (!planId || !amount) {
      return NextResponse.json(
        { success: false, message: "Parámetros incompletos" },
        { status: 400 },
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Stripe no está configurado",
          hint: "Configure STRIPE_SECRET_KEY en las variables de entorno",
          available: false,
        },
        { status: 200 },
      );
    }

    let Stripe: typeof import("stripe").default | null = null;
    try {
      const stripeModule = await import("stripe");
      Stripe = stripeModule.default;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Paquete de Stripe no instalado",
          hint: "Ejecute: pnpm add stripe",
          available: false,
        },
        { status: 200 },
      );
    }

    const stripeClient = new Stripe(stripeSecretKey);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        userId: user.id,
        planId: planId,
        type: "membership",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating Stripe payment intent:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al inicializar el pago",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
