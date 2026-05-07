import {
  PrismaClient,
  UserRole,
  CategoryType,
  ServiceStatus,
  UserStatus,
} from "../src/generated/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const SPECIALTIES = [
  "Medicina General",
  "Pediatría",
  "Ginecología",
  "Odontología",
  "Cardiología",
  "Dermatología",
  "Oftalmología",
  "Nutrición",
  "Psicología",
  "Fisioterapia",
  "Gastroenterología",
  "Traumatología",
  "Endocrinología",
  "Neurología",
  "Otorrinolaringología",
];

const SERVICE_NAMES = [
  "Consulta Médica",
  "Consulta Especializada",
  "Control de Seguimiento",
  "Examen de Diagnóstico",
  "Tratamiento Integral",
  "Evaluación Inicial",
  "Procedimiento Menor",
  "Chequeo Preventivo",
];

const MEDICAL_IMAGES: Record<string, string> = {
  "medicina-general":
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop",
  pediatria:
    "https://images.unsplash.com/photo-1584362942436-1c70e301297e?q=80&w=1000&auto=format&fit=crop",
  ginecologia:
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1000&auto=format&fit=crop",
  odontologia:
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1000&auto=format&fit=crop",
  cardiologia:
    "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000&auto=format&fit=crop",
  dermatologia:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop",
  oftalmologia:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
  nutricion:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
  psicologia:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
  fisioterapia:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
  traumatologia:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop",
};

const DEFAULT_MEDICAL_IMAGE =
  "https://images.unsplash.com/photo-1576091160550-217359f4b84c?q=80&w=1000&auto=format&fit=crop";

async function main() {
  console.log("🌱 Iniciando seed de 100 Servicios Médicos...");

  // 1. Asegurar que existe un Proveedor Médico (Provider)
  const provider = await prisma.user.upsert({
    where: { email: "redmedica@saidonclub.com" },
    update: {},
    create: {
      email: "redmedica@saidonclub.com",
      username: "redmedica",
      name: "Red Médica SaidonClub",
      role: UserRole.PROVIDER,
      status: UserStatus.ACTIVE,
      affiliateCode: "REDMEDICA30",
    },
  });

  // 2. Asegurar que existen las categorías de salud
  const healthParent = await prisma.category.upsert({
    where: { slug: "salud" },
    update: { type: CategoryType.SERVICE },
    create: {
      name: "Salud y Medicina",
      slug: "salud",
      type: CategoryType.SERVICE,
    },
  });

  const categories = [];
  for (const specialty of SPECIALTIES) {
    const slug = specialty
      .toLowerCase()
      .replace(/ /g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { parentId: healthParent.id },
      create: {
        name: specialty,
        slug,
        type: CategoryType.SERVICE,
        parentId: healthParent.id,
      },
    });
    categories.push(cat);
  }

  // 3. Generar 100 servicios
  let createdCount = 0;
  for (let i = 1; i <= 100; i++) {
    const specialtyCat =
      categories[Math.floor(Math.random() * categories.length)];
    const serviceBase =
      SERVICE_NAMES[Math.floor(Math.random() * SERVICE_NAMES.length)];

    const pricePVP = Math.floor(Math.random() * (80 - 30) + 30); // 30 - 80 USD
    const discount = 0.3; // 30% discount
    const priceSaidon = pricePVP * (1 - discount);

    const name = `${serviceBase} - ${specialtyCat.name} #${i}`;
    const slug = `${name.toLowerCase().replace(/ /g, "-").replace(/#/g, "")}-${i}`;

    await prisma.service.upsert({
      where: { slug },
      update: {},
      create: {
        code: `MED-${String(i).padStart(5, "0")}`,
        name,
        slug,
        description: `Servicio profesional de ${specialtyCat.name}. Atención personalizada con los mejores especialistas de la red SaidonClub.`,
        pricePVP: pricePVP.toString(),
        priceSaidon: priceSaidon.toString(),
        cost: (priceSaidon * 0.8).toString(),
        pointsEarned: Math.floor(priceSaidon * 0.1).toString(),
        categoryId: specialtyCat.id,
        providerId: provider.id,
        location: "Red Nacional SaidonClub",
        status: ServiceStatus.ACTIVE,
        isActive: true,
        images: [MEDICAL_IMAGES[specialtyCat.slug] || DEFAULT_MEDICAL_IMAGE],
        videos: [],
      },
    });
    createdCount++;
  }

  console.log(`✅ Seed médico completado: ${createdCount} servicios creados.`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed médico:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
