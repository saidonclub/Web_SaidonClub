"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';

export type ProviderStatus =
  | "PENDING_KYC"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "SUSPENDED_TEMP"
  | "SUSPENDED_PERM"
  | "REJECTED"
  | "REQUIRES_UPDATE";

export type KycStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "REQUIRES_UPDATE";

export interface RegisterServiceProviderInput {
  businessName: string;
  profession: string;
  professionCategory: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  bio?: string;
}

export async function registerAsServiceProvider(
  data: RegisterServiceProviderInput,
) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const existingProvider = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
  });

  if (existingProvider) {
    throw new Error("Ya eres un proveedor de servicios");
  }

  const provider = await prisma.serviceProvider.create({
    data: {
      userId: user.id,
      businessName: data.businessName,
      profession: data.profession,
      professionCategory: data.professionCategory as unknown as import("@saidonclub/database").Prisma.ServiceProviderCreateInput["professionCategory"],
      phone: data.phone,
      email: data.email || user.email || "",
      whatsapp: data.whatsapp,
      address: data.address,
      city: data.city,
      bio: data.bio,
      status: "PENDING_KYC",
      kycStatus: "NOT_STARTED",
    },
  });

  return provider;
}

export async function submitProviderKYC(
  idDocumentUrl: string,
  idDocumentBackUrl?: string,
  selfieWithIdUrl?: string,
  professionalTitleUrl?: string,
  certificationUrls?: string[],
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

  const updated = await prisma.serviceProvider.update({
    where: { id: provider.id },
    data: {
      idDocumentUrl: idDocumentUrl,
      idDocumentBackUrl: idDocumentBackUrl,
      selfieWithIdUrl: selfieWithIdUrl,
      professionalTitleUrl: professionalTitleUrl ? [professionalTitleUrl] : [],
      certificationUrls: certificationUrls || [],
      kycStatus: "SUBMITTED",
      kycSubmittedAt: new Date(),
    },
  });

  return updated;
}

export async function getServiceProviderProfile(providerId: string) {
  const provider = await prisma.serviceProvider.findUnique({
    where: { id: providerId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      services: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          category: true,
          publicPrice: true,
          memberPrice: true,
          modality: true,
          duration: true,
        },
      },
      schedules: {
        where: { isActive: true },
      },
    },
  });

  if (!provider || provider.status !== "ACTIVE") {
    throw new Error("Proveedor no encontrado o inactivo");
  }

  return provider;
}

export async function getMyServiceProviderProfile() {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
    include: {
      services: true,
      schedules: true,
      blockedDates: true,
    },
  });

  return provider;
}

export async function updateServiceProviderProfile(data: {
  businessName?: string;
  profession?: string;
  professionCategory?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  bio?: string;
  profilePhotoUrl?: string;
  personalPhotos?: string[];
  workPhotos?: string[];
  businessPhotos?: string[];
  adPhotos?: string[];
  instagram?: string;
  facebook?: string;
  telegram?: string;
  website?: string;
}) {
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

  // Build a strongly-typed Prisma update payload — enum fields cast inline.
  const updateData: import("@saidonclub/database").Prisma.ServiceProviderUpdateInput = {
    ...(data.businessName !== undefined && { businessName: data.businessName }),
    ...(data.profession !== undefined && { profession: data.profession }),
    ...(data.professionCategory !== undefined && {
      professionCategory:
        data.professionCategory as unknown as import("@saidonclub/database").Prisma.ServiceProviderUpdateInput["professionCategory"],
    }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
    ...(data.address !== undefined && { address: data.address }),
    ...(data.city !== undefined && { city: data.city }),
    ...(data.bio !== undefined && { bio: data.bio }),
    ...(data.profilePhotoUrl !== undefined && {
      profilePhotoUrl: data.profilePhotoUrl,
    }),
    ...(data.personalPhotos !== undefined && {
      personalPhotos: data.personalPhotos,
    }),
    ...(data.workPhotos !== undefined && { workPhotos: data.workPhotos }),
    ...(data.businessPhotos !== undefined && {
      businessPhotos: data.businessPhotos,
    }),
    ...(data.adPhotos !== undefined && { adPhotos: data.adPhotos }),
    ...(data.instagram !== undefined && { instagram: data.instagram }),
    ...(data.facebook !== undefined && { facebook: data.facebook }),
    ...(data.telegram !== undefined && { telegram: data.telegram }),
    ...(data.website !== undefined && { website: data.website }),
  };

  const updated = await prisma.serviceProvider.update({
    where: { id: provider.id },
    data: updateData,
  });

  return updated;
}

export async function approveServiceProvider(providerId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.update({
    where: { id: providerId },
    data: {
      status: "ACTIVE",
      kycStatus: "APPROVED",
      kycApprovedAt: new Date(),
      kycApprovedByUserId: user.id,
    },
  });

  return provider;
}

export async function rejectServiceProvider(
  providerId: string,
  reason: string,
) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.update({
    where: { id: providerId },
    data: {
      status: "REJECTED",
      kycStatus: "REJECTED",
      kycRejectionReason: reason,
    },
  });

  return provider;
}

export async function requestProviderUpdate(
  providerId: string,
  reason: string,
) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.update({
    where: { id: providerId },
    data: {
      status: "REQUIRES_UPDATE",
      kycStatus: "REQUIRES_UPDATE",
      kycRejectionReason: reason,
    },
  });

  return provider;
}

export async function suspendServiceProvider(
  providerId: string,
  permanent: boolean = false,
) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const provider = await prisma.serviceProvider.update({
    where: { id: providerId },
    data: {
      status: permanent ? "SUSPENDED_PERM" : "SUSPENDED_TEMP",
    },
  });

  return provider;
}

export async function listServiceProviders(filters?: {
  status?: ProviderStatus;
  professionCategory?: string;
  city?: string;
  search?: string;
}) {
  const where: import("@saidonclub/database").Prisma.ServiceProviderWhereInput = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.professionCategory) {
    where.professionCategory =
      filters.professionCategory as unknown as import("@saidonclub/database").Prisma.ServiceProviderWhereInput["professionCategory"];
  }

  if (filters?.city) {
    where.city = filters.city;
  }

  if (filters?.search) {
    where.OR = [
      { businessName: { contains: filters.search, mode: "insensitive" } },
      { profession: { contains: filters.search, mode: "insensitive" } },
      { bio: { contains: filters.search, mode: "insensitive" } },
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  const providers = await prisma.serviceProvider.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          services: true,
          appointments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return providers;
}
