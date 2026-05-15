"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export type FormPaymentType =
  | "PLATFORM_PREPAID"
  | "DIRECT_CASH"
  | "DIRECT_CARD"
  | "PLATFORM_POINTS";

export type BipartiteFormStatus =
  | "PROVIDER_FILLING"
  | "PENDING_CLIENT_ACCEPTANCE"
  | "BOTH_SIGNED"
  | "DISPUTED";

export interface CreateBipartiteFormInput {
  appointmentId: string;
  serviceDescription: string;
  additionalServicesGiven?: import("@saidonclub/database").Prisma.InputJsonValue;
  baseServiceValue: number;
  extraServicesValue?: number;
  paymentTypeUsed: FormPaymentType;
  providerObservations?: string;
  isObservationPrivate?: boolean;
  providerDeclares: string;
}

export interface ProviderSignBipartiteFormInput {
  formId: string;
  signatureData: string;
  declarations: string;
}

export interface ClientRespondBipartiteFormInput {
  formId: string;
  action: "accept" | "reject";
  signatureData?: string;
  declarations?: string;
  rejectionReason?: string;
}

async function getClientIp(): Promise<string> {
  return "127.0.0.1";
}

export async function createBipartiteForm(input: CreateBipartiteFormInput) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: input.appointmentId },
    include: {
      service: true,
      provider: {
        include: { user: true },
      },
      client: true,
    },
  });

  if (!appointment) {
    return { error: "Cita no encontrada" };
  }

  if (appointment.providerId !== user.id && appointment.clientId !== user.id) {
    return { error: "No autorizado para crear formulario en esta cita" };
  }

  if (appointment.providerId !== user.id) {
    return { error: "Solo el proveedor puede crear el formulario bipartito" };
  }

  const existingForm = await prisma.bipartiteForm.findUnique({
    where: { appointmentId: input.appointmentId },
  });

  if (existingForm) {
    return { error: "Ya existe un formulario bipartito para esta cita" };
  }

  const ivaPercentage = Number(appointment.service.ivaPercentage || 15);
  let ivaAmount = 0;
  const totalServiceValue =
    input.baseServiceValue + (input.extraServicesValue || 0);

  if (appointment.service.ivaIncluded) {
    ivaAmount =
      totalServiceValue - totalServiceValue / (1 + ivaPercentage / 100);
  } else {
    ivaAmount = totalServiceValue * (ivaPercentage / 100);
  }

  const totalWithIva = totalServiceValue + ivaAmount;

  const form = await prisma.bipartiteForm.create({
    data: {
      appointmentId: input.appointmentId,
      serviceDescription: input.serviceDescription,
      additionalServicesGiven: input.additionalServicesGiven !== undefined ? input.additionalServicesGiven : undefined,
      baseServiceValue: input.baseServiceValue,
      extraServicesValue: input.extraServicesValue || 0,
      totalServiceValue: totalServiceValue,
      ivaApplied: ivaAmount,
      totalWithIva: totalWithIva,
      paymentTypeUsed: input.paymentTypeUsed,
      providerObservations: input.providerObservations || null,
      isObservationPrivate: input.isObservationPrivate || false,
      providerDeclares: input.providerDeclares,
      // Estado inicial: proveedor debe revisar y firmar antes de enviar al cliente
      formStatus: "PROVIDER_FILLING",
    },
  });

  // Cambia el estado de la cita a PENDING_CLIENT al crear el formulario
  await prisma.appointment.update({
    where: { id: input.appointmentId },
    data: { status: "PENDING_CLIENT" },
  });

  revalidatePath(`/appointments/${input.appointmentId}`);
  return { success: true, form };
}

export async function getBipartiteFormByAppointment(appointmentId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    return { error: "Cita no encontrada" };
  }

  if (appointment.providerId !== user.id && appointment.clientId !== user.id) {
    return { error: "No autorizado para ver este formulario" };
  }

  const form = await prisma.bipartiteForm.findUnique({
    where: { appointmentId },
    include: {
      appointment: {
        include: {
          service: true,
          provider: {
            include: { user: true },
          },
          client: true,
        },
      },
    },
  });

  if (!form) {
    return { error: "Formulario no encontrado" };
  }

  const isProvider = appointment.providerId === user.id;

  if (isProvider) {
    return {
      form: {
        ...form,
        clientDeclares: form.clientDeclares,
        clientAcceptedAt: form.clientAcceptedAt,
        clientRejectedAt: form.clientRejectedAt,
        clientRejectionReason: form.clientRejectionReason,
      },
    };
  }

  return { form };
}

export async function providerSignBipartiteForm(
  input: ProviderSignBipartiteFormInput,
) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const form = await prisma.bipartiteForm.findUnique({
    where: { id: input.formId },
    include: { appointment: true },
  });

  if (!form) {
    return { error: "Formulario no encontrado" };
  }

  if (form.appointment.providerId !== user.id) {
    return { error: "Solo el proveedor puede firmar este formulario" };
  }

  // El proveedor puede firmar cuando el formulario está en PROVIDER_FILLING
  if (form.formStatus !== "PROVIDER_FILLING" && form.formStatus !== "PENDING_CLIENT_ACCEPTANCE") {
    return { error: "El formulario no está en un estado que permita la firma del proveedor" };
  }

  const ipAddress = await getClientIp();

  const updatedForm = await prisma.bipartiteForm.update({
    where: { id: input.formId },
    data: {
      providerSignedAt: new Date(),
      providerSignatureData: input.signatureData,
      providerDeclares: input.declarations,
      providerIpAddress: ipAddress,
      formStatus: "PENDING_CLIENT_ACCEPTANCE",
    },
  });

  await prisma.appointmentAuditLog.create({
    data: {
      appointmentId: form.appointmentId,
      fromStatus: form.appointment.status,
      toStatus: "PENDING_CLIENT",
      triggeredByRole: "PROVIDER",
      triggeredById: user.id,
      reason: "Proveedor firmó formulario bipartito",
    },
  });

  revalidatePath(`/appointments/${form.appointmentId}`);
  return { success: true, form: updatedForm };
}

