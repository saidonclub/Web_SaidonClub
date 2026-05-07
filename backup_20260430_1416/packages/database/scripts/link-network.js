const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminId = 'f6b46225-02da-4ad0-8c5e-25e22f656e4e'; // saidonclub@gmail.com
  const testRootId = '763b92f5-87ca-410a-b0c5-73763eb94b8c'; // Test root user

  const testRoot = await prisma.user.findUnique({ where: { id: testRootId } });
  
  if (testRoot) {
    await prisma.user.update({
      where: { id: testRootId },
      data: {
        sponsorId: adminId
      }
    });
    console.log('Linked test root user to admin user.');
  } else {
    console.log('Test root user not found.');
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
