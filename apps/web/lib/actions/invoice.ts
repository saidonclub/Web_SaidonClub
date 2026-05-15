"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export type InvoiceStatus =
  | "ISSUED"
  | "SENT"
  | "PAID"
  | "DISPUTED"
  | "CANCELLED";

export async function getInvoiceById(invoiceId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const invoice = await prisma.serviceInvoice.findUnique({
    where: { id: invoiceId },
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
      accountingEntry: true,
    },
  });

  if (!invoice) {
    return { error: "Factura no encontrada" };
  }

  if (
    invoice.appointment.providerId !== user.id &&
    invoice.appointment.clientId !== user.id
  ) {
    return { error: "No autorizado para ver esta factura" };
  }

  return { invoice };
}

export async function getInvoiceByAppointment(appointmentId: string) {
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
    return { error: "No autorizado para ver esta factura" };
  }

  const invoice = await prisma.serviceInvoice.findUnique({
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
      accountingEntry: true,
    },
  });

  if (!invoice) {
    return { error: "Factura no encontrada para esta cita" };
  }

  return { invoice };
}

export async function listInvoicesByUser() {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const [asProvider, asClient] = await Promise.all([
    prisma.serviceInvoice.findMany({
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
      orderBy: { issuedAt: "desc" },
    }),
    prisma.serviceInvoice.findMany({
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
      orderBy: { issuedAt: "desc" },
    }),
  ]);

  return { asProvider, asClient };
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus,
) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const invoice = await prisma.serviceInvoice.findUnique({
    where: { id: invoiceId },
    include: { appointment: true },
  });

  if (!invoice) {
    return { error: "Factura no encontrada" };
  }

  if (invoice.appointment.providerId !== user.id) {
    return { error: "No autorizado para actualizar esta factura" };
  }

  const validTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
    ISSUED: ["SENT", "CANCELLED"],
    SENT: ["PAID", "DISPUTED", "CANCELLED"],
    PAID: ["DISPUTED"],
    DISPUTED: ["CANCELLED", "ISSUED"],
    CANCELLED: [],
  };

  const currentStatus = invoice.invoiceStatus as InvoiceStatus;
  if (!validTransitions[currentStatus].includes(status)) {
    return { error: `No se puede cambiar de ${currentStatus} a ${status}` };
  }

  const updatedInvoice = await prisma.serviceInvoice.update({
    where: { id: invoiceId },
    data: { invoiceStatus: status },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true, invoice: updatedInvoice };
}

export async function markInvoiceAsSent(invoiceId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const invoice = await prisma.serviceInvoice.findUnique({
    where: { id: invoiceId },
    include: { appointment: true },
  });

  if (!invoice) {
    return { error: "Factura no encontrada" };
  }

  if (invoice.appointment.providerId !== user.id) {
    return { error: "No autorizado" };
  }

  const updatedInvoice = await prisma.serviceInvoice.update({
    where: { id: invoiceId },
    data: {
      invoiceStatus: "SENT",
      sentToClientAt: new Date(),
    },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true, invoice: updatedInvoice };
}

export async function markInvoiceAsPaid(invoiceId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const invoice = await prisma.serviceInvoice.findUnique({
    where: { id: invoiceId },
    include: { appointment: true },
  });

  if (!invoice) {
    return { error: "Factura no encontrada" };
  }

  if (
    invoice.appointment.clientId !== user.id &&
    invoice.appointment.providerId !== user.id
  ) {
    return { error: "No autorizado" };
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedInvoice = await tx.serviceInvoice.update({
      where: { id: invoiceId },
      data: { invoiceStatus: "PAID" },
    });

    await tx.appointment.update({
      where: { id: invoice.appointmentId },
      data: {
        paymentStatus: "COMPLETED",
        paidAt: new Date(),
      },
    });

    return { invoice: updatedInvoice };
  });

  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true, invoice: result.invoice };
}

export async function generateInvoicePdf(invoiceId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const invoice = await prisma.serviceInvoice.findUnique({
    where: { id: invoiceId },
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

  if (!invoice) {
    return { error: "Factura no encontrada" };
  }

  if (invoice.appointment.providerId !== user.id) {
    return { error: "No autorizado para generar PDF de esta factura" };
  }

  const pdfUrl = `/api/invoices/${invoiceId}/pdf`;

  const updatedInvoice = await prisma.serviceInvoice.update({
    where: { id: invoiceId },
    data: { pdfUrl },
  });

  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true, pdfUrl, invoice: updatedInvoice };
}

export async function getInvoiceStats(providerId?: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const targetProviderId = providerId || user.id;

  const [totalInvoices, issuedInvoices, paidInvoices, totalRevenue] =
    await Promise.all([
      prisma.serviceInvoice.count({
        where: {
          appointment: {
            providerId: targetProviderId,
          },
        },
      }),
      prisma.serviceInvoice.count({
        where: {
          appointment: {
            providerId: targetProviderId,
          },
          invoiceStatus: "ISSUED",
        },
      }),
      prisma.serviceInvoice.count({
        where: {
          appointment: {
            providerId: targetProviderId,
          },
          invoiceStatus: "PAID",
        },
      }),
      prisma.serviceInvoice.aggregate({
        where: {
          appointment: {
            providerId: targetProviderId,
          },
          invoiceStatus: "PAID",
        },
        _sum: {
          providerNetPayment: true,
        },
      }),
    ]);

  return {
    totalInvoices,
    issuedInvoices,
    paidInvoices,
    totalRevenue: totalRevenue._sum.providerNetPayment || 0,
  };
}
