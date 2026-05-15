// ============================================================
// MODULE:     app/provider/appointments/page
// PURPOSE:    Gestión de citas con QR para servicios — Server Component
// ============================================================

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { prisma } from '@saidonclub/database';
import AppointmentsClient from './AppointmentsClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SerializableAppointment = {
  id: string;
  status: string;
  scheduledAt: string | null;
  requestedDate: string | null;
  requestedTimeSlot: string | null;
  isEmergency: boolean;
  totalCharged: number;
  qrCode: string | null;
  service: { name: string; category: string };
  client: { name: string | null; email: string };
  beneficiary: { name: string } | null;
};

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProviderAppointments(
  providerId: string,
): Promise<SerializableAppointment[]> {
  const appts = await prisma.appointment.findMany({
    where: { providerId },
    include: {
      service: { select: { name: true, category: true } },
      client: { select: { name: true, email: true } },
      beneficiary: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return appts.map((a) => ({
    id: a.id,
    status: a.status as string,
    scheduledAt: a.confirmedDate?.toISOString() ?? null,
    requestedDate: a.requestedDate?.toISOString() ?? null,
    requestedTimeSlot: a.requestedTimeSlot ?? null,
    isEmergency: a.isEmergency,
    totalCharged: Number(a.totalCharged ?? 0),
    qrCode: a.qrCode,
    service: { name: a.service.name, category: a.service.category as string },
    client: a.client,
    beneficiary: a.beneficiary
      ? { name: `${a.beneficiary.firstName} ${a.beneficiary.lastName}` }
      : null,
  }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProviderAppointmentsPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  const isServicesProvider =
    role === Role.PROVIDER_SERVICES || role === Role.SUPER_ADMIN;

  if (!isServicesProvider) {
    redirect('/provider');
  }

  // Find the ServiceProvider record linked to this user
  const providerRecord = await prisma.serviceProvider.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!providerRecord) {
    redirect('/provider');
  }

  const appointments = await getProviderAppointments(providerRecord.id);

  return <AppointmentsClient appointments={appointments} />;
}
