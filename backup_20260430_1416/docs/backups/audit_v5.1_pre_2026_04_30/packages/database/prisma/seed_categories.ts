import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding requested categories...');

  const requestedCats = [
    { name: 'Niños', slug: 'ninos', type: 'PRODUCT' as const },
    { name: 'Niñas', slug: 'ninas', type: 'PRODUCT' as const },
    { name: 'Mujeres', slug: 'mujeres', type: 'PRODUCT' as const },
    { name: 'Hombres', slug: 'hombres', type: 'PRODUCT' as const },
    { name: 'Mascotas', slug: 'mascotas', type: 'PRODUCT' as const },
    { name: 'Salud y Medicina', slug: 'salud-y-medicina', type: 'SERVICE' as const },
  ];

  for (const cat of requestedCats) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug }
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          type: cat.type,
          isActive: true
        }
      });
      console.log(`✅ Created category: ${cat.name}`);
    } else {
      console.log(`ℹ️ Category ${cat.name} already exists.`);
    }
  }

  console.log('✨ Categories seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
