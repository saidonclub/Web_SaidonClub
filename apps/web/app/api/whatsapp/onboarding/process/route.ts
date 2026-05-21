import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMessageForDay } from "@/lib/services/whatsapp";
import { getUser } from "@/lib/auth/core";

const ONBOARDING_LOG: Map<string, { day: number; sentAt: string }[]> =
  new Map();

async function checkAuthorization(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader === `Bearer ${expectedSecret}`) {
    return true;
  }

  const user = await getUser();
  if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
    return true;
  }

  if (!expectedSecret && process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAuthorization(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, forceDay } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, name: true, affiliateCode: true },
    });

    if (!user || !user.phone) {
      return NextResponse.json(
        { error: "Usuario no encontrado sin teléfono" },
        { status: 400 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://saidonclub.com";
    const referralLink = `${appUrl}/register?ref=${user.affiliateCode}`;

    let targetDay = forceDay;

    if (!targetDay) {
      const daysSinceRegistration = Math.floor(
        (Date.now() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      );
      targetDay = [0, 1, 3, 5, 7].find((d) => d >= daysSinceRegistration) || 0;
    }

    const messageTemplate = getMessageForDay(targetDay);
    if (!messageTemplate) {
      return NextResponse.json(
        { error: "Mensaje no encontrado para el día" },
        { status: 400 },
      );
    }

    const userLog = ONBOARDING_LOG.get(userId) || [];
    const alreadySent = userLog.find((l) => l.day === targetDay);

    if (alreadySent) {
      return NextResponse.json({
        message: "Este mensaje ya fue enviado",
        day: targetDay,
      });
    }

    const finalMessage = messageTemplate.message
      .replace("{referralLink}", referralLink)
      .replace("{name}", user.name || "Usuario");

    userLog.push({ day: targetDay, sentAt: new Date().toISOString() });
    ONBOARDING_LOG.set(userId, userLog);

    return NextResponse.json({
      success: true,
      day: targetDay,
      title: messageTemplate.title,
      message: finalMessage,
      phone: user.phone,
      referralLink,
      readyToSend: true,
    });
  } catch (error) {
    console.error("Error processing WhatsApp onboarding:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAuthorization(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Sistema de automatización WhatsApp activo",
      days: [0, 1, 3, 5, 7],
      totalUsers: ONBOARDING_LOG.size,
    });
  } catch (error) {
    console.error("Error in WhatsApp onboarding GET:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
