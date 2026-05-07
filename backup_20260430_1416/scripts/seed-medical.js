const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient();

const MEDICAL_SERVICES = [
  { name: 'Consulta Medicina General', price: 45, image: 'https://images.unsplash.com/photo-1505751172107-57322a3074d6?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Pediatría Especializada', price: 60, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Ginecología y Obstetricia', price: 70, image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Cardiología - Electrocardiograma', price: 85, image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Dermatología Clínica', price: 55, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Odontología Integral', price: 40, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Nutrición y Dietética', price: 35, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Fisioterapia y Rehabilitación', price: 30, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Psicología Clínica', price: 50, image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Oftalmología - Examen Visual', price: 45, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Traumatología y Ortopedia', price: 65, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Endocrinología', price: 75, image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Urología', price: 70, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Gastroenterología', price: 80, image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Laboratorio Clínico - Perfil Básico', price: 25, image: 'https://images.unsplash.com/photo-1579154236594-e179f25288ed?q=80&w=2070&auto=format&fit=crop' }
];

async function main() {
  console.log('Seeding Medical Services...');

  const country = await prisma.country.findUnique({ where: { code: 'EC' } }) || 
    await prisma.country.create({ data: { name: 'Ecuador', code: 'EC', currency: 'USD', phonePrefix: '+593', isActive: true } });

  const city = await prisma.city.findFirst({ where: { name: 'Quito' } }) || 
    await prisma.city.create({ data: { name: 'Quito', countryId: country.id, isActive: true } });

  let medicalCategory = await prisma.category.findUnique({ where: { slug: 'salud' } });
  if (!medicalCategory) {
    medicalCategory = await prisma.category.create({
      data: { name: 'Salud', slug: 'salud', type: 'SERVICE' }
    });
  }

  const medicalProvider = await prisma.user.upsert({
    where: { email: 'red-medica@saidonclub.com' },
    update: {},
    create: {
      email: 'red-medica@saidonclub.com',
      username: 'red_medica_saidon',
      name: 'Red Médica SaidonClub',
      role: 'PROVIDER',
      status: 'ACTIVE',
      affiliateCode: 'SALUD_SAIDON_001',
      providerProfile: {
        create: {
          companyName: 'Red Médica SaidonClub',
          address: 'Centros Médicos Afiliados a Nivel Nacional',
          whatsappPhone: '+593900000000',
          contactEmail: 'salud@saidonclub.com'
        }
      }
    }
  });

  for (const svc of MEDICAL_SERVICES) {
    const slug = svc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await prisma.service.upsert({
      where: { slug },
      update: {
        images: [svc.image],
        pricePVP: svc.price,
        priceSaidon: svc.price * 0.7, // 30% discount
        cost: svc.price * 0.5
      },
      create: {
        name: svc.name,
        description: `Servicio profesional de ${svc.name} garantizado por la Red Médica de SaidonClub. Tarifas exclusivas para miembros.`,
        slug,
        pricePVP: svc.price,
        priceSaidon: svc.price * 0.7,
        cost: svc.price * 0.5,
        pointsEarned: Math.floor(svc.price / 5),
        category: { connect: { id: medicalCategory.id } },
        provider: { connect: { id: medicalProvider.id } },
        city: { connect: { id: city.id } },
        location: 'Red Nacional / Quito',
        status: 'ACTIVE',
        isActive: true,
        images: [svc.image]
      }
    });
  }

  console.log('Medical Services Seeded Successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
