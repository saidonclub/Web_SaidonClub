import { NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
    });

    if (!provider) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
    }

    const [
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      appointmentsData,
      monthlyAppointments,
      servicesCount,
      reviews,
    ] = await Promise.all([
      prisma.appointment.count({ where: { providerId: provider.id } }),
      prisma.appointment.count({ where: { providerId: provider.id, status: "COMPLETADA" } }),
      prisma.appointment.count({
        where: {
          providerId: provider.id,
          status: { in: ["PENDING_PROVIDER", "SOLICITADA", "CONFIRMADA"] },
        },
      }),
      prisma.appointment.count({
        where: {
          providerId: provider.id,
          status: { in: ["CANCELADA", "CANCELLED_CLIENT", "CANCELLED_PROVIDER", "NO_SHOW"] },
        },
      }),
      prisma.appointment.findMany({
        where: { providerId: provider.id, status: "COMPLETADA" },
        select: { appliedPublicPrice: true },
      }),
      prisma.appointment.findMany({
        where: {
          providerId: provider.id,
          status: "COMPLETADA",
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        select: { appliedPublicPrice: true },
      }),
      prisma.serviceListing.count({ where: { providerId: provider.id, isActive: true } }),
      prisma.providerReview.findMany({ where: { providerId: provider.id }, select: { rating: true } }),
    ]);

    const totalRevenue = appointmentsData.reduce(
      (sum: number, a) => sum + Number(a.appliedPublicPrice ?? 0),
      0,
    );
    const monthlyRevenue = monthlyAppointments.reduce(
      (sum: number, a) => sum + Number(a.appliedPublicPrice ?? 0),
      0,
    );
    const rating =
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    const stats = {
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      totalRevenue,
      monthlyRevenue,
      pendingPayments: Number(provider.pendingDebt ?? 0),
      paidPayments: Number(provider.totalDebtPaid ?? 0),
      warnings: provider.warningCount,
      blocked: provider.isDebtBlocked,
      rating,
      servicesCount,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error en terminal/provider/stats:", error);
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}