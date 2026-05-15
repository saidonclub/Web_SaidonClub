"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export interface CreateProviderReviewInput {
  appointmentId: string;
  rating: number;
  title?: string;
  comment: string;
  isAnonymous?: boolean;
}

export interface CreateClientReviewInput {
  appointmentId: string;
  rating: number;
  behaviorRating: number;
  punctualityRating: number;
  comment: string;
  isRecommended: boolean;
}

export async function createProviderReview(input: CreateProviderReviewInput) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: input.appointmentId },
    include: { provider: true, service: true },
  });

  if (!appointment) {
    return { error: "Cita no encontrada" };
  }

  if (appointment.clientId !== user.id) {
    return { error: "Solo el cliente de la cita puede dejar una reseña" };
  }

  if (appointment.status !== "COMPLETADA") {
    return { error: "Solo puedes reseñar citas completadas" };
  }

  const existingReview = await prisma.providerReview.findUnique({
    where: { appointmentId: input.appointmentId },
  });

  if (existingReview) {
    return { error: "Ya existe una reseña para esta cita" };
  }

  if (input.rating < 1 || input.rating > 5) {
    return { error: "La calificación debe estar entre 1 y 5" };
  }

  const review = await prisma.providerReview.create({
    data: {
      appointmentId: input.appointmentId,
      clientId: user.id,
      providerId: appointment.providerId,
      serviceId: appointment.serviceId,
      rating: input.rating,
      title: input.title || null,
      comment: input.comment,
      isAnonymous: input.isAnonymous || false,
    },
  });

  await createSystemEvent("REVIEW_SUBMITTED", "ProviderReview", review.id, {
    providerId: appointment.providerId,
    appointmentId: input.appointmentId,
  });

  revalidatePath(`/providers/${appointment.providerId}`);
  return { success: true, review };
}

export async function createClientReview(input: CreateClientReviewInput) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: input.appointmentId },
    include: { provider: true },
  });

  if (!appointment) {
    return { error: "Cita no encontrada" };
  }

  if (appointment.providerId !== user.id) {
    return { error: "Solo el proveedor de la cita puede dejar una reseña" };
  }

  if (appointment.status !== "COMPLETADA") {
    return { error: "Solo puedes reseñar citas completadas" };
  }

  const existingReview = await prisma.clientReview.findUnique({
    where: { appointmentId: input.appointmentId },
  });

  if (existingReview) {
    return { error: "Ya existe una reseña para esta cita" };
  }

  const ratings = [input.rating, input.behaviorRating, input.punctualityRating];
  if (ratings.some((r) => r < 1 || r > 5)) {
    return { error: "Las calificaciones deben estar entre 1 y 5" };
  }

  const review = await prisma.clientReview.create({
    data: {
      appointmentId: input.appointmentId,
      providerId: appointment.providerId,
      clientId: appointment.clientId,
      rating: input.rating,
      behaviorRating: input.behaviorRating,
      punctualityRating: input.punctualityRating,
      comment: input.comment,
      isRecommended: input.isRecommended,
      isVisible: true,
    },
  });

  return { success: true, review };
}

export async function getProviderReviews(
  providerId: string,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.providerReview.findMany({
      where: {
        providerId,
        isVisible: true,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.providerReview.count({
      where: {
        providerId,
        isVisible: true,
      },
    }),
  ]);

  const avgRating = await prisma.providerReview.aggregate({
    where: {
      providerId,
      isVisible: true,
    },
    _avg: { rating: true },
  });

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    averageRating: avgRating._avg.rating || 0,
  };
}

export async function getClientReviews(
  clientId: string,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.clientReview.findMany({
      where: {
        clientId,
        isVisible: true,
      },
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.clientReview.count({
      where: {
        clientId,
        isVisible: true,
      },
    }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getReviewByAppointment(appointmentId: string) {
  const [providerReview, clientReview] = await Promise.all([
    prisma.providerReview.findUnique({
      where: { appointmentId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        service: true,
      },
    }),
    prisma.clientReview.findUnique({
      where: { appointmentId },
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return { providerReview, clientReview };
}

export async function moderateProviderReview(
  reviewId: string,
  action: "hide" | "show",
) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return { error: "Solo administradores pueden moderar reseñas" };
  }

  const review = await prisma.providerReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return { error: "Reseña no encontrada" };
  }

  const updatedReview = await prisma.providerReview.update({
    where: { id: reviewId },
    data: {
      isVisible: action === "show",
      moderatedByUserId: user.id,
      moderatedAt: new Date(),
    },
  });

  revalidatePath(`/providers/${review.providerId}`);
  return { success: true, review: updatedReview };
}

export async function hideClientReview(reviewId: string) {
  const user = await getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const review = await prisma.clientReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return { error: "Reseña no encontrada" };
  }

  if (
    review.providerId !== user.id &&
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN"
  ) {
    return { error: "No autorizado para ocultar esta reseña" };
  }

  const updatedReview = await prisma.clientReview.update({
    where: { id: reviewId },
    data: { isVisible: false },
  });

  return { success: true, review: updatedReview };
}

async function createSystemEvent(
  eventType: string,
  entityType: string,
  entityId: string,
  payload: Record<string, unknown>,
) {
  await prisma.systemEvent.create({
    data: {
      eventType,
      entityType,
      entityId,
      payload: payload as import("@saidonclub/database").Prisma.InputJsonValue,
    },
  });
}

export async function getProviderRatingSummary(providerId: string) {
  const [totalReviews, avgRating, ratingDistribution] = await Promise.all([
    prisma.providerReview.count({
      where: { providerId, isVisible: true },
    }),
    prisma.providerReview.aggregate({
      where: { providerId, isVisible: true },
      _avg: { rating: true },
    }),
    prisma.providerReview.groupBy({
      by: ["rating"],
      where: { providerId, isVisible: true },
      _count: true,
    }),
  ]);

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingDistribution.forEach((d) => {
    distribution[d.rating as keyof typeof distribution] = d._count;
  });

  return {
    totalReviews,
    averageRating: avgRating._avg.rating || 0,
    distribution,
  };
}
