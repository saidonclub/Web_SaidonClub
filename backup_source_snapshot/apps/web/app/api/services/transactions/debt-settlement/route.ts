import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";

export async function GET(_request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
      include: {
        user: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Perfil de proveedor no encontrado" },
        { status: 404 },
      );
    }

    const pendingDebt = Number(provider.pendingDebt || 0);
    const totalDebtPaid = Number(provider.totalDebtPaid || 0);

    const recentTransactions = await prisma.appointment.findMany({
      where: {
        providerId: provider.id,
        status: "COMPLETADA",
        paymentStatus: "COMPLETED",
      },
      orderBy: { paidAt: "desc" },
      take: 10,
      select: {
        id: true,
        totalCharged: true,
        companyCommissionAmount: true,
        paidAt: true,
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalGenerated = recentTransactions.reduce(
      (sum, apt) => sum + Number(apt.companyCommissionAmount || 0),
      0,
    );

    return NextResponse.json({
      providerId: provider.id,
      businessName: provider.businessName,
      pendingDebt: pendingDebt,
      totalDebtPaid: totalDebtPaid,
      isBlocked: provider.isDebtBlocked || false,
      lastSettlement: provider.lastDebtSettlement,
      recentTransactions: recentTransactions.map((apt) => ({
        id: apt.id,
        serviceName: apt.service.name,
        amount: apt.totalCharged,
        commission: apt.companyCommissionAmount,
        date: apt.paidAt,
      })),
      summary: {
        totalGenerated,
        transactionCount: recentTransactions.length,
        averageCommission:
          recentTransactions.length > 0
            ? totalGenerated / recentTransactions.length
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching debt status:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, paymentMethod, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Monto inválido para liquidación" },
        { status: 400 },
      );
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Perfil de proveedor no encontrado" },
        { status: 404 },
      );
    }

    const currentDebt = Number(provider.pendingDebt || 0);

    if (amount > currentDebt) {
      return NextResponse.json(
        {
          error: `El monto excede la deuda pendiente. Deuda actual: $${currentDebt.toFixed(2)}`,
        },
        { status: 400 },
      );
    }

    if (provider.isDebtBlocked) {
      return NextResponse.json(
        {
          error:
            "Cuenta bloqueada. Contacte a SaidonClub para desbloquear su cuenta.",
        },
        { status: 403 },
      );
    }

    const settlementResult = await prisma.$transaction(async (tx) => {
      const newDebt = currentDebt - amount;
      const newTotalPaid = Number(provider.totalDebtPaid || 0) + amount;

      await tx.serviceProvider.update({
        where: { id: provider.id },
        data: {
          pendingDebt: newDebt,
          totalDebtPaid: newTotalPaid,
          lastDebtSettlement: new Date(),
          isDebtBlocked: newDebt > 50 ? true : false,
        },
      });

      const settlement = await tx.debtSettlement.create({
        data: {
          providerId: provider.id,
          amount: amount,
          paymentMethod: paymentMethod || "BANK_TRANSFER",
          previousDebt: currentDebt,
          newDebt: newDebt,
          settlementDate: new Date(),
          notes:
            notes ||
            `Liquidación de deuda por ${paymentMethod || "transferencia"}`,
          status: "COMPLETED",
        },
      });

      return {
        settlement,
        previousDebt: currentDebt,
        newDebt,
        amountPaid: amount,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Liquidación de deuda procesada exitosamente",
      settlement: {
        id: settlementResult.settlement.id,
        amount: settlementResult.amountPaid,
        previousDebt: settlementResult.previousDebt,
        newDebt: settlementResult.newDebt,
        date: settlementResult.settlement.settlementDate,
        paymentMethod: settlementResult.settlement.paymentMethod,
      },
    });
  } catch (error) {
    console.error("Error processing debt settlement:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
