import { prisma } from '../apps/web/lib/prisma';

async function main() {
  const configs = await prisma.systemConfig.findMany({
    where: {
      key: {
        contains: 'rank_'
      }
    }
  });
  console.log(JSON.stringify(configs, null, 2));
}

main().catch(console.error);
