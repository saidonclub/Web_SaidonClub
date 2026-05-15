import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  try {
    const { serviceId } = await params;

    const service = await prisma.serviceListing.findUnique({
      where: { id: serviceId },
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!service || !service.isActive) {
      return NextResponse.json(
        { error: "Servicio no encontrado o inactivo" },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error getting service:", error);
    return NextResponse.json(
      { error: "Error al obtener servicio" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { serviceId } = await params;
    const body = await request.json();

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "No eres un proveedor de servicios" },
        { status: 403 },
      );
    }

    const service = await prisma.serviceListing.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.providerId !== provider.id) {
      return NextResponse.json(
        { error: "Servicio no encontrado o no te pertenece" },
        { status: 404 },
      );
    }

    const allowedFields = [
      "name",
      "description",
      "category",
      "publicPrice",
      "memberPrice",
      "internalPrice",
      "companyCommission",
      "commissionPercentage",
      "ivaPercentage",
      "ivaIncluded",
      "modality",
      "duration",
      "allowEmergency",
      "emergencySurcharge",
      "requiresPrePayment",
      "isActive",
    ];

    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const updated = await prisma.serviceListing.update({
      where: { id: serviceId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { serviceId } = await params;

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "No eres un proveedor de servicios" },
        { status: 403 },
      );
    }

    const service = await prisma.serviceListing.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.providerId !== provider.id) {
      return NextResponse.json(
        { error: "Servicio no encontrado o no te pertenece" },
        { status: 404 },
      );
    }

    await prisma.serviceListing.update({
      where: { id: serviceId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Error al eliminar servicio" },
      { status: 500 },
    );
  }
}
