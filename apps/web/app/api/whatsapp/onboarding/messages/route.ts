import { NextResponse } from "next/server";
import { getMessageForDay, getAllMessages } from "@/lib/services/whatsapp";

const MESSAGE_STORAGE: Map<
  number,
  { enabled: boolean; customMessage: string | null }
> = new Map();

export async function GET() {
  try {
    const messages = getAllMessages();

    const configuredMessages = messages.map((msg) => {
      const stored = MESSAGE_STORAGE.get(msg.day);
      return {
        ...msg,
        enabled: stored?.enabled ?? true,
        customMessage: stored?.customMessage || null,
      };
    });

    return NextResponse.json({
      messages: configuredMessages,
      total: configuredMessages.length,
    });
  } catch (error) {
    console.error("Error fetching WhatsApp messages:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { day, enabled, customMessage } = body;

    const message = getMessageForDay(day);
    if (!message) {
      return NextResponse.json({ error: "Día no válido" }, { status: 400 });
    }

    MESSAGE_STORAGE.set(day, {
      enabled,
      customMessage,
    });

    return NextResponse.json({
      success: true,
      message: `Mensaje del día ${day} actualizado`,
    });
  } catch (error) {
    console.error("Error updating WhatsApp message:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
