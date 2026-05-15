import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeUsers,
      newUsersLast7Days,
      recentOrders,
      monthOrders,
      activeMemberships,
      activatedUsers,
      usersWithReferrals,
      pendingCommissions,
      completedOrdersMonth,
      cancelledOrdersMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { totalAmount: true, status: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfMonth } },
        select: { totalAmount: true, status: true },
      }),
      prisma.membership.count(),
      prisma.user.count({
        where: { activation: { isActive: true } },
      }),
      prisma.user.count({
        where: { sponsorId: { not: null } },
      }),
      prisma.commission.aggregate({
        _sum: { amount: true },
        where: { status: "PENDING" },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startOfMonth },
          status: "DELIVERED",
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startOfMonth },
          status: "CANCELLED",
        },
      }),
    ]);

    // --- Métricas calculadas ---

    const purchasesLast7Days = recentOrders.length;

    const monthlyRevenue = monthOrders.reduce((sum, order) => {
      const amount =
        typeof order.totalAmount === "number"
          ? order.totalAmount
          : Number(order.totalAmount);
      return sum + amount;
    }, 0);

    const avgPurchaseValue =
      purchasesLast7Days > 0
        ? recentOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0) /
          purchasesLast7Days
        : 0;

    // % de usuarios que compraron en los últimos 7 días sobre total de usuarios
    const purchaseRate7Days =
      totalUsers > 0
        ? Math.round((purchasesLast7Days / totalUsers) * 100)
        : 0;

    // Tasa de activación: usuarios con activation.isActive / total
    const activationRate7Days =
      totalUsers > 0 ? Math.round((activatedUsers / totalUsers) * 100) : 0;

    // Tasa de referidos: usuarios con sponsor / total
    const referralRate =
      totalUsers > 0 ? Math.round((usersWithReferrals / totalUsers) * 100) : 0;

    // Tasa de conversión del mes: órdenes completadas / (completadas + canceladas)
    const totalClosedOrders = completedOrdersMonth + cancelledOrdersMonth;
    const conversionRate =
      totalClosedOrders > 0
        ? Math.round((completedOrdersMonth / totalClosedOrders) * 100)
        : 0;

    // Crecimiento de usuarios (nuevos en 7 días vs total)
    const userGrowthRate =
      totalUsers > 0 ? Math.round((newUsersLast7Days / totalUsers) * 100) : 0;

    return NextResponse.json({
      // Métricas base
      activationRate7Days,
      activeUsers,
      totalUsers,
      purchasesLast7Days,
      avgPurchaseValue: Math.round(avgPurchaseValue * 100) / 100,
      referralRate,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      pendingCommissions: Number(pendingCommissions._sum.amount || 0),
      activeMemberships,
      // Métricas nuevas
      purchaseRate7Days,
      conversionRate,
      newUsersLast7Days,
      userGrowthRate,
      completedOrdersMonth,
    });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return NextResponse.json(
      { error: "Error al obtener KPIs. Intente de nuevo." },
      { status: 500 }
    );
  }
}
