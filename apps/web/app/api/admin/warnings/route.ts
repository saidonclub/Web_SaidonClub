// ============================================================
// API:        app/api/admin/warnings/route.ts
// PURPOSE:    Gestión de advertencias de discrepancias de pago
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acceso restringido a administradores" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Obtener proveedores con advertencias
    const [providers, totalProviders] = await Promise.all([
      prisma.serviceProvider.findMany({
        where: {
          warningCount: { gt: 0 },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          appointments: {
            where: {
              paymentStatus: "COMPLETED",
              paymentMethod: { in: ["PREPAGADO", "POSTPAGADO"] },
            },
            take: 10,
            orderBy: { createdAt: "desc" },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { lastWarningAt: "desc" },
      }),
      prisma.serviceProvider.count({
        where: { warningCount: { gt: 0 } },
      }),
    ]);

    // Obtener estadísticas
    const [totalWithWarnings, activeWarnings, blockedProviders] =
      await Promise.all([
        prisma.serviceProvider.count({
          where: { warningCount: { gt: 0 } },
        }),
        prisma.serviceProvider.count({
          where: { warningCount: { gt: 0 }, isDebtBlocked: false },
        }),
        prisma.serviceProvider.count({
          where: { isDebtBlocked: true },
        }),
      ]);

    // Transformar datos para el frontend
    const warnings = providers.flatMap((provider) => {
      const warningNum = provider.warningCount;
      const status = provider.isDebtBlocked
        ? "BLOCKED"
        : warningNum >= 2
          ? "ACTIVE"
          : "ACTIVE";

      return provider.appointments.slice(0, 5).map((apt) => ({
        id: apt.id,
        providerId: provider.id,
        providerName:
          provider.user?.name || provider.businessName || "Sin nombre",
        providerEmail: provider.user?.email || provider.email || "",
        appointmentId: apt.id,
        providerAmount: Number(apt.appliedInternalPrice || 0),
        clientAmount: Number(apt.appliedPublicPrice || 0),
        discrepancy: Math.abs(
          Number(apt.appliedPublicPrice || 0) -
            Number(apt.appliedInternalPrice || 0),
        ),
        warningNumber: warningNum,
        createdAt:
          provider.lastWarningAt?.toISOString() ||
          provider.updatedAt.toISOString(),
        status: status as "ACTIVE" | "RESOLVED" | "BLOCKED",
      }));
    });

    return NextResponse.json({
      warnings,
      pagination: {
        page,
        limit,
        total: totalProviders,
        pages: Math.ceil(totalProviders / limit),
      },
      stats: {
        totalWarnings: totalWithWarnings,
        activeWarnings,
        resolvedWarnings: totalWithWarnings - activeWarnings,
        blockedProviders,
        warningRate:
          totalWithWarnings > 0
            ? (activeWarnings / totalWithWarnings) * 100
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching warnings:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acceso restringido a administradores" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { providerId, action } = body;

    if (!providerId || !action) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 },
      );
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Proveedor no encontrado" },
        { status: 404 },
      );
    }

    if (action === "reset_warnings") {
      await prisma.serviceProvider.update({
        where: { id: providerId },
        data: {
          warningCount: 0,
          lastWarningAt: null,
          isDebtBlocked: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Advertencias del proveedor reseteadas",
      });
    }

    if (action === "block") {
      await prisma.serviceProvider.update({
        where: { id: providerId },
        data: { isDebtBlocked: true },
      });

      return NextResponse.json({
        success: true,
        message: "Proveedor bloqueado",
      });
    }

    if (action === "unblock") {
      await prisma.serviceProvider.update({
        where: { id: providerId },
        data: { isDebtBlocked: false },
      });

      return NextResponse.json({
        success: true,
        message: "Proveedor desbloqueado",
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error managing warning:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
