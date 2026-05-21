import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";
import { Role, Permission, hasPermission } from "@saidonclub/rbac";

const SERVICE_CATEGORIES = [
  "MEDICAL_CONSULTATION",
  "DENTAL",
  "PSYCHOLOGY",
  "PHYSIOTHERAPY",
  "NUTRITION",
  "OPTOMETRY",
  "LEGAL_CONSULTATION",
  "NOTARY",
  "ARCHITECTURAL_DESIGN",
  "ENGINEERING_CONSULTING",
  "ACCOUNTING",
  "FINANCIAL_ADVISORY",
  "TUTORING",
  "COACHING",
  "HAIRCUT_STYLING",
  "AESTHETIC_TREATMENT",
  "MASSAGE_THERAPY",
  "WEB_DEVELOPMENT",
  "GRAPHIC_DESIGN",
  "TECHNICAL_SUPPORT",
  "PLUMBING",
  "ELECTRICAL",
  "CARPENTRY",
  "CLEANING_SERVICE",
  "OTHER",
] as const;

const PROFESSION_CATEGORIES = [
  "HEALTH",
  "LEGAL",
  "ARCHITECTURE",
  "ENGINEERING",
  "FINANCIAL",
  "EDUCATION",
  "BEAUTY",
  "TECHNOLOGY",
  "HOME_SERVICES",
  "OTHER",
] as const;

const MEMBERSHIP_TYPES = ["PREFERENTE", "PIONERO"] as const;

function generateUserData(index: number) {
  const isProvider = index % 3 === 0;
  const isMember = index % 2 === 0;

  const baseData = {
    email: `user${index}@test.saidonclub.com`,
    username: `testuser${index}`,
    name: `Usuario Prueba ${index}`,
    phone: `+59399${String(index).padStart(7, "0")}`,
    role: isProvider ? "PROVIDER_SERVICES" : ("CLIENT" as const),
    affiliateCode: `TEST${String(index).padStart(6, "0")}`,
  };

  return { ...baseData, isProvider, isMember };
}

function generateProviderProfile(index: number) {
  const categories = [...PROFESSION_CATEGORIES];
  const category = categories[index % categories.length];

  const professions: Record<string, string[]> = {
    HEALTH: [
      "Médico General",
      "Dentista",
      "Psicólogo",
      "Fisioterapeuta",
      "Nutricionista",
    ],
    LEGAL: ["Abogado", "Notario", "Asesor Legal", "Abogado Corporativo"],
    ARCHITECTURE: ["Arquitecto", "Diseñador de Interiores", "Urbanista"],
    ENGINEERING: [
      "Ingeniero Civil",
      "Ingeniero de Sistemas",
      "Ingeniero Industrial",
    ],
    FINANCIAL: ["Contador", "Asesor Financiero", "Analista de Inversiones"],
    EDUCATION: [
      "Profesor",
      "Tutor",
      "Coach Educativo",
      "Instructor de Idiomas",
    ],
    BEAUTY: ["Peluquero", "Esteticista", "Maquillador", "Masajista"],
    TECHNOLOGY: ["Desarrollador Web", "Diseñador Gráfico", "Soporte Técnico"],
    HOME_SERVICES: [
      "Plomero",
      "Electricista",
      "Carpintero",
      "Limpiador",
      "Albañil",
    ],
    OTHER: ["Consultor", "Asesor", "Especialista"],
  };

  const professionList = professions[category] || ["Consultor"];
  const profession = professionList[index % professionList.length];

  return {
    businessName: `Empresa ${index} - ${profession}`,
    profession,
    professionCategory: category,
    bio: `Proveedor de servicios profesionales de ${profession.toLowerCase()}.`,
    phone: `+59399${String(index).padStart(7, "0")}`,
    email: `provider${index}@test.saidonclub.com`,
  };
}

