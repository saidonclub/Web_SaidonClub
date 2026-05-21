import { prisma } from '../packages/database/src/client';

async function main() {
  console.log('--- Inspecting Categories ---');
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { services: true }
      }
    }
  });
  console.log('All Categories:');
  categories.forEach(c => {
    console.log(`- [${c.type}] ID: ${c.id} | Slug: ${c.slug} | Name: ${c.name} | Services count: ${c._count.services}`);
  });

  console.log('\n--- Inspecting Users / Providers ---');
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ['PROVIDER_SERVICES', 'PROVIDER_PRODUCTS', 'ADMIN', 'SUPER_ADMIN']
      }
    },
    take: 10
  });
  console.log('Sample Users with Provider/Admin Roles:');
  users.forEach(u => {
    console.log(`- ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | Name: ${u.name}`);
  });

  console.log('\n--- Inspecting Cities ---');
  const cities = await prisma.city.findMany({
    take: 5
  });
  console.log('Sample Cities:');
  cities.forEach(city => {
    console.log(`- ID: ${city.id} | Name: ${city.name}`);
  });
}

main()
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
