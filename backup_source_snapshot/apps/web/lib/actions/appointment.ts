"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';

export type AppointmentStatus =
  // Valores originales
  | "SOLICITADA"
  | "CONFIRMADA"
  | "PAGADA"
  | "POR_ATENDER"
  | "COMPLETADA"
  | "POR_CALIFICAR"
  | "CALIFICADA"
  | "CANCELADA"
  | "NO_SHOW"
  // Valores Service Marketplace
  | "PENDING_PROVIDER"
  | "PROVIDER_RESPONDED"
  | "PENDING_CLIENT"
  | "PENDING_PAYMENT"
  | "IN_PROGRESS"
  | "CANCELLED_CLIENT"
  | "CANCELLED_PROVIDER"
  | "EMERGENCY"
  | "DISPUTE";

export interface CreateAppointmentInput {
  serviceId: string;
  providerId: string;
  beneficiaryId?: string;
  requestedDate: string;
  requestedTimeSlot: string;
  isEmergency?: boolean;
  emergencyReason?: string;
  clientNotes?: string;
}

function calculatePrices(
  service: Record<string, unknown>,
  isMember: boolean,
  isEmergency?: boolean,
) {
  let publicPrice = Number(service.publicPrice);
  let memberPrice = Number(service.memberPrice);
  let internalPrice = Number(service.internalPrice);

  if (isEmergency && service.emergencySurcharge) {
    const surcharge = Number(service.emergencySurcharge);
    publicPrice += surcharge;
    memberPrice += surcharge;
    internalPrice += surcharge;
  }

  const ivaPercentage = Number(service.ivaPercentage || 15);
  let ivaAmount = 0;
  const totalBeforeIva = isMember ? memberPrice : publicPrice;

  if (service.ivaIncluded) {
    ivaAmount = totalBeforeIva - totalBeforeIva / (1 + ivaPercentage / 100);
  } else {
    ivaAmount = totalBeforeIva * (ivaPercentage / 100);
  }

  const companyCommissionPercentage = Number(
    service.commissionPercentage || 15,
  );
  const companyCommissionAmount =
    (totalBeforeIva * companyCommissionPercentage) / 100;
  const providerNetAmount = totalBeforeIva - companyCommissionAmount;

  return {
    appliedPublicPrice: publicPrice,
    appliedMemberPrice: memberPrice,
    appliedInternalPrice: internalPrice,
    appliedIvaPercentage: ivaPercentage,
    ivaAmount: Math.round(ivaAmount * 100) / 100,
    totalCharged: Math.round((totalBeforeIva + ivaAmount) * 100) / 100,
    companyCommissionAmount: Math.round(companyCommissionAmount * 100) / 100,
    providerNetAmount: Math.round(providerNetAmount * 100) / 100,
  };
}

export async function createAppointment(data: CreateAppointmentInput) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const service = await prisma.serviceListing.findUnique({
    where: { id: data.serviceId },
  });

  if (!service || !service.isActive) {
    throw new Error("Servicio no disponible");
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: { id: data.providerId },
  });

  if (!provider || provider.status !== "ACTIVE") {
    throw new Error("Proveedor no disponible");
  }

  const isMember = Boolean(
    user.membershipType && user.membershipType !== "FREE",
  );
  const isEmergency = Boolean(data.isEmergency);
  const serviceData = service as Record<string, unknown>;
  const prices = calculatePrices(serviceData, isMember, isEmergency);

  const appointment = await prisma.appointment.create({
    data: {
      clientId: user.id,
      beneficiaryId: data.beneficiaryId,
      providerId: data.providerId,
      serviceId: data.serviceId,
      status: "PENDING_PROVIDER" as const,
      isEmergency: isEmergency,
      emergencyReason: data.emergencyReason,
      requestedDate: new Date(data.requestedDate),
      requestedTimeSlot: data.requestedTimeSlot,
      clientNotes: data.clientNotes,
      appliedPublicPrice: prices.appliedPublicPrice,
      appliedMemberPrice: prices.appliedMemberPrice,
      appliedInternalPrice: prices.appliedInternalPrice,
      appliedIvaPercentage: prices.appliedIvaPercentage,
      ivaAmount: prices.ivaAmount,
      totalCharged: prices.totalCharged,
      companyCommissionAmount: prices.companyCommissionAmount,
      providerNetAmount: prices.providerNetAmount,
      paymentStatus: service.requiresPrePayment ? "PENDING" : null,
    },
    include: {
      service: true,
      provider: {
        include: {
          user: {
            select: { name: true, phone: true },
          },
        },
      },
      beneficiary: true,
    },
  });

  await prisma.appointmentAuditLog.create({
    data: {
      appointmentId: appointment.id,
      fromStatus: "",
      toStatus: "PENDING_PROVIDER",
      triggeredByRole: "CLIENT",
      triggeredById: user.id,
      reason: "Cita creada por cliente",
    },
  });

  return appointment;
}

export async function confirmAppointment(appointmentId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Cita no encontrada");
  }

  if (appointment.clientId !== user.id && appointment.providerId !== user.id) {
    throw new Error("No tienes permiso sobre esta cita");
  }

  const newStatus =
    appointment.status === "PENDING_PROVIDER"
      ? "CONFIRMADA"
      : appointment.status;

  // Generate QR Code if it doesn't exist
  const qrCode = appointment.qrCode || Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: newStatus,
      confirmedDate: new Date(),
      qrCode: qrCode,
    },
  });

  await prisma.appointmentAuditLog.create({
    data: {
      appointmentId: appointment.id,
      fromStatus: appointment.status,
      toStatus: newStatus,
      triggeredByRole: appointment.clientId === user.id ? "CLIENT" : "PROVIDER",
      triggeredById: user.id,
      reason: "Cita confirmada",
    },
  });

  return updated;
}

