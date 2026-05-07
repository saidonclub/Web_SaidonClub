const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'saidonclub@gmail.com';
  const authId = 'f6b46225-02da-4ad0-8c5e-25e22f656e4e';

  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    console.log(`User found. Updating ID if necessary...`);
    if (user.id !== authId) {
      // Because id is the primary key and might have relations, changing ID might be complex or impossible directly via Prisma update if there are foreign keys.
      console.log(`User ID in DB is ${user.id}, but Auth ID is ${authId}. This might cause a mismatch.`);
    } else {
      console.log(`User ID matches Auth ID.`);
    }
  } else {
    console.log(`User not found in DB. Creating...`);
    user = await prisma.user.create({
      data: {
        id: authId,
        email: email,
        username: 'saidonadmin',
        name: 'Saidon Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
        affiliateCode: 'SAIDONADMIN',
        // Optional: you can link it to the test network root '763b92f5-87ca-410a-b0c5-73763eb94b8c' as a sponsor, or make this user the root
      }
    });
    console.log(`Created user in DB:`, user);
    
    // Create wallet for the user
    await prisma.wallet.create({
      data: {
        userId: user.id,
      }
    });
    console.log(`Wallet created for user.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
