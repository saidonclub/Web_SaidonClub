import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";
import { calculateCommissionForTransaction } from "@/lib/data/pricing";

async function getClientIp(request: NextRequest): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, action, amount, paymentMethod } = body;

    if (!appointmentId || !action) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
        provider: true,
        client: true,
        bipartiteForm: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 },
      );
    }

    const isProvider = appointment.providerId === user.id;
    const isClient = appointment.clientId === user.id;

    if (!isProvider && !isClient) {
      return NextResponse.json(
        { error: "No autorizado para esta cita" },
        { status: 403 },
      );
    }

    const ipAddress = await getClientIp(request);

    let verification = await prisma.transactionVerification.findUnique({
      where: { appointmentId },
    });

    if (action === "providerDeclare") {
      if (!isProvider) {
        return NextResponse.json(
          { error: "Solo el proveedor puede declarar el monto" },
          { status: 403 },
        );
      }

      if (!amount || amount < 0) {
        return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
      }

      verification = await prisma.transactionVerification.upsert({
        where: { appointmentId },
        create: {
          appointmentId,
          providerAmount: amount,
          clientAmount: 0,
          providerDeclaredAt: new Date(),
          providerIpAddress: ipAddress,
          paymentMethod: paymentMethod || "CASH",
          verificationStatus: "PENDING",
        },
        update: {
          providerAmount: amount,
          providerDeclaredAt: new Date(),
          providerIpAddress: ipAddress,
          paymentMethod: paymentMethod || "CASH",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Monto registrado por proveedor",
        verification: {
          status: verification.verificationStatus,
          providerDeclared: true,
          clientDeclared: !!verification.clientDeclaredAt,
        },
      });
    }

    if (action === "clientDeclare") {
      if (!isClient) {
        return NextResponse.json(
          { error: "Solo el cliente puede declarar el monto" },
          { status: 403 },
        );
      }

      if (!amount || amount < 0) {
        return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
      }

      const existingVerification =
        await prisma.transactionVerification.findUnique({
          where: { appointmentId },
        });

      if (!existingVerification || !existingVerification.providerDeclaredAt) {
        return NextResponse.json(
          { error: "El proveedor debe declarar primero el monto" },
          { status: 400 },
        );
      }

      verification = await prisma.transactionVerification.update({
        where: { appointmentId },
        data: {
          clientAmount: amount,
          clientDeclaredAt: new Date(),
          clientIpAddress: ipAddress,
        },
      });

      const providerAmount = Number(verification.providerAmount);
      const clientAmount = Number(verification.clientAmount);
      const tolerance = 0.01;
      const amountsMatch = Math.abs(providerAmount - clientAmount) <= tolerance;

      if (amountsMatch) {
        const commissionCalc = await calculateCommissionForTransaction(
          clientAmount,
          Number(appointment.service.internalPrice),
        );

        await prisma.transactionVerification.update({
          where: { id: verification.id },
          data: {
            verificationStatus: "MATCHED",
            matchedAt: new Date(),
            amountAgreed: clientAmount,
            commissionAmount: commissionCalc.commission,
            debtGenerated: commissionCalc.commission,
          },
        });

        await prisma.serviceProvider.update({
          where: { id: appointment.providerId },
          data: {
            pendingDebt: {
              increment: commissionCalc.commission,
            },
          },
        });

        await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: "COMPLETADA",
            totalCharged: clientAmount,
            companyCommissionAmount: commissionCalc.commission,
            providerNetAmount: commissionCalc.providerNetPayment,
            ivaAmount: commissionCalc.ivaAmount,
            appliedIvaPercentage: commissionCalc.ivaPercentage,
            paidAt: new Date(),
            paymentStatus: "COMPLETED",
            paymentMethod: verification.paymentMethod,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Verificación exitosa - transacción registrada",
          verification: {
            status: "MATCHED",
            amountAgreed: clientAmount,
            commission: commissionCalc.commission,
            debtGenerated: commissionCalc.commission,
          },
        });
      } else {
        await prisma.transactionVerification.update({
          where: { id: verification.id },
          data: {
            verificationStatus: "MISMATCH",
            alertTriggeredAt: new Date(),
            alertReason: `Monto proveedor: $${providerAmount} vs monto cliente: $${clientAmount} - Diferencia: $${Math.abs(providerAmount - clientAmount).toFixed(2)}`,
          },
        });

        const provider = await prisma.serviceProvider.findUnique({
          where: { id: appointment.providerId },
          select: { warningCount: true, isDebtBlocked: true },
        });

        const currentWarnings = provider?.warningCount || 0;
        const newWarningCount = currentWarnings + 1;
        const shouldBlock = newWarningCount >= 3;

        await prisma.serviceProvider.update({
          where: { id: appointment.providerId },
          data: {
            warningCount: newWarningCount,
            lastWarningAt: new Date(),
            isDebtBlocked: shouldBlock,
          },
        });

        await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: "DISPUTE",
          },
        });

        if (shouldBlock) {
          return NextResponse.json({
            success: false,
            error: "BLOQUEO: Superaste el límite de 3 advertencias",
            alert: {
              reason: `Proveedor: $${providerAmount} | Cliente: $${clientAmount}`,
              providerBlocked: true,
              warningNumber: newWarningCount,
              maxWarnings: 3,
            },
          });
        }

        return NextResponse.json({
          success: false,
          warning: `ADVERTENCIA ${newWarningCount}/3: Los montos no coinciden`,
          alert: {
            reason: `Proveedor: $${providerAmount} | Cliente: $${clientAmount}`,
            providerBlocked: false,
            warningNumber: newWarningCount,
            maxWarnings: 3,
          },
        });
      }
    }

    if (action === "checkStatus") {
      if (!verification) {
        return NextResponse.json({
          status: "NOT_STARTED",
        });
      }

      return NextResponse.json({
        status: verification.verificationStatus,
        providerDeclared: !!verification.providerDeclaredAt,
        clientDeclared: !!verification.clientDeclaredAt,
        providerAmount: verification.providerAmount,
        clientAmount: verification.clientAmount,
        alertTriggered: verification.verificationStatus === "MISMATCH",
        alertReason: verification.alertReason,
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error en verificación de transacción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