export async function cancelAppointment(appointmentId: string, reason: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true },
  });

  if (!appointment) {
    throw new Error("Cita no encontrada");
  }

  if (appointment.clientId !== user.id && appointment.providerId !== user.id) {
    throw new Error("No tienes permiso sobre esta cita");
  }

  if (
    appointment.service.requiresPrePayment &&
    appointment.paymentStatus === "COMPLETED"
  ) {
    throw new Error("No se puede cancelar una cita prepagada");
  }

  // Determina qué status usar en función del rol que cancela
  const cancelStatus =
    appointment.clientId === user.id ? "CANCELLED_CLIENT" : "CANCELLED_PROVIDER";

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: cancelStatus,
      providerNotes: reason,
    },
  });

  await prisma.appointmentAuditLog.create({
    data: {
      appointmentId: appointment.id,
      fromStatus: appointment.status,
      toStatus: cancelStatus,
      triggeredByRole: appointment.clientId === user.id ? "CLIENT" : "PROVIDER",
      triggeredById: user.id,
      reason: reason,
    },
  });

  return updated;
}

export async function startAppointment(appointmentId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment || appointment.providerId !== user.id) {
    throw new Error("Cita no encontrada o no eres el proveedor");
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: "IN_PROGRESS",
      actualStartTime: new Date(),
    },
  });

  await prisma.appointmentAuditLog.create({
    data: {
      appointmentId: appointment.id,
      fromStatus: appointment.status,
      toStatus: "IN_PROGRESS",
      triggeredByRole: "PROVIDER",
      triggeredById: user.id,
      reason: "Proveedor inició el servicio",
    },
  });

  return updated;
}

export async function completeAppointment(
  appointmentId: string,
  providerNotes?: string,
) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment || appointment.providerId !== user.id) {
    throw new Error("Cita no encontrada o no eres el proveedor");
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: "COMPLETADA" as const,
      actualEndTime: new Date(),
      providerNotes: providerNotes,
    },
  });

  await prisma.appointmentAuditLog.create({
    data: {
      appointmentId: appointment.id,
      fromStatus: appointment.status,
      toStatus: "COMPLETADA",
      triggeredByRole: "PROVIDER",
      triggeredById: user.id,
      reason: "Servicio completado",
    },
  });

  return updated;
}

export async function getMyAppointments(filters?: {
  status?: AppointmentStatus;
  role?: "client" | "provider";
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const where: import("@saidonclub/database").Prisma.AppointmentWhereInput = {};

  if (filters?.role === "provider") {
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
    });
    if (provider) {
      where.providerId = provider.id;
    }
  } else {
    where.clientId = user.id;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      service: true,
      provider: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      beneficiary: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return appointments;
}

export async function getAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      service: true,
      provider: {
        include: {
          user: {
            select: { name: true, phone: true, email: true },
          },
        },
      },
      client: {
        select: { name: true, email: true, phone: true },
      },
      beneficiary: true,
      auditLog: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!appointment) {
    throw new Error("Cita no encontrada");
  }

  return appointment;
}

export async function getAvailableSlots(providerId: string, date: string) {
  const provider = await prisma.serviceProvider.findUnique({
    where: { id: providerId },
    include: {
      schedules: {
        where: { isActive: true },
      },
      blockedDates: {
        where: {
          OR: [{ date: new Date(date) }],
        },
      },
    },
  });

  if (!provider) {
    throw new Error("Proveedor no encontrado");
  }

  const dayOfWeek = new Date(date).getDay();
  const schedule = provider.schedules.find((s) => s.dayOfWeek === dayOfWeek);

  if (!schedule) {
    return { slots: [], reason: "Proveedor no trabaja este día" };
  }

  const isBlocked = provider.blockedDates.some(
    (b) => b.date.toDateString() === new Date(date).toDateString(),
  );

  if (isBlocked) {
    return { slots: [], reason: "Proveedor bloqueado este día" };
  }

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      providerId,
      confirmedDate: {
        equals: new Date(date),
      },
      status: {
        in: ["PENDING_PROVIDER", "PENDING_CLIENT", "CONFIRMADA", "IN_PROGRESS"],
      },
    },
  });

  const bookedSlots = existingAppointments.map((a) => a.requestedTimeSlot);

  const slots: string[] = [];
  const [startHour, startMin] = schedule.startTime.split(":").map(Number);
  const [endHour, endMin] = schedule.endTime.split(":").map(Number);
  const duration = schedule.slotDurationMinutes || 60;

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeSlot = `${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`;

    if (!bookedSlots.includes(timeSlot)) {
      slots.push(timeSlot);
    }

    currentMin += duration;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return { slots };
}

export async function verifyAppointmentByQR(qrCode: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { qrCode },
    include: {
      service: { select: { name: true, category: true } },
      client: { select: { name: true, email: true, phone: true } },
      beneficiary: { select: { firstName: true, lastName: true } },
      provider: {
        include: {
          user: { select: { name: true } }
        }
      }
    },
  });

  if (!appointment) {
    return { success: false, error: "Código QR no válido o cita no encontrada" };
  }

  // Ensure the user is the provider for this appointment or an admin
  if (appointment.provider.userId !== user.id && user.role !== "SUPER_ADMIN") {
    return { success: false, error: "No tienes permiso para verificar esta cita" };
  }

  return {
    success: true,
    appointment: {
      id: appointment.id,
      status: appointment.status,
      serviceName: appointment.service.name,
      clientName: appointment.client.name || appointment.client.email,
      beneficiaryName: appointment.beneficiary ? `${appointment.beneficiary.firstName} ${appointment.beneficiary.lastName}` : null,
      scheduledAt: appointment.confirmedDate?.toISOString() || null,
    }
  };
}
