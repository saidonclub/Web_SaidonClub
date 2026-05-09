import { prisma } from '@saidonclub/database';
import { refreshAllVolumesCache } from '../src/genealogy';
import { evaluateRank } from '../src/ranks';

async function verifyCache() {
  const month = 5;
  const year = 2026;

  console.log('--- REFRESHING CACHE ---');
  await refreshAllVolumesCache(month, year);

  const count = await prisma.volumeCache.count({
    where: { cycleMonth: month, cycleYear: year }
  });
  console.log(`Volume Cache Entries: ${count}`);

  if (count === 0) {
    console.error('ERROR: Volume Cache is empty after refresh!');
    return;
  }

  const sample = await prisma.volumeCache.findFirst({
    where: { cycleMonth: month, cycleYear: year }
  });

  if (sample) {
    console.log(`Verifying evaluation for user: ${sample.userId}`);
    const start = Date.now();
    const rank = await evaluateRank(sample.userId, month, year);
    const end = Date.now();
    console.log(`Evaluation took ${end - start}ms`);
    console.log('Rank Result:', JSON.stringify(rank, null, 2));
  }
}

verifyCache().catch(console.error).finally(() => prisma.$disconnect());
