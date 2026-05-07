const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SaidonClub Dashboard Audit Seed ---');

  const roles = [
    'ADMIN',
    'SUPER_ADMIN',
    'ACCOUNTANT',
    'PREFERENTE',
    'PIONERO',
    'PROVIDER',
    'CLIENT'
  ];

  for (const role of roles) {
    console.log(`Checking role: ${role}...`);
    for (let i = 1; i <= 2; i++) {
      const email = `${role.toLowerCase()}${i}@saidonclub.com`;
      const username = `${role.toLowerCase()}_user_${i}`;
      
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (!existingUser) {
        console.log(`Creating user: ${email} with role ${role}`);
        const user = await prisma.user.create({
          data: {
            email,
            username,
            name: `${role} Professional ${i}`,
            role: role,
            status: 'ACTIVE',
            affiliateCode: `${role}_${i}_${Math.random().toString(36).substring(7).toUpperCase()}`,
          }
        });

        if (role === 'PROVIDER') {
          await prisma.providerProfile.create({
            data: {
              userId: user.id,
              companyName: `Empresa ${role} ${i}`,
              address: 'Quito, Ecuador',
              whatsappPhone: '+593900000000',
              contactEmail: email
            }
          });
        }
      } else {
        console.log(`User ${email} already exists.`);
      }
    }
  }

  console.log('--- Seed Finished Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
