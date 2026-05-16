import { prisma } from '../packages/database/src/client';

async function main() {
  console.log('--- MLM ENGINE AUDIT ---');

  // 1. Check Weekly Closures
  const closures = await prisma.weeklyClosure.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  console.log('\nLast 5 Weekly Closures:');
  closures.forEach(c => {
    console.log(`- ID: ${c.id}, Date: ${c.closureDate}, Status: ${c.status}, CreatedAt: ${c.createdAt}`);
  });

  // 2. Check for Wallet Duplications (userId should be unique)
  // Prisma schema says userId is unique, but we want to be sure there are no issues or inconsistent states
  const wallets = await prisma.wallet.findMany();
  const userIds = wallets.map(w => w.userId);
  const uniqueUserIds = new Set(userIds);

  console.log(`\nWallet Summary:`);
  console.log(`- Total Wallets: ${wallets.length}`);
  console.log(`- Unique Users: ${uniqueUserIds.size}`);

  if (wallets.length !== uniqueUserIds.size) {
    console.error('CRITICAL: Wallet duplication detected!');
  } else {
    console.log('✅ No wallet duplications found.');
  }

  // 3. Check for Pending transactions/commissions
  const pendingCommissions = await prisma.commission.count({ where: { status: 'PENDING' } });
  const validatedCommissions = await prisma.commission.count({ where: { status: 'VALIDATED' } });

  console.log(`\nCommissions:`);
  console.log(`- Pending: ${pendingCommissions}`);
  console.log(`- Validated: ${validatedCommissions}`);

  // 4. Check for Wallet Transaction status
  const pendingTxs = await prisma.walletTransaction.count({ where: { status: 'PENDING' } });
  const validatedTxs = await prisma.walletTransaction.count({ where: { status: 'VALIDATED' } });

  console.log(`\nWallet Transactions:`);
  console.log(`- Pending: ${pendingTxs}`);
  console.log(`- Validated: ${validatedTxs}`);

  // 5. Verify Balance consistency (Sample check)
  const usersWithBalances = await prisma.wallet.findMany({
    where: {
      OR: [
        { balancePending: { gt: 0 } },
        { balanceValidated: { gt: 0 } }
      ]
    },
    take: 10
  });

  console.log(`\nSample Wallets with Balance:`);
  usersWithBalances.forEach(w => {
    console.log(`- User: ${w.userId}, Pending: ${w.balancePending}, Validated: ${w.balanceValidated}, Available: ${w.balanceAvailable}`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
