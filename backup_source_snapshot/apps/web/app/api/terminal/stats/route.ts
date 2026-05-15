// ============================================================
// API:        app/api/terminal/stats/route.ts
// PURPOSE:    Proporciona estadísticas en tiempo real para el terminal
// SECURITY:   Requiere autenticación y rol ADMIN o SUPER_ADMIN
// ============================================================

import { NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";

export async function GET() {
  // Verificar autenticación y rol
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    // Obtener estadísticas generales
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
    ] = await Promise.all([
      // Usuarios
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),

      // Proveedores
      prisma.serviceProvider.count(),
      prisma.serviceProvider.count({ where: { status: "ACTIVE" } }),

      // Citas
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
            in: [
              "CANCELADA",
              "CANCELLED_CLIENT",
              "CANCELLED_PROVIDER",
              "NO_SHOW",
            ],
          },
        },
      }),

      // Ingresos del mes actual
      prisma.appointment.aggregate({
        where: {
          status: "COMPLETADA",
          paymentStatus: "COMPLETED",
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: {
          totalCharged: true,
        },
      }),

      // Ingresos de la semana
      prisma.appointment.aggregate({
        where: {
          status: "COMPLETADA",
          paymentStatus: "COMPLETED",
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _sum: {
          totalCharged: true,
        },
      }),

      // Comisiones
      prisma.serviceProvider.aggregate({
        where: {},
        _sum: { pendingDebt: true, totalDebtPaid: true },
      }),

      // Proveedores con advertencias
      prisma.serviceProvider.count({ where: { warningCount: { gt: 0 } } }),

      // Proveedores bloqueados
      prisma.serviceProvider.count({ where: { isDebtBlocked: true } }),
    ]);

    const totalRevenue = Number(revenueData._sum.totalCharged || 0);
    const monthlyRevenue = Number(revenueData._sum.totalCharged || 0);
    const weeklyRevenueAmount = Number(weeklyRevenue._sum.totalCharged || 0);
    const pendingCommissions = Number(commissionData._sum.pendingDebt || 0);
    const paidCommissions = Number(commissionData._sum.totalDebtPaid || 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalProviders,
        activeProviders,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue: weeklyRevenueAmount,
        totalCommissions: pendingCommissions + paidCommissions,
        pendingCommissions,
        paidCommissions,
        warnings: warningData,
        blockedProviders: blockedData,
        activeDebt: pendingCommissions,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching terminal stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
