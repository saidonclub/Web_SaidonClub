import { PrismaClient, UserRole, UserStatus, MembershipType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rolesToSeed = [
    UserRole.SUPER_ADMIN,
    UserRole.ACCOUNTANT,
    UserRole.PREFERENTE,
    UserRole.PIONERO
  ];

  console.log('--- Seeding Missing Users (2 per role) ---');

  for (const role of rolesToSeed) {
    for (let i = 1; i <= 2; i++) {
      const username = `${role.toLowerCase()}${i}`;
      const email = `${username}@saidonclub.com`;
      const affiliateCode = `${username.toUpperCase()}_${i}_CODE`;

      const user = await prisma.user.upsert({
        where: { email },
        update: { role },
        create: {
          email,
          username,
          name: `${role.charAt(0) + role.slice(1).toLowerCase()} User ${i}`,
          role,
          status: UserStatus.ACTIVE,
          affiliateCode,
        },
      });

      console.log(`User: ${user.email} | Role: ${user.role} | Affiliate: ${user.affiliateCode}`);

      // Handle Membership for specific roles
      if (role === UserRole.PREFERENTE || role === UserRole.PIONERO) {
        const mType = role === UserRole.PREFERENTE ? MembershipType.PREFERENTE : MembershipType.PIONERO;
        const price = mType === MembershipType.PIONERO ? 500 : 100;

        await prisma.membership.upsert({
          where: { userId: user.id },
          update: { type: mType },
          create: {
            userId: user.id,
            type: mType,
            price: price,
            purchaseDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
        console.log(`  -> Membership ${mType} created for ${user.username}`);
      }
    }
  }
  
  console.log('--- Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
