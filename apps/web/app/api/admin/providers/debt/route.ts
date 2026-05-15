import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";

export const dynamic = "force-dynamic";

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
    const status = searchParams.get("status");
    const minDebt = searchParams.get("minDebt");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const whereClause: Record<string, unknown> = {};

    if (status === "blocked") {
      whereClause.isDebtBlocked = true;
    } else if (status === "active") {
      whereClause.isDebtBlocked = false;
    }

    if (minDebt) {
      whereClause.pendingDebt = {
        gte: parseFloat(minDebt),
      };
    }

    const [providers, total] = await Promise.all([
      prisma.serviceProvider.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              appointments: {
                where: {
                  status: "COMPLETADA",
                  paymentStatus: "COMPLETED",
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          pendingDebt: "desc",
        },
      }),
      prisma.serviceProvider.count({
        where: whereClause,
      }),
    ]);

    const totalDebt = providers.reduce(
      (sum, p) => sum + Number(p.pendingDebt || 0),
      0,
    );
    const totalDebtPaid = providers.reduce(
      (sum, p) => sum + Number(p.totalDebtPaid || 0),
      0,
    );

    return NextResponse.json({
      providers: providers.map((p) => ({
        id: p.id,
        businessName: p.businessName,
        profession: p.profession,
        email: p.email,
        phone: p.phone,
        pendingDebt: Number(p.pendingDebt || 0),
        totalDebtPaid: Number(p.totalDebtPaid || 0),
        isBlocked: p.isDebtBlocked,
        lastSettlement: p.lastDebtSettlement,
        completedAppointments: p._count.appointments,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: {
        totalProviders: total,
        totalPendingDebt: totalDebt,
        totalDebtPaid,
        blockedProviders: providers.filter((p) => p.isDebtBlocked).length,
      },
    });
  } catch (error) {
    console.error("Error fetching provider debts:", error);
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
    const { providerId, action, amount, notes } = body;

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

    if (action === "block") {
      await prisma.serviceProvider.update({
        where: { id: providerId },
        data: {
          isDebtBlocked: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Proveedor bloqueado por deuda",
      });
    }

    if (action === "unblock") {
      await prisma.serviceProvider.update({
        where: { id: providerId },
        data: {
          isDebtBlocked: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Proveedor desbloqueado",
      });
    }

    if (action === "adjust") {
      if (!amount) {
        return NextResponse.json(
          { error: "Monto de ajuste requerido" },
          { status: 400 },
        );
      }

      const currentDebt = Number(provider.pendingDebt || 0);
      const newDebt = currentDebt + amount;

      await prisma.serviceProvider.update({
        where: { id: providerId },
        data: {
          pendingDebt: Math.max(0, newDebt),
        },
      });

      await prisma.debtSettlement.create({
        data: {
          providerId,
          amount: Math.abs(amount),
          paymentMethod: "ADMIN_ADJUSTMENT",
          previousDebt: currentDebt,
          newDebt: Math.max(0, newDebt),
          notes:
            notes ||
            `Ajuste manual por administrador: ${amount > 0 ? "aumento" : "disminución"} de $${Math.abs(amount)}`,
          status: "COMPLETED",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Deuda ajustada correctamente",
        newDebt: Math.max(0, newDebt),
      });
    }

    if (action === "waive") {
      const currentDebt = Number(provider.pendingDebt || 0);

      await prisma.serviceProvider.update({
        where: { id: providerId },
        data: {
          pendingDebt: 0,
          lastDebtSettlement: new Date(),
        },
      });

      await prisma.debtSettlement.create({
        data: {
          providerId,
          amount: currentDebt,
          paymentMethod: "WAIVER",
          previousDebt: currentDebt,
          newDebt: 0,
          notes: notes || "Renuncia de deuda por administrador",
          status: "COMPLETED",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Deuda condonada",
        waivedAmount: currentDebt,
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error managing provider debt:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