function generateServiceData(index: number, providerId: string) {
  const serviceNames: Record<string, string[]> = {
    MEDICAL_CONSULTATION: [
      "Consulta Médica General",
      "Chequeo Anual",
      "Atención de Urgencias",
    ],
    DENTAL: [
      "Limpieza Dental",
      "Ortodoncia",
      "Blanqueamiento",
      "Tratamiento de Cavidades",
    ],
    PSYCHOLOGY: [
      "Terapia Individual",
      "Terapia de Pareja",
      "Terapia Familiar",
      "Evaluación Psicológica",
    ],
    PHYSIOTHERAPY: [
      "Rehabilitación Física",
      "Masaje Terapéutico",
      "Ejercicios de Recuperación",
    ],
    NUTRITION: ["Plan Nutricional", "Asesoría Dietética", "Control de Peso"],
    LEGAL_CONSULTATION: [
      "Asesoría Legal",
      "Redacción de Contratos",
      "Consultoría Jurídica",
    ],
    NOTARY: [
      "Legalización de Documentos",
      "Escritura Pública",
      "Trámites Notariales",
    ],
    HOME_SERVICES: [
      "Reparación de Tuberías",
      "Instalación Eléctrica",
      "Pintura",
      "Carpintería",
    ],
    TECHNOLOGY: [
      "Desarrollo Web",
      "Diseño Gráfico",
      "Soporte Técnico",
      "Creación de Apps",
    ],
    EDUCATION: [
      "Clases de Inglés",
      "Tutoría Matemática",
      "Clases de Física",
      "Preparación para Exámenes",
    ],
  };

  const categories = [...SERVICE_CATEGORIES];
  const category = categories[index % categories.length];
  const names = serviceNames[category] || [`Servicio ${index}`];
  const name = names[index % names.length];

  const publicPrice = Math.floor(Math.random() * 150) + 20;
  const memberDiscount = 0.15;
  const internalDiscount = 0.25;

  return {
    providerId,
    name,
    description: `Servicio profesional de ${name.toLowerCase()}.`,
    category,
    publicPrice,
    memberPrice: Math.round(publicPrice * (1 - memberDiscount) * 100) / 100,
    internalPrice: Math.round(publicPrice * (1 - internalDiscount) * 100) / 100,
    companyCommission: Math.round(publicPrice * 0.1 * 100) / 100,
    commissionPercentage: 10,
    ivaPercentage: 15,
    ivaIncluded: false,
    modality:
      index % 3 === 0
        ? ("PRESENCIAL" as const)
        : index % 3 === 1
          ? ("VIRTUAL" as const)
          : ("DOMICILIO" as const),
    duration: [30, 45, 60, 90][index % 4],
    requiresPrePayment: index % 5 === 0,
    isActive: true,
  };
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción" }, { status: 403 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_SYSTEM_CONFIG)) {
    return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { scenarioCount = 200, clearExisting = false } = body;

    if (clearExisting) {
      await prisma.appointment.deleteMany({
        where: { client: { email: { contains: "@test.saidonclub.com" } } },
      });
      await prisma.serviceInvoice.deleteMany({
        where: {
          appointment: {
            client: { email: { contains: "@test.saidonclub.com" } },
          },
        },
      });
      await prisma.bipartiteForm.deleteMany({
        where: {
          appointment: {
            client: { email: { contains: "@test.saidonclub.com" } },
          },
        },
      });
      await prisma.serviceListing.deleteMany({
        where: {
          provider: { user: { email: { contains: "@test.saidonclub.com" } } },
        },
      });
      await prisma.serviceProvider.deleteMany({
        where: { user: { email: { contains: "@test.saidonclub.com" } } },
      });
      await prisma.user.deleteMany({
        where: { email: { contains: "@test.saidonclub.com" } },
      });
    }

    const results = {
      users: { providers: 0, clients: 0 },
      services: 0,
      appointments: { completed: 0, pending: 0, cancelled: 0 },
      invoices: 0,
      commissions: { total: 0, iva: 0 },
    };

    const userIds: { providers: string[]; clients: string[] } = {
      providers: [],
      clients: [],
    };

    for (let i = 1; i <= scenarioCount; i++) {
      const userData = generateUserData(i);

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          name: userData.name,
          phone: userData.phone,
          role: userData.role as "PROVIDER_SERVICES" | "CLIENT",
          affiliateCode: userData.affiliateCode,
          status: "ACTIVE",
        },
      });

      if (userData.isProvider) {
        const providerProfile = generateProviderProfile(i);

        const provider = await prisma.serviceProvider.create({
          data: {
            userId: user.id,
            status: "ACTIVE",
            kycStatus: "APPROVED",
            businessName: providerProfile.businessName,
            profession: providerProfile.profession,
            professionCategory: providerProfile.professionCategory,
            bio: providerProfile.bio,
            phone: providerProfile.phone,
            email: providerProfile.email,
            city: "Quito",
            province: "Pichincha",
            agreementNumber: `AGR-TEST-${i}`,
            agreementSignedAt: new Date(),
          },
        });

        const serviceData = generateServiceData(i, provider.id);
        await prisma.serviceListing.create({
          data: serviceData,
        });

        results.users.providers++;
        results.services++;
        userIds.providers.push(user.id);
      } else {
        if (userData.isMember) {
          await prisma.membership.create({
            data: {
              userId: user.id,
              type: MEMBERSHIP_TYPES[i % 2],
              price: i % 2 === 0 ? 99 : 199,
              purchaseDate: new Date(),
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          });
        }
        results.users.clients++;
        userIds.clients.push(user.id);
      }

      if (i % 10 === 0) {
        const providerIndex = Math.floor((i / 10) % userIds.providers.length);
        const clientIndex = Math.floor((i / 10) % userIds.clients.length);

        if (userIds.providers[providerIndex] && userIds.clients[clientIndex]) {
          const provider = await prisma.serviceProvider.findFirst({
            where: { userId: userIds.providers[providerIndex] },
          });

          if (provider) {
            const service = await prisma.serviceListing.findFirst({
              where: { providerId: provider.id },
            });

            if (service) {
              const statusOptions = [
                "COMPLETADA",
                "PENDING_PROVIDER",
                "CANCELADA",
              ];
              const status = statusOptions[i % 3];
              const isMember = i % 2 === 0;

              const appliedPrice = isMember
                ? Number(service.memberPrice)
                : Number(service.publicPrice);
              const ivaAmount = appliedPrice * 0.15;
              const totalCharged = appliedPrice + ivaAmount;
              const commission = totalCharged * 0.1;

              const appointment = await prisma.appointment.create({
                data: {
                  clientId: userIds.clients[clientIndex],
                  providerId: provider.id,
                  serviceId: service.id,
                  status: status as "COMPLETADA" | "PENDING_PROVIDER" | "CANCELADA",
                  appliedPublicPrice: Number(service.publicPrice),
                  appliedMemberPrice: Number(service.memberPrice),
                  appliedInternalPrice: Number(service.internalPrice),
                  appliedIvaPercentage: 15,
                  ivaAmount,
                  totalCharged,
                  companyCommissionAmount: commission,
                  providerNetAmount: totalCharged - commission,
                  paymentMethod: "STRIPE",
                  paymentStatus:
                    status === "COMPLETADA" ? "COMPLETED" : "PENDING",
                  paidAt: status === "COMPLETADA" ? new Date() : null,
                  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                },
              });

              if (status === "COMPLETADA") {
                const invoice = await prisma.serviceInvoice.create({
                  data: {
                    appointmentId: appointment.id,
                    invoiceNumber: `INV-TEST-${i}`,
                    providerLegalName: provider.businessName,
                    providerAgreementNumber:
                      provider.agreementNumber || "AGR-TEST",
                    clientLegalName: `Cliente ${clientIndex}`,
                    clientIdDocument: `1234567890`,
                    clientIdType: "CEDULA",
                    subtotal: appliedPrice,
                    ivaPercentage: 15,
                    ivaAmount,
                    total: totalCharged,
                    companyCommission: commission,
                    providerNetPayment: totalCharged - commission,
                    agreementInternalPrice: Number(service.internalPrice),
                    invoiceStatus: "PAID",
                  },
                });

                await prisma.serviceAccountingEntry.create({
                  data: {
                    invoiceId: invoice.id,
                    agreementNumber: provider.agreementNumber || "AGR-TEST",
                    providerCode: provider.id,
                    serviceDate: new Date(),
                    clientChargedTotal: totalCharged,
                    ivaAmount,
                    companyCommission: commission,
                    providerNetPayment: totalCharged - commission,
                  },
                });

                results.invoices++;
                results.commissions.total += Number(totalCharged);
                results.commissions.iva += ivaAmount;
                results.appointments.completed++;
              } else if (status === "PENDING_PROVIDER") {
                results.appointments.pending++;
              } else {
                results.appointments.cancelled++;
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Simulación de ${scenarioCount} escenarios completada`,
      results,
      summary: {
        totalUsers: results.users.providers + results.users.clients,
        providers: results.users.providers,
        clients: results.users.clients,
        servicesCreated: results.services,
        transactionsProcessed: results.invoices,
      },
    });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { error: "Error en la simulación" },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible en producción" }, { status: 403 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_SYSTEM_CONFIG)) {
    return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
  }

  try {
    const stats = await Promise.all([
      prisma.user.count({
        where: { email: { contains: "@test.saidonclub.com" } },
      }),
      prisma.serviceProvider.count({
        where: { user: { email: { contains: "@test.saidonclub.com" } } },
      }),
      prisma.serviceListing.count({
        where: {
          provider: { user: { email: { contains: "@test.saidonclub.com" } } },
        },
      }),
      prisma.appointment.count({
        where: { client: { email: { contains: "@test.saidonclub.com" } } },
      }),
      prisma.serviceInvoice.count({
        where: {
          appointment: {
            client: { email: { contains: "@test.saidonclub.com" } },
          },
        },
      }),
    ]);

    return NextResponse.json({
      users: stats[0],
      providers: stats[1],
      services: stats[2],
      appointments: stats[3],
      invoices: stats[4],
    });
   } catch {
     return NextResponse.json(
       { error: "Error al obtener estadísticas" },
       { status: 500 },
     );
   }
}
