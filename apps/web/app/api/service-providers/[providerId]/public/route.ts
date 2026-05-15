import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> },
) {
  try {
    const { providerId } = await params;

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: providerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            publicPrice: true,
            memberPrice: true,
            modality: true,
            duration: true,
            allowEmergency: true,
            emergencySurcharge: true,
            requiresPrePayment: true,
          },
        },
        schedules: {
          where: { isActive: true },
        },
      },
    });

    if (!provider || provider.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Proveedor no encontrado o inactivo" },
        { status: 404 },
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Error getting service provider:", error);
    return NextResponse.json(
      { error: "Error al obtener proveedor" },
      { status: 500 },
    );
  }
}
