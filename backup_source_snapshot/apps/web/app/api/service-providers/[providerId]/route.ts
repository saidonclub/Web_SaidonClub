import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> },
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { providerId } = await params;
    const body = await request.json();
    const { action, reason } = body;

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 },
      );
    }

    let updated;

    switch (action) {
      case "approve":
        updated = await prisma.serviceProvider.update({
          where: { id: providerId },
          data: {
            status: "ACTIVE",
            kycStatus: "APPROVED",
            kycApprovedAt: new Date(),
            kycApprovedByUserId: user.id,
          },
        });
        break;

      case "reject":
        if (!reason) {
          return NextResponse.json(
            { error: "Se requiere motivo de rechazo" },
            { status: 400 },
          );
        }
        updated = await prisma.serviceProvider.update({
          where: { id: providerId },
          data: {
            status: "REJECTED",
            kycStatus: "REJECTED",
            kycRejectionReason: reason,
          },
        });
        break;

      case "request_update":
        if (!reason) {
          return NextResponse.json(
            { error: "Se requiere motivo de actualización" },
            { status: 400 },
          );
        }
        updated = await prisma.serviceProvider.update({
          where: { id: providerId },
          data: {
            status: "REQUIRES_UPDATE",
            kycStatus: "REQUIRES_UPDATE",
            kycRejectionReason: reason,
          },
        });
        break;

      case "suspend":
        updated = await prisma.serviceProvider.update({
          where: { id: providerId },
          data: {
            status: "SUSPENDED_TEMP",
          },
        });
        break;

      case "suspend_permanent":
        updated = await prisma.serviceProvider.update({
          where: { id: providerId },
          data: {
            status: "SUSPENDED_PERM",
          },
        });
        break;

      case "reactivate":
        updated = await prisma.serviceProvider.update({
          where: { id: providerId },
          data: {
            status: "ACTIVE",
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Acción no válida" },
          { status: 400 },
        );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating service provider:", error);
    return NextResponse.json(
      { error: "Error al actualizar proveedor" },
      { status: 500 },
    );
  }
}
