import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";
import { calculateCommissionForTransaction } from "@/lib/data/pricing";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, paymentMethod } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Falta appointmentId" },
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
        provider: true,
        client: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 },
      );
    }

    if (appointment.clientId !== user.id) {
      return NextResponse.json(
        { error: "Solo el cliente puede iniciar el pago" },
        { status: 403 },
      );
    }

    const finalPrice = Number(
      appointment.appliedMemberPrice || appointment.service.memberPrice,
    );
    const internalPrice = Number(appointment.service.internalPrice);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet || Number(wallet.balanceAvailable) < finalPrice) {
      return NextResponse.json(
        { error: "Saldo insuficiente" },
        { status: 400 },
      );
    }

    const commissionCalc = await calculateCommissionForTransaction(
      finalPrice,
      internalPrice,
    );

    const result = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: user.id },
        data: {
          balanceAvailable: {
            decrement: finalPrice,
          },
        },
      });

      const currentDate = new Date();
      await tx.pointsLedger.create({
        data: {
          userId: user.id,
          sourceType: "MARKETPLACE",
          amount: -finalPrice,
          cycleMonth: currentDate.getMonth() + 1,
          cycleYear: currentDate.getFullYear(),
          orderId: appointmentId,
          description: `Pago de servicio: ${appointment.service.name}`,
        },
      });

      const providerDebt = await tx.serviceProvider.findUnique({
        where: { id: appointment.providerId },
      });

      const currentDebt = Number(providerDebt?.pendingDebt || 0);
      const newDebt = currentDebt + commissionCalc.commission;

      if (newDebt > 0) {
        await tx.serviceProvider.update({
          where: { id: appointment.providerId },
          data: {
            pendingDebt: newDebt,
          },
        });
      }

      const paymentAmountToProvider = finalPrice - commissionCalc.commission;

      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "COMPLETADA",
          totalCharged: finalPrice,
          companyCommissionAmount: commissionCalc.commission,
          providerNetAmount: paymentAmountToProvider,
          ivaAmount: commissionCalc.ivaAmount,
          appliedIvaPercentage: commissionCalc.ivaPercentage,
          paymentMethod: paymentMethod || "PLATFORM_WALLET",
          paymentStatus: "COMPLETED",
          paidAt: new Date(),
        },
      });

      const invoiceNumber = `INV-PRE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const invoice = await tx.serviceInvoice.create({
        data: {
          appointmentId,
          invoiceNumber,
          providerLegalName: appointment.provider.businessName,
          providerAgreementNumber:
            appointment.provider.agreementNumber || "AGR-001",
          clientLegalName: user.name || "Cliente",
          clientIdDocument: user.id,
          clientIdType: "CEDULA",
          subtotal: commissionCalc.finalPrice - commissionCalc.ivaAmount,
          ivaPercentage: commissionCalc.ivaPercentage,
          ivaAmount: commissionCalc.ivaAmount,
          total: commissionCalc.finalPrice,
          companyCommission: commissionCalc.commission,
          providerNetPayment: paymentAmountToProvider,
          agreementInternalPrice: internalPrice,
          invoiceStatus: "ISSUED",
        },
      });

      await tx.serviceAccountingEntry.create({
        data: {
          invoiceId: invoice.id,
          agreementNumber: appointment.provider.agreementNumber || "AGR-001",
          providerCode: appointment.providerId,
          serviceDate: new Date(),
          clientChargedTotal: commissionCalc.finalPrice,
          ivaAmount: commissionCalc.ivaAmount,
          companyCommission: commissionCalc.commission,
          providerNetPayment: paymentAmountToProvider,
        },
      });

      return {
        success: true,
        invoice,
        payment: {
          amountCharged: finalPrice,
          providerReceives: paymentAmountToProvider,
          commission: commissionCalc.commission,
          debtGenerated: commissionCalc.commission,
        },
      };
    });

    return NextResponse.json({
      success: true,
      message: "Pago realizado exitosamente",
      payment: result.payment,
      invoiceNumber: result.invoice.invoiceNumber,
    });
  } catch (error) {
    console.error("Error en pago prepaid:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
