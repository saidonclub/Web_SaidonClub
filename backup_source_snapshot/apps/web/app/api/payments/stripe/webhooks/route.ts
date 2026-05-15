import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma, MembershipType } from "@saidonclub/database";

interface WebhookEventLog {
  eventId: string;
  eventType: string;
  processedAt: Date;
}

const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
] as const;

type WebhookEventType = (typeof WEBHOOK_EVENTS)[number];

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET no está configurado");
  }
  return secret;
}

function getStripeInstance(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY no está configurado");
  }
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

async function logWebhookEvent(event: WebhookEventLog): Promise<void> {
  console.log("[STRIPE_WEBHOOK]", JSON.stringify(event));
}

async function isEventAlreadyProcessed(eventId: string): Promise<boolean> {
  const existing = await prisma.systemConfig.findFirst({
    where: {
      key: `stripe_event_${eventId}`,
      isActive: true,
    },
  });
  return !!existing;
}

async function markEventAsProcessed(eventId: string): Promise<void> {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  await prisma.systemConfig.upsert({
    where: { key: `stripe_event_${eventId}` },
    create: {
      key: `stripe_event_${eventId}`,
      value: eventId,
      type: "STRING",
      category: "PAYMENTS",
      description: `Stripe webhook event processed: ${eventId}`,
      editableBy: [],
      requiresRestart: false,
      dependencies: [],
      isActive: true,
      isPublic: false,
    },
    update: {
      updatedAt: new Date(),
    },
  });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<{ success: boolean; message: string }> {
  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType as MembershipType | undefined;

  if (!userId) {
    console.error("[WEBHOOK] No userId en metadata:", session.id);
    return { success: false, message: "No userId in metadata" };
  }

  const membershipType: MembershipType = planType || "PREFERENTE";
  const purchaseDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const amount = session.amount_total ? session.amount_total / 100 : 0;

  await prisma.membership.upsert({
    where: { userId },
    create: {
      userId,
      type: membershipType,
      price: amount,
      purchaseDate,
      expiryDate,
      isUpgrade: false,
      includesProducts: false,
      productOrderId: null,
    },
    update: {
      type: membershipType,
      purchaseDate,
      expiryDate,
      isUpgrade: false,
    },
  });

  await logWebhookEvent({
    eventId: session.id,
    eventType: "checkout.session.completed",
    processedAt: new Date(),
  });

  return {
    success: true,
    message: `Membresía ${membershipType} activada para usuario ${userId}`,
  };
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<{ success: boolean; message: string }> {
  // Buscar usuario por metadata o usar el primer usuario como fallback
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  }

  // Si no se encuentra por ID en metadata, buscar por email en metadata
  if (!user && metadata?.email) {
    user = await prisma.user.findUnique({
      where: { email: metadata.email },
    });
  }

  if (!user) {
    return { success: false, message: "Usuario no encontrado para customer" };
  }

  const sub = subscription as unknown as Record<string, unknown>;
  const currentPeriodStart = new Date((sub.current_period_start as number) * 1000);
  const currentPeriodEnd = new Date((sub.current_period_end as number) * 1000);
  const priceId = subscription.items.data[0]?.price.id;

  const membershipType: MembershipType =
    priceId?.includes("pionero") || priceId?.includes("PIONERO")
      ? "PIONERO"
      : "PREFERENTE";

  const priceAmount = subscription.items.data[0]?.price.unit_amount
    ? subscription.items.data[0].price.unit_amount / 100
    : 0;

  await prisma.membership.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      type: membershipType,
      price: priceAmount,
      purchaseDate: currentPeriodStart,
      expiryDate: currentPeriodEnd,
      isUpgrade: false,
      includesProducts: false,
      productOrderId: null,
    },
    update: {
      type: membershipType,
      purchaseDate: currentPeriodStart,
      expiryDate: currentPeriodEnd,
    },
  });

  return {
    success: true,
    message: `Suscripción creada para usuario ${user.id}`,
  };
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<{ success: boolean; message: string }> {
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  }

  if (!user && metadata?.email) {
    user = await prisma.user.findUnique({
      where: { email: metadata.email },
    });
  }

  if (!user) {
    return { success: false, message: "Usuario no encontrado" };
  }

  const status = subscription.status;
  const subUpdate = subscription as unknown as Record<string, unknown>;
  const currentPeriodStart = new Date((subUpdate.current_period_start as number) * 1000);
  const currentPeriodEnd = new Date((subUpdate.current_period_end as number) * 1000);

  if (status === "active" || status === "past_due") {
    await prisma.membership.update({
      where: { userId: user.id },
      data: {
        purchaseDate: currentPeriodStart,
        expiryDate: currentPeriodEnd,
      },
    });
  }

  return {
    success: true,
    message: `Suscripción actualizada para usuario ${user.id} - estado: ${status}`,
  };
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<{ success: boolean; message: string }> {
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  }

  if (!user && metadata?.email) {
    user = await prisma.user.findUnique({
      where: { email: metadata.email },
    });
  }

  if (!user) {
    return { success: false, message: "Usuario no encontrado" };
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  await prisma.membership.update({
    where: { userId: user.id },
    data: {
      expiryDate,
    },
  });

  return {
    success: true,
    message: `Membresía expirada para usuario ${user.id}`,
  };
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<{ success: boolean; message: string }> {
  const inv = invoice as unknown as Record<string, unknown>;
  const subscriptionId = inv.subscription as string | undefined;

  if (!subscriptionId) {
    return { success: true, message: "No es una suscripción, omitir" };
  }

  const subscription = await getStripeInstance().subscriptions.retrieve(subscriptionId);
  const subMetadata = subscription.metadata;
  const userId = subMetadata?.userId;

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  }

  if (!user && subMetadata?.email) {
    user = await prisma.user.findUnique({
      where: { email: subMetadata.email },
    });
  }

  if (!user) {
    return { success: false, message: "Usuario no encontrado para invoice" };
  }

  const subInvoice = subscription as unknown as Record<string, unknown>;
  const currentPeriodStart = new Date((subInvoice.current_period_start as number) * 1000);
  const currentPeriodEnd = new Date((subInvoice.current_period_end as number) * 1000);

  await prisma.membership.update({
    where: { userId: user.id },
    data: {
      purchaseDate: currentPeriodStart,
      expiryDate: currentPeriodEnd,
    },
  });

  return {
    success: true,
    message: `Membresía renovada para usuario ${user.id}`,
  };
}

