import { prisma } from '@saidonclub/database';
import { executeWeeklyClosure } from '../closure';
import { refreshAllVolumesCache } from '../genealogy';

async function runStressTest() {
  console.log('--- STARTING STRESS TEST (STANDALONE) ---');
  
  try {
    // 1. Setup
    const testDate = new Date();
    console.log('Refreshing volume cache...');
    await refreshAllVolumesCache(testDate.getMonth() + 1, testDate.getFullYear());

    // 2. Execution
    console.log('Executing weekly closure...');
    const start = Date.now();
    await executeWeeklyClosure(testDate);
    const end = Date.now();

    console.log(`Closure executed in ${end - start}ms`);

    // 3. Verification
    const closure = await prisma.weeklyClosure.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!closure) throw new Error('No closure found after execution');
    console.log('Closure Status:', closure.status);
    console.log('Total Paid:', closure.totalPaid);

    if (closure.status !== 'PROCESSED') {
      throw new Error(`Expected status PROCESSED, got ${closure.status}`);
    }

    console.log('--- STRESS TEST PASSED ---');
    process.exit(0);
  } catch (error) {
    console.error('--- STRESS TEST FAILED ---');
    console.error(error);
    process.exit(1);
  }
}

runStressTest();
