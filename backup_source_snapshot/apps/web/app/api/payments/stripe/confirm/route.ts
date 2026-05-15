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

    const { clientSecret, planId, amount } = await request.json();

    if (!clientSecret || !planId || !amount) {
      return NextResponse.json(
        { success: false, message: "Parámetros incompletos" },
        { status: 400 },
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, message: "Stripe no está configurado" },
        { status: 500 },
      );
    }

    let Stripe: typeof import("stripe").default | null = null;
    try {
      const stripeModule = await import("stripe");
      Stripe = stripeModule.default;
    } catch {
      return NextResponse.json(
        { success: false, message: "Paquete de Stripe no instalado" },
        { status: 500 },
      );
    }

    const stripeClient = new Stripe(stripeSecretKey);

    const paymentIntent = await stripeClient.paymentIntents.retrieve(
      clientSecret.split("_secret_")[0],
    );

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({
        success: false,
        message: `El pago no fue completado. Estado: ${paymentIntent.status}`,
      });
    }

    const { data: existingMembership } = await supabase
      .from("memberships")
      .select("id, status")
      .eq("user_id", user.id)
      .in("status", ["active", "pending"])
      .single();

    if (existingMembership) {
      const { error: updateError } = await supabase
        .from("memberships")
        .update({
          status: "active",
          plan_id: planId,
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating membership:", updateError);
      }
    } else {
      const { error: insertError } = await supabase.from("memberships").insert({
        user_id: user.id,
        plan_id: planId,
        status: "active",
        started_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Error creating membership:", insertError);
      }
    }

    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      amount: amount,
      currency: "USD",
      method: "stripe",
      status: "completed",
      plan_id: planId,
      metadata: {
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    if (paymentError) {
      console.error("Error recording payment:", paymentError);
    }

    return NextResponse.json({
      success: true,
      message: "Pago procesado correctamente",
      paymentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error confirming Stripe payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al confirmar el pago",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
