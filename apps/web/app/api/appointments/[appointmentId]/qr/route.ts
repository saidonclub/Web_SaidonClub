import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@saidonclub/database";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { appointmentId } = await params;
    const body = await request.json();
    const { action, qrToken } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        provider: {
          include: { user: true },
        },
        service: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 },
      );
    }

    if (action === "generate") {
      const qrToken = crypto.randomUUID();
      const qrExpiry = new Date(Date.now() + 30 * 60 * 1000);

      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "POR_ATENDER",
          providerNotes: `QR Token generado: ${qrToken}. Expira: ${qrExpiry.toISOString()}`,
        },
      });

      return NextResponse.json({
        success: true,
        qrToken,
        expiresAt: qrExpiry.toISOString(),
        appointmentId: updated.id,
      });
    }

    if (action === "validate") {
      if (!qrToken) {
        return NextResponse.json(
          { error: "Token QR requerido" },
          { status: 400 },
        );
      }

      const isProvider = appointment.provider.userId === user.id;
      const isClient = appointment.clientId === user.id;

      if (!isProvider && !isClient) {
        return NextResponse.json(
          { error: "No tienes acceso a esta cita" },
          { status: 403 },
        );
      }

      if (appointment.status !== "POR_ATENDER") {
        return NextResponse.json(
          {
            error: "La cita no está en estado válido para escaneo",
            currentStatus: appointment.status,
          },
          { status: 400 },
        );
      }

      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "COMPLETADA",
          actualEndTime: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Confirmación de QR exitosa",
        appointmentId: appointment.id,
      });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (error) {
    console.error("Error en QR confirmation:", error);
    return NextResponse.json(
      { error: "Error al procesar la confirmación QR" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) {
  try {
    const { appointmentId } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: {
          select: { id: true, name: true, email: true },
        },
        provider: {
          include: { user: { select: { name: true } } },
        },
        service: {
          select: {
            name: true,
            publicPrice: true,
            memberPrice: true,
            internalPrice: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 },
      );
    }

    if (token) {
      const isValid = appointment.status === "POR_ATENDER";
      return NextResponse.json({
        valid: isValid,
        appointmentId: appointment.id,
        serviceName: appointment.service.name,
        providerName: appointment.provider.user.name,
        clientName: appointment.client.name,
        status: appointment.status,
      });
    }

    return NextResponse.json({
      appointmentId: appointment.id,
      serviceName: appointment.service.name,
      providerName: appointment.provider.user.name,
      clientName: appointment.client.name,
      status: appointment.status,
      requiresQr: appointment.status === "POR_ATENDER",
    });
  } catch (error) {
    console.error("Error getting QR data:", error);
    return NextResponse.json(
      { error: "Error al obtener datos del QR" },
      { status: 500 },
    );
  }
}