export async function clientRespondToBipartiteForm(
  input: ClientRespondBipartiteFormInput,
) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const form = await prisma.bipartiteForm.findUnique({
    where: { id: input.formId },
    include: {
      appointment: {
        include: {
          service: true,
          provider: {
            include: { user: true },
          },
          client: true,
        },
      },
    },
  });

  if (!form) {
    return { error: "Formulario no encontrado" };
  }

  if (form.appointment.clientId !== user.id) {
    return { error: "Solo el cliente puede responder a este formulario" };
  }

  if (form.formStatus !== "PENDING_CLIENT_ACCEPTANCE") {
    return { error: "El formulario no está en estado de espera de aceptación" };
  }

  const ipAddress = await getClientIp();

  if (input.action === "accept") {
    const result = await prisma.$transaction(async (tx) => {
      const updatedForm = await tx.bipartiteForm.update({
        where: { id: input.formId },
        data: {
          clientAcceptedAt: new Date(),
          clientSignatureData: input.signatureData || null,
          clientDeclares: input.declarations || null,
          clientIpAddress: ipAddress,
          formStatus: "BOTH_SIGNED",
        },
      });

      await tx.appointment.update({
        where: { id: form.appointmentId },
        data: { status: "COMPLETADA" },
      });

      await tx.appointmentAuditLog.create({
        data: {
          appointmentId: form.appointmentId,
          fromStatus: form.appointment.status,
          toStatus: "COMPLETADA",
          triggeredByRole: "CLIENT",
          triggeredById: user.id,
          reason: "Cliente aceptó y firmó formulario bipartito",
        },
      });

      const ivaPercentage = Number(
        form.appointment.service.ivaPercentage || 15,
      );
      const subtotal = Number(form.totalServiceValue);
      const ivaAmount = Number(form.ivaApplied);
      const total = Number(form.totalWithIva);

      const commissionRate = 0.1;
      const companyCommission = total * commissionRate;
      const providerNetPayment = total - companyCommission;
      const internalPrice = Number(form.appointment.service.internalPrice);

      // Número de factura: prefijo + timestamp en base36 + contador aleatorio criptográfico
      const ts = Date.now().toString(36).toUpperCase();
      const rand = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
      const invoiceNumber = `INV-${ts}-${rand}`;

      const invoice = await tx.serviceInvoice.create({
        data: {
          appointmentId: form.appointmentId,
          invoiceNumber,
          providerLegalName: form.appointment.provider.user.name || "Proveedor",
          providerRuc: null,
          providerAgreementNumber: "AGR-001",
          clientLegalName: form.appointment.client.name || "Cliente",
          clientIdDocument: form.appointment.client.id,
          clientIdType: "CEDULA",
          subtotal,
          ivaPercentage,
          ivaAmount,
          total,
          companyCommission,
          providerNetPayment,
          agreementInternalPrice: internalPrice,
          invoiceStatus: "ISSUED",
        },
      });

      await tx.serviceAccountingEntry.create({
        data: {
          invoiceId: invoice.id,
          agreementNumber: "AGR-001",
          providerCode: form.appointment.providerId,
          serviceDate: form.appointment.confirmedDate || new Date(),
          clientChargedTotal: total,
          ivaAmount,
          companyCommission,
          providerNetPayment,
        },
      });

      return { form: updatedForm, invoice };
    });

    revalidatePath(`/appointments/${form.appointmentId}`);
    revalidatePath(`/invoices/${result.invoice.id}`);
    return { success: true, form: result.form, invoice: result.invoice };
  } else {
    const updatedForm = await prisma.bipartiteForm.update({
      where: { id: input.formId },
      data: {
        clientRejectedAt: new Date(),
        clientRejectionReason: input.rejectionReason || null,
        clientIpAddress: ipAddress,
        formStatus: "DISPUTED",
      },
    });

    await prisma.appointment.update({
      where: { id: form.appointmentId },
      data: { status: "DISPUTE" },
    });

    await prisma.appointmentAuditLog.create({
      data: {
        appointmentId: form.appointmentId,
        fromStatus: form.appointment.status,
        toStatus: "DISPUTE",
        triggeredByRole: "CLIENT",
        triggeredById: user.id,
        reason: `Cliente rechazó el formulario: ${input.rejectionReason ?? "Sin razón"}`,
      },
    });

    revalidatePath(`/appointments/${form.appointmentId}`);
    return { success: true, form: updatedForm };
  }
}

export async function getBipartiteForm(formId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const form = await prisma.bipartiteForm.findUnique({
    where: { id: formId },
    include: {
      appointment: {
        include: {
          service: true,
          provider: {
            include: { user: true },
          },
          client: true,
        },
      },
    },
  });

  if (!form) {
    return { error: "Formulario no encontrado" };
  }

  if (
    form.appointment.providerId !== user.id &&
    form.appointment.clientId !== user.id
  ) {
    return { error: "No autorizado para ver este formulario" };
  }

  return { form };
}

export async function listBipartiteFormsByUser() {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const [asProvider, asClient] = await Promise.all([
    prisma.bipartiteForm.findMany({
      where: {
        appointment: {
          providerId: user.id,
        },
      },
      include: {
        appointment: {
          include: {
            service: true,
            client: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bipartiteForm.findMany({
      where: {
        appointment: {
          clientId: user.id,
        },
      },
      include: {
        appointment: {
          include: {
            service: true,
            provider: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { asProvider, asClient };
}
