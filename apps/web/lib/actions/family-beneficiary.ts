"use server";

import { prisma } from "@saidonclub/database";
import { getUser } from '@/lib/auth';

export interface AddBeneficiaryInput {
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  idDocumentType: string;
  idDocumentNumber: string;
  idDocumentUrl?: string;
  idDocumentBackUrl?: string;
  photoUrl?: string;
}

export async function addFamilyBeneficiary(data: AddBeneficiaryInput) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const existingBeneficiary = await prisma.familyBeneficiary.findFirst({
    where: {
      memberId: user.id,
      idDocumentNumber: data.idDocumentNumber,
    },
  });

  if (existingBeneficiary) {
    throw new Error("Ya existe un beneficiario con este documento");
  }

  const beneficiary = await prisma.familyBeneficiary.create({
    data: {
      memberId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      relationship: data.relationship as unknown as import("@saidonclub/database").Prisma.FamilyBeneficiaryCreateInput["relationship"],
      dateOfBirth: new Date(data.dateOfBirth),
      idDocumentType: data.idDocumentType as unknown as import("@saidonclub/database").Prisma.FamilyBeneficiaryCreateInput["idDocumentType"],
      idDocumentNumber: data.idDocumentNumber,
      idDocumentUrl: data.idDocumentUrl,
      idDocumentBackUrl: data.idDocumentBackUrl,
      photoUrl: data.photoUrl,
      isActive: true,
    },
  });

  return beneficiary;
}

export async function updateBeneficiary(
  beneficiaryId: string,
  data: Partial<AddBeneficiaryInput>,
) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const beneficiary = await prisma.familyBeneficiary.findUnique({
    where: { id: beneficiaryId },
  });

  if (!beneficiary || beneficiary.memberId !== user.id) {
    throw new Error("Beneficiario no encontrado o no te pertenece");
  }

  const updateData: Record<string, unknown> = { ...data };
  if (data.dateOfBirth) {
    updateData.dateOfBirth = new Date(data.dateOfBirth);
  }
  if (data.relationship) {
    updateData.relationship = data.relationship;
  }
  if (data.idDocumentType) {
    updateData.idDocumentType = data.idDocumentType;
  }

  const updated = await prisma.familyBeneficiary.update({
    where: { id: beneficiaryId },
    data: updateData as import("@saidonclub/database").Prisma.FamilyBeneficiaryUpdateInput,
  });

  return updated;
}

export async function deleteBeneficiary(beneficiaryId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const beneficiary = await prisma.familyBeneficiary.findUnique({
    where: { id: beneficiaryId },
  });

  if (!beneficiary || beneficiary.memberId !== user.id) {
    throw new Error("Beneficiario no encontrado o no te pertenece");
  }

  await prisma.familyBeneficiary.update({
    where: { id: beneficiaryId },
    data: { isActive: false },
  });

  return { success: true };
}

export async function getMyBeneficiaries() {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const beneficiaries = await prisma.familyBeneficiary.findMany({
    where: {
      memberId: user.id,
      isActive: true,
    },
    orderBy: { firstName: "asc" },
  });

  return beneficiaries;
}

export async function getBeneficiary(beneficiaryId: string) {
  const beneficiary = await prisma.familyBeneficiary.findUnique({
    where: { id: beneficiaryId },
  });

  if (!beneficiary || !beneficiary.isActive) {
    throw new Error("Beneficiario no encontrado");
  }

  return beneficiary;
}

export async function getBeneficiaryByDocument(
  idDocumentType: string,
  idDocumentNumber: string,
) {
  const beneficiary = await prisma.familyBeneficiary.findFirst({
    where: {
      idDocumentType: idDocumentType as unknown as import("@saidonclub/database").Prisma.FamilyBeneficiaryWhereInput["idDocumentType"],
      idDocumentNumber: idDocumentNumber,
      isActive: true,
    },
    include: {
      member: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!beneficiary) {
    return { valid: false, error: "Beneficiario no encontrado" };
  }

  return {
    valid: true,
    beneficiary: {
      id: beneficiary.id,
      firstName: beneficiary.firstName,
      lastName: beneficiary.lastName,
      relationship: beneficiary.relationship,
      idDocumentNumber: beneficiary.idDocumentNumber,
      memberName: beneficiary.member?.name,
      memberId: beneficiary.memberId,
      verifiedAt: beneficiary.verifiedAt,
    },
  };
}

export async function verifyBeneficiary(beneficiaryId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const beneficiary = await prisma.familyBeneficiary.findUnique({
    where: { id: beneficiaryId },
  });

  if (!beneficiary) {
    throw new Error("Beneficiario no encontrado");
  }

  const updated = await prisma.familyBeneficiary.update({
    where: { id: beneficiaryId },
    data: {
      verifiedAt: new Date(),
      verifiedByUserId: user.id,
    },
  });

  return updated;
}
