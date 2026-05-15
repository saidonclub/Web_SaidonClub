import { NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const [
      totalUsers,
      activeUsers,
      totalProviders,
      activeProviders,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      revenueData,
      weeklyRevenue,
      commissionData,
      warningData,
      blockedData,
      activeDebtData,
      kycPendingData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.serviceProvider.count(),
      prisma.serviceProvider.count({ where: { status: "ACTIVE" } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "COMPLETADA" } }),
      prisma.appointment.count({
        where: {
          status: {
            in: [
              "PENDING_PROVIDER",
              "SOLICITADA",
              "CONFIRMADA",
              "PENDING_CLIENT",
              "PENDING_PAYMENT",
            ],
          },
        },
      }),
      prisma.appointment.count({
        where: {
          status: {
            in: ["CANCELADA", "CANCELLED_CLIENT", "CANCELLED_PROVIDER", "NO_SHOW"],
          },
        },
      }),
      prisma.appointment.aggregate({
        where: { status: "COMPLETADA" },
        _sum: { appliedPublicPrice: true },
      }),
      prisma.appointment.aggregate({
        where: {
          status: "COMPLETADA",
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        _sum: { appliedPublicPrice: true },
      }),
      prisma.serviceProvider.aggregate({
        where: {},
        _sum: { pendingDebt: true, totalDebtPaid: true },
      }),
      prisma.serviceProvider.count({ where: { warningCount: { gte: 1 } } }),
      prisma.serviceProvider.count({ where: { isDebtBlocked: true } }),
      prisma.serviceProvider.aggregate({
        where: {},
        _sum: { pendingDebt: true },
      }),
      prisma.serviceProvider.count({ where: { kycStatus: "SUBMITTED" } }),
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      totalProviders,
      activeProviders,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      totalRevenue: Number(revenueData._sum.appliedPublicPrice ?? 0),
      monthlyRevenue: Number(revenueData._sum.appliedPublicPrice ?? 0),
      weeklyRevenue: Number(weeklyRevenue._sum.appliedPublicPrice ?? 0),
      totalCommissions:
        Number(commissionData._sum.pendingDebt ?? 0) +
        Number(commissionData._sum.totalDebtPaid ?? 0),
      pendingCommissions: Number(commissionData._sum.pendingDebt ?? 0),
      paidCommissions: Number(commissionData._sum.totalDebtPaid ?? 0),
      warnings: warningData,
      blockedProviders: blockedData,
      activeDebt: Number(activeDebtData._sum.pendingDebt ?? 0),
      pendingWithdrawals: 0,
      kycPending: kycPendingData,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error en terminal/admin/stats:", error);
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}