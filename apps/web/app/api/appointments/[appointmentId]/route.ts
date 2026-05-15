import { NextResponse } from "next/server";
import {
  confirmAppointment,
  cancelAppointment,
  startAppointment,
  completeAppointment,
  getAppointment,
} from "@/lib/actions";
import { getUser } from "@/lib/auth";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { appointmentId } = await params;
    const appointment = await getAppointment(appointmentId);

    if (
      appointment.clientId !== user.id &&
      appointment.providerId !== user.id
    ) {
      const provider = await prisma.serviceProvider.findUnique({
        where: { userId: user.id },
      });
      if (!provider || appointment.providerId !== provider.id) {
        return NextResponse.json(
          { error: "No tienes permiso sobre esta cita" },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(appointment);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al obtener la cita",
      },
      { status: 400 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { appointmentId } = await params;
    const body = await request.json();
    const { action, ...data } = body;

    let result;

    switch (action) {
      case "CONFIRM":
        result = await confirmAppointment(appointmentId);
        break;
      case "CANCEL":
        if (!data.reason) {
          return NextResponse.json(
            { error: "Se requiere motivo de cancelación" },
            { status: 400 },
          );
        }
        result = await cancelAppointment(appointmentId, data.reason);
        break;
      case "START":
        result = await startAppointment(appointmentId);
        break;
      case "COMPLETE":
        result = await completeAppointment(appointmentId, data.providerNotes);
        break;
      default:
        return NextResponse.json(
          { error: "Acción no válida" },
          { status: 400 },
        );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar la acción",
      },
      { status: 400 },
    );
  }
}

import { prisma } from "@saidonclub/database";
