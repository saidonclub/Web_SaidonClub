import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function createNetwork(sponsorId: string | null, depth: number, count: number): Promise<void> {
  if (depth > 8) return;

  for (let i = 1; i <= count; i++) {
    const email = `level${depth}_user${i}_${sponsorId?.substring(0, 4) || 'root'}@test.com`;
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username: `user_L${depth}_${i}_${Math.random().toString(36).substring(7)}`,
        name: `Socio Nivel ${depth} - ${i}`,
        role: UserRole.PREFERENTE,
        status: 'ACTIVE',
        sponsorId: sponsorId,
        affiliateCode: `REF-L${depth}-${i}-${Math.random().toString(36).substring(5)}`,
      },
    });

    console.log(`Created user at level ${depth}: ${email}`);
    
    // Create wallet for the user
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balanceAvailable: 0,
        balancePending: 0,
        totalEarned: 0,
      },
    });

    // Recurse to next level
    await createNetwork(user.id, depth + 1, 2); // 2 referrals per user
  }
}

async function main() {
  console.log('🌱 Iniciando creación de red de 8 niveles...');

  // Create or get root user
  const rootEmail = 'root@saidonclub.com';
  const rootUser = await prisma.user.upsert({
    where: { email: rootEmail },
    update: {},
    create: {
      email: rootEmail,
      username: 'root_saidon',
      name: 'Socio Fundador',
      role: UserRole.ADMIN,
      status: 'ACTIVE',
      affiliateCode: 'ROOT001',
    },
  });

  console.log('Root user ID:', rootUser.id);

  // Start recursion
  await createNetwork(rootUser.id, 1, 3); // 3 direct referrals for root

  console.log('✅ Red de 8 niveles creada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
