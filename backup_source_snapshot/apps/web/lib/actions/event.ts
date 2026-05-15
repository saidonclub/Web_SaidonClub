"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';

export interface CreateEventInput {
  eventType: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, unknown>;
}

export async function createSystemEvent(input: CreateEventInput) {
  await getUser();

  const event = await prisma.systemEvent.create({
    data: {
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      payload: input.payload as import("@saidonclub/database").Prisma.InputJsonValue,
    },
  });

  return { success: true, event };
}

export async function processEvent(eventId: string) {
  const event = await prisma.systemEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return { error: "Evento no encontrado" };
  }

  if (event.processedAt) {
    return { error: "Evento ya procesado" };
  }

  try {
    const payload = event.payload as Record<string, unknown>;

    switch (event.eventType) {
      case "APPOINTMENT_CREATED":
        await handleAppointmentCreated(event.entityId, payload);
        break;
      case "APPOINTMENT_COMPLETED":
        await handleAppointmentCompleted(event.entityId, payload);
        break;
      case "PAYMENT_RECEIVED":
        await handlePaymentReceived(event.entityId, payload);
        break;
      case "REVIEW_SUBMITTED":
        await handleReviewSubmitted(event.entityId, payload);
        break;
      default:
        console.log(`Unhandled event type: ${event.eventType}`);
    }

    await prisma.systemEvent.update({
      where: { id: eventId },
      data: { processedAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    await prisma.systemEvent.update({
      where: { id: eventId },
      data: {
        processingError:
          error instanceof Error ? error.message : "Unknown error",
        retryCount: { increment: 1 },
      },
    });

    return { error: "Error al procesar evento" };
  }
}

async function handleAppointmentCreated(appointmentId: string, payload: Record<string, unknown>) {
  console.log(`Appointment created: ${appointmentId}`, payload);
}

async function handleAppointmentCompleted(appointmentId: string, payload: Record<string, unknown>) {
  console.log(`Appointment completed: ${appointmentId}`, payload);

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETADA" },
  });
}

async function handlePaymentReceived(paymentId: string, payload: Record<string, unknown>) {
  console.log(`Payment received: ${paymentId}`, payload);

  if (payload.appointmentId && typeof payload.appointmentId === "string") {
    await prisma.appointment.update({
      where: { id: payload.appointmentId },
      data: {
        paymentStatus: "COMPLETED",
        paidAt: new Date(),
      },
    });
  }
}

async function handleReviewSubmitted(reviewId: string, payload: Record<string, unknown>) {
  console.log(`Review submitted: ${reviewId}`, payload);

  if (payload.providerId && typeof payload.providerId === "string") {
    await updateProviderRating(payload.providerId);
  }
}

async function updateProviderRating(providerId: string) {
  const [agg, totalReviews] = await Promise.all([
    prisma.providerReview.aggregate({
      where: { providerId, isVisible: true },
      _avg: { rating: true },
    }),
    prisma.providerReview.count({
      where: { providerId, isVisible: true },
    }),
  ]);

  if (totalReviews === 0) return;

  const avgRating = Math.round((agg._avg.rating ?? 0) * 100) / 100;

  // Persist computed aggregate to the provider profile for O(1) reads.
  await prisma.serviceProvider.update({
    where: { id: providerId },
    data: {
      averageRating: avgRating,
      totalReviews,
    },
  });

  console.log(
    `[rating] Provider ${providerId} → ${avgRating}⭐ (${totalReviews} reseñas)`,
  );
}

export async function getPendingEvents(limit: number = 50) {
  const events = await prisma.systemEvent.findMany({
    where: { processedAt: null },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return { events };
}

export async function retryFailedEvent(eventId: string) {
  const event = await prisma.systemEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return { error: "Evento no encontrado" };
  }

  if (!event.processingError) {
    return { error: "El evento no tiene errores" };
  }

  const result = await processEvent(eventId);
  return result;
}

export async function getEventStats() {
  const [total, pending, processed, failed] = await Promise.all([
    prisma.systemEvent.count(),
    prisma.systemEvent.count({ where: { processedAt: null } }),
    prisma.systemEvent.count({ where: { NOT: { processedAt: null } } }),
    prisma.systemEvent.count({
      where: {
        processedAt: null,
        retryCount: { gte: 3 },
      },
    }),
  ]);

  return { total, pending, processed, failed };
}

export async function listEventsByEntity(entityType: string, entityId: string) {
  const events = await prisma.systemEvent.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: { createdAt: "desc" },
  });

  return { events };
}

export async function cleanupOldEvents(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.systemEvent.deleteMany({
    where: {
      processedAt: { lt: cutoffDate },
      retryCount: { gte: 5 },
    },
  });

  return { deleted: result.count };
}
