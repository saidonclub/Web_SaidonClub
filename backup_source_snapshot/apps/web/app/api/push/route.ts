import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { subscription, action } = body;

    if (action === "subscribe") {
      if (!subscription) {
        return NextResponse.json(
          { error: "Suscripción requerida" },
          { status: 400 },
        );
      }

      const { data: existing } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("endpoint", subscription.endpoint)
        .single();

      if (!existing) {
        await supabase.from("push_subscriptions").insert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          keys: subscription.keys,
          created_at: new Date().toISOString(),
        });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "unsubscribe") {
      const { endpoint } = body;
      if (endpoint) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", endpoint);
      }
      return NextResponse.json({ success: true });
    }

    if (action === "list") {
      const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", user.id);

      return NextResponse.json({ subscriptions: subscriptions || [] });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Push Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", user.id);

    return NextResponse.json({
      subscribed: (subscriptions?.length || 0) > 0,
      count: subscriptions?.length || 0,
    });
  } catch (error) {
    console.error("Push Status Error:", error);
    return NextResponse.json({ subscribed: false, count: 0 });
  }
}
