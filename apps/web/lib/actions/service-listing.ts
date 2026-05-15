"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';

export interface CreateServiceListingInput {
  name: string;
  description: string;
  category: string;
  publicPrice: number;
  memberPrice: number;
  internalPrice: number;
  companyCommission?: number;
  commissionPercentage?: number;
  ivaPercentage?: number;
  ivaIncluded?: boolean;
  modality: string;
  duration: number;
  allowEmergency?: boolean;
  emergencySurcharge?: number;
  requiresPrePayment?: boolean;
}

export async function createServiceListing(data: CreateServiceListingInput) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
  });

  if (!provider) {
    throw new Error("No eres un proveedor de servicios");
  }

  if (provider.status !== "ACTIVE") {
    throw new Error("Tu cuenta de proveedor no está activa");
  }

  const service = await prisma.serviceListing.create({
    data: {
      providerId: provider.id,
      name: data.name,
      description: data.description,
      category: data.category as unknown as import("@saidonclub/database").Prisma.ServiceListingCreateInput["category"],
      publicPrice: data.publicPrice,
      memberPrice: data.memberPrice,
      internalPrice: data.internalPrice,
      companyCommission: data.companyCommission || 0,
      commissionPercentage: data.commissionPercentage || 15,
      ivaPercentage: data.ivaPercentage || 15,
      ivaIncluded: data.ivaIncluded || false,
      modality: data.modality as unknown as import("@saidonclub/database").Prisma.ServiceListingCreateInput["modality"],
      duration: data.duration,
      allowEmergency: data.allowEmergency || false,
      emergencySurcharge: data.emergencySurcharge,
      requiresPrePayment: data.requiresPrePayment || false,
    },
  });

  return service;
}

export async function updateServiceListing(
  serviceId: string,
  data: Partial<CreateServiceListingInput>,
) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
  });

  if (!provider) {
    throw new Error("No eres un proveedor de servicios");
  }

  const service = await prisma.serviceListing.findUnique({
    where: { id: serviceId },
  });

  if (!service || service.providerId !== provider.id) {
    throw new Error("Servicio no encontrado o no te pertenece");
  }

  // Build a strongly-typed update payload — avoid spreading raw input directly
  // because enum fields (category, modality) require the Prisma enum type.
  const updateData: import("@saidonclub/database").Prisma.ServiceListingUpdateInput =
    {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category !== undefined && {
        category:
          data.category as unknown as import("@saidonclub/database").Prisma.ServiceListingUpdateInput["category"],
      }),
      ...(data.publicPrice !== undefined && { publicPrice: data.publicPrice }),
      ...(data.memberPrice !== undefined && { memberPrice: data.memberPrice }),
      ...(data.internalPrice !== undefined && {
        internalPrice: data.internalPrice,
      }),
      ...(data.companyCommission !== undefined && {
        companyCommission: data.companyCommission,
      }),
      ...(data.commissionPercentage !== undefined && {
        commissionPercentage: data.commissionPercentage,
      }),
      ...(data.ivaPercentage !== undefined && {
        ivaPercentage: data.ivaPercentage,
      }),
      ...(data.ivaIncluded !== undefined && { ivaIncluded: data.ivaIncluded }),
      ...(data.modality !== undefined && {
        modality:
          data.modality as unknown as import("@saidonclub/database").Prisma.ServiceListingUpdateInput["modality"],
      }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.allowEmergency !== undefined && {
        allowEmergency: data.allowEmergency,
      }),
      ...(data.emergencySurcharge !== undefined && {
        emergencySurcharge: data.emergencySurcharge,
      }),
      ...(data.requiresPrePayment !== undefined && {
        requiresPrePayment: data.requiresPrePayment,
      }),
    };

  const updated = await prisma.serviceListing.update({
    where: { id: serviceId },
    data: updateData,
  });

  return updated;
}

export async function deleteServiceListing(serviceId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
  });

  if (!provider) {
    throw new Error("No eres un proveedor de servicios");
  }

  const service = await prisma.serviceListing.findUnique({
    where: { id: serviceId },
  });

  if (!service || service.providerId !== provider.id) {
    throw new Error("Servicio no encontrado o no te pertenece");
  }

  await prisma.serviceListing.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  return { success: true };
}

export async function getMyServices() {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
  });

  if (!provider) {
    throw new Error("No eres un proveedor de servicios");
  }

  const services = await prisma.serviceListing.findMany({
    where: { providerId: provider.id },
    include: {
      _count: {
        select: {
          appointments: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return services;
}

export async function getServiceListing(serviceId: string) {
  const service = await prisma.serviceListing.findUnique({
    where: { id: serviceId },
    include: {
      provider: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  if (!service || !service.isActive) {
    throw new Error("Servicio no encontrado o inactivo");
  }

  return service;
}

export async function listServices(filters?: {
  category?: string;
  modality?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  search?: string;
}) {
  const where: import("@saidonclub/database").Prisma.ServiceListingWhereInput = {};

  if (filters?.category) {
    where.category = filters.category as unknown as import("@saidonclub/database").Prisma.ServiceListingWhereInput["category"];
  }

  if (filters?.modality) {
    where.modality = filters.modality as unknown as import("@saidonclub/database").Prisma.ServiceListingWhereInput["modality"];
  }

  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.publicPrice = {};
    if (filters?.minPrice !== undefined) {
      where.publicPrice.gte = filters.minPrice;
    }
    if (filters?.maxPrice !== undefined) {
      where.publicPrice.lte = filters.maxPrice;
    }
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters?.city) {
    where.provider = { city: filters.city };
  }

  const services = await prisma.serviceListing.findMany({
    where,
    include: {
      provider: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });

  return services;
}

export async function getServicesByProvider(providerId: string) {
  const services = await prisma.serviceListing.findMany({
    where: {
      providerId,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });

  return services;
}

export async function toggleServiceActive(serviceId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
  });

  if (!provider) {
    throw new Error("No eres un proveedor de servicios");
  }

  const service = await prisma.serviceListing.findUnique({
    where: { id: serviceId },
  });

  if (!service || service.providerId !== provider.id) {
    throw new Error("Servicio no encontrado o no te pertenece");
  }

  const updated = await prisma.serviceListing.update({
    where: { id: serviceId },
    data: { isActive: !service.isActive },
  });

  return updated;
}
