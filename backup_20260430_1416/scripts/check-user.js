const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'saidonclub@gmail.com' },
    include: {
      referrals: true,
      sponsor: true
    }
  });

  if (user) {
    console.log('User found in Prisma:', user.id);
    console.log('Referrals count:', user.referrals.length);
    console.log('Sponsor:', user.sponsor ? user.sponsor.email : 'None');
  } else {
    console.log('User not found in Prisma.');
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
