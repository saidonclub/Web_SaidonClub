// ============================================================
// MODULE:     lib/kyc-actions
// PURPOSE:    Server actions para el flujo KYC (Know Your Customer)
// ============================================================

'use server';

import { prisma } from '@saidonclub/database';
import { getUser } from '@/lib/auth';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';

/**
 * Envía una solicitud KYC nivel 2 (verificación de identidad)
 */
export async function submitKYCLevel2Action(formData: FormData) {
  const user = await getUser();
  if (!user) {
    throw new Error('No autenticado');
  }

  const documentType = formData.get('documentType') as string;
  const documentNumber = formData.get('documentNumber') as string;
  const documentUrl = formData.get('documentUrl') as string;
  const selfieUrl = formData.get('selfieUrl') as string;

  if (!documentType || !documentNumber) {
    throw new Error('Faltan campos requeridos');
  }

  // Verificar que no exista ya un KYC pendiente
  const existingKYC = await prisma.kYC.findUnique({
    where: { userId: user.id },
  });

  if (existingKYC && existingKYC.status === 'EN_REVISION') {
    throw new Error('Ya existe una solicitud KYC en revisión');
  }

  const kyc = await prisma.kYC.upsert({
    where: { userId: user.id },
    update: {
      level: 2,
      documentType,
      documentNumber,
      documentUrl,
      selfieUrl,
      status: 'EN_REVISION',
    },
    create: {
      userId: user.id,
      level: 2,
      documentType,
      documentNumber,
      documentUrl,
      selfieUrl,
      status: 'EN_REVISION',
    },
  });

  // Crear audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      targetUserId: user.id,
      action: 'CREATE',
      entityType: 'KYC',
      entityId: kyc.id,
      newValue: { documentType, documentNumber },
    },
  });

  return kyc;
}

/**
 * Aprueba una solicitud KYC (solo ADMIN o SUPER_ADMIN)
 */
export async function approveKYCAction(kycId: string) {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_KYC)) {
    throw new Error('No tiene permisos para aprobar KYC');
  }

  const kyc = await prisma.kYC.findUnique({
    where: { id: kycId },
  });

  if (!kyc) {
    throw new Error('Solicitud KYC no encontrada');
  }

  if (kyc.status !== 'EN_REVISION') {
    throw new Error('La solicitud no está en revisión');
  }

  const [updatedKYC] = await prisma.$transaction([
    prisma.kYC.update({
      where: { id: kycId },
      data: {
        status: 'APROBADO',
        verifiedAt: new Date(),
        verifiedBy: user.id,
      },
    }),
    prisma.user.update({
      where: { id: kyc.userId },
      data: { kycLevel: kyc.level },
    }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        targetUserId: kyc.userId,
        action: 'APPROVE',
        entityType: 'KYC',
        entityId: kycId,
        newValue: { status: 'APROBADO' },
      },
    }),
  ]);

  return updatedKYC;
}

/**
 * Rechaza una solicitud KYC (solo ADMIN o SUPER_ADMIN)
 */
export async function rejectKYCAction(kycId: string, reason: string) {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_KYC)) {
    throw new Error('No tiene permisos para rechazar KYC');
  }

  const kyc = await prisma.kYC.findUnique({
    where: { id: kycId },
  });

  if (!kyc) {
    throw new Error('Solicitud KYC no encontrada');
  }

  if (kyc.status !== 'EN_REVISION') {
    throw new Error('La solicitud no está en revisión');
  }

  const updated = await prisma.kYC.update({
    where: { id: kycId },
    data: {
      status: 'RECHAZADO',
      verifiedAt: new Date(),
      verifiedBy: user.id,
      rejectionNote: reason,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      targetUserId: kyc.userId,
      action: 'REJECT',
      entityType: 'KYC',
      entityId: kycId,
      newValue: { status: 'RECHAZADO', reason },
    },
  });

  return updated;
}

/**
 * Obtiene el estado KYC del usuario actual
 */
export async function getMyKYCAction() {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  const kyc = await prisma.kYC.findUnique({
    where: { userId: user.id },
  });

  return kyc;
}

/**
 * Obtiene todas las solicitudes KYC pendientes (para admin)
 */
export async function getPendingKYCListAction() {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_KYC)) {
    throw new Error('No tiene permisos');
  }

  const kycList = await prisma.kYC.findMany({
    where: { status: 'EN_REVISION' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return kycList;
}