async function processEvent(
  event: Stripe.Event
): Promise<{ success: boolean; message: string }> {
  const eventId = event.id;

  const alreadyProcessed = await isEventAlreadyProcessed(eventId);
  if (alreadyProcessed) {
    console.log(`[WEBHOOK] Evento ya procesado: ${eventId}`);
    return { success: true, message: "Evento duplicado, omitir" };
  }

  const eventType = event.type as WebhookEventType;

  if (!WEBHOOK_EVENTS.includes(eventType as WebhookEventType)) {
    return { success: true, message: `Evento no manejado: ${eventType}` };
  }

  let result: { success: boolean; message: string } = {
    success: false,
    message: "Evento no procesado",
  };

  switch (eventType) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      result = await handleCheckoutSessionCompleted(session);
      break;
    }
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      result = await handleSubscriptionCreated(subscription);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      result = await handleSubscriptionUpdated(subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      result = await handleSubscriptionDeleted(subscription);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      result = await handleInvoicePaymentSucceeded(invoice);
      break;
    }
  }

  if (result.success) {
    await markEventAsProcessed(eventId);
  }

  return result;
}

const isProd = process.env.NODE_ENV === "production";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Firma requerida" },
        { status: 400 }
      );
    }

    const webhookSecret = getWebhookSecret();
    const rawBody = await request.text();

    let stripe: Stripe;
    try {
      stripe = getStripeInstance();
    } catch {
      // No exponer detalles internos en producción
      return NextResponse.json(
        { success: false, error: "Servicio no disponible" },
        { status: 503 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      // Log interno completo, respuesta pública genérica
      if (!isProd) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        console.error("[WEBHOOK] Error validando firma:", msg);
      }
      return NextResponse.json(
        { success: false, error: "Firma inválida" },
        { status: 400 }
      );
    }

    if (!isProd) {
      console.log(`[WEBHOOK] Evento recibido: ${event.type} - ${event.id}`);
    }

    const result = await processEvent(event);

    if (!result.success) {
      if (!isProd) {
        console.warn(`[WEBHOOK] Evento no procesado: ${event.id} - ${result.message}`);
      }
      return NextResponse.json(
        { success: false, error: "No procesado" },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, received: true });
  } catch {
    // Nunca exponer detalles del stack en producción
    return NextResponse.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}

// GET eliminado — no exponer lista de eventos del webhook en producción
export async function GET(): Promise<NextResponse> {
  return new NextResponse(null, { status: 405 });
}