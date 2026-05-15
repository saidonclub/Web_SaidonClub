import { prisma } from '../../database/src/client';
import { executeWeeklyClosure } from './closure';
import { v4 as uuidv4 } from 'uuid';
import type { UserRole, PointSource, UserStatus } from '@saidonclub/database';

async function runStressTest() {
  console.log('--- STARTING MLM STRESS TEST ---');
  
  const USER_COUNT = 5000;
  const LEDGER_COUNT = 20000;

  console.log(`Step 1: Generating ${USER_COUNT} users...`);
  
  // Create root user if not exists
  const rootUser = await prisma.user.upsert({
    where: { email: 'root@stress.test' },
    update: {},
    create: {
      email: 'root@stress.test',
      username: 'root_stress',
      role: 'PIONERO',
      affiliateCode: 'ROOTSTRESS',
      status: 'ACTIVE',
    }
  });

  // Generate tree
  const parentPool = [rootUser.id];
  const userBatches = [];
  let currentBatch = [];

  for (let i = 1; i < USER_COUNT; i++) {
    const parentId = parentPool[Math.floor(Math.random() * parentPool.length)];
    const userId = uuidv4();
    const affiliateCode = `STRESS_${i}_${Date.now()}`;
    
    currentBatch.push({
      id: userId,
      email: `user_${i}_${Date.now()}@stress.test`,
      username: `user_${i}_${Date.now()}`,
      sponsorId: parentId,
      affiliateCode,
      role: 'PIONERO' as UserRole,
      status: 'ACTIVE' as UserStatus,
    });

    if (parentPool.length < 500) { 
        parentPool.push(userId);
    }

    if (currentBatch.length >= 500) {
      userBatches.push([...currentBatch]);
      currentBatch = [];
    }
  }
  if (currentBatch.length > 0) userBatches.push(currentBatch);

  for (const batch of userBatches) {
    await prisma.user.createMany({ data: batch });
    console.log(`Inserted batch of ${batch.length} users...`);
  }

  console.log(`Step 2: Generating ${LEDGER_COUNT} ledger entries...`);
  const allUserIds = (await prisma.user.findMany({ 
    where: { email: { contains: '@stress.test' } },
    select: { id: true } 
  })).map(u => u.id);

  const ledgerBatches = [];
  let currentLedgerBatch = [];

  for (let i = 0; i < LEDGER_COUNT; i++) {
    const userId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
    currentLedgerBatch.push({
      id: uuidv4(),
      userId,
      amount: Math.random() * 100,
      sourceType: 'MARKETPLACE' as PointSource,
      cycleMonth: new Date().getMonth() + 1,
      cycleYear: new Date().getFullYear(),
      description: 'Stress test purchase',
    });

    if (currentLedgerBatch.length >= 1000) {
      ledgerBatches.push([...currentLedgerBatch]);
      currentLedgerBatch = [];
    }
  }
  if (currentLedgerBatch.length > 0) ledgerBatches.push(currentLedgerBatch);

  for (const batch of ledgerBatches) {
    await prisma.pointsLedger.createMany({ data: batch });
    console.log(`Inserted batch of ${batch.length} ledger entries...`);
  }

  console.log('Step 3: Running Weekly Closure Benchmark...');
  const start = Date.now();
  await executeWeeklyClosure(new Date());
  const end = Date.now();

  console.log(`--- STRESS TEST COMPLETED ---`);
  console.log(`Total Time: ${(end - start) / 1000}s`);
  
  // Cleanup
  console.log('Step 4: Cleanup...');
  const cleanupLedger = await prisma.pointsLedger.deleteMany({ where: { description: 'Stress test purchase' } });
  const cleanupUsers = await prisma.user.deleteMany({ where: { email: { contains: '@stress.test' } } });
  console.log(`Cleaned up ${cleanupLedger.count} ledger entries and ${cleanupUsers.count} users.`);
}

runStressTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
