import { prisma, Prisma } from '@saidonclub/database';
import { exchangeBalanceToPoints } from '../packages/mlm-engine/src/wallet'; // Wait, let me check the path again.

/**
 * Script de validación de concurrencia para el sistema de puntos.
 * Simula múltiples intentos de canje simultáneos para verificar que
 * la transacción ACID de Prisma previene saldos negativos.
 */
async function testConcurrency() {
  const userId = 'test-user-concurrency';
  
  console.log('--- Configurando usuario de prueba ---');
  
  // 1. Limpiar y crear usuario de prueba
  try {
    // Intentar borrar si existe (y sus relaciones)
    await prisma.pointsLedger.deleteMany({ where: { userId } });
    await prisma.walletTransaction.deleteMany({ wallet: { userId } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
  } catch (e) {
    // Silencioso si no existe
  }

  await prisma.user.create({
    data: {
      id: userId,
      email: 'test@concurrency.com',
      fullName: 'Test Concurrency',
      role: 'USER',
      wallet: {
        create: {
          balanceAvailable: new Prisma.Decimal(100.00), // $100 iniciales
        }
      }
    }
  });

  console.log('Saldo inicial: $100.00');
  console.log('Iniciando 5 canjes simultáneos de $30.00 cada uno...');
  console.log('(Total intentado: $150.00 - Deberían pasar exactamente 3)');

  // 2. Ejecutar 5 canjes en paralelo
  const results = await Promise.allSettled([
    exchangeBalanceToPoints(userId, 30),
    exchangeBalanceToPoints(userId, 30),
    exchangeBalanceToPoints(userId, 30),
    exchangeBalanceToPoints(userId, 30),
    exchangeBalanceToPoints(userId, 30),
  ]);

  let successCount = 0;
  let failureCount = 0;

  results.forEach((res, i) => {
    if (res.status === 'fulfilled') {
      successCount++;
      console.log(`Canje ${i+1}: ÉXITO (Nuevo saldo: $${res.value.newBalanceAvailable})`);
    } else {
      failureCount++;
      console.log(`Canje ${i+1}: FALLO - ${res.reason.message}`);
    }
  });

  // 3. Verificar estado final
  const finalWallet = await prisma.wallet.findUnique({ where: { userId } });
  const pointsLedger = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { amount: true }
  });

  console.log(`\n--- RESULTADOS FINALES ---`);
  console.log(`Éxitos: ${successCount}`);
  console.log(`Fallos: ${failureCount}`);
  console.log(`Saldo final en Wallet: $${finalWallet?.balanceAvailable}`);
  console.log(`Puntos totales generados: ${pointsLedger._sum.amount}`);
  
  const expectedBalance = 10.00;
  if (successCount === 3 && Number(finalWallet?.balanceAvailable) === expectedBalance) {
    console.log('\n✅ PRUEBA PASADA: El sistema manejó correctamente la concurrencia.');
    console.log('No hubo sobregiros y el saldo es consistente.');
  } else {
    console.log('\n❌ PRUEBA FALLIDA: Se detectó una inconsistencia en la concurrencia.');
    process.exit(1);
  }
}

testConcurrency()
  .catch((err) => {
    console.error('Error fatal en la prueba:', err);
    process.exit(1);
  })
  .finally(async () => {
    // Limpiar usuario de prueba al finalizar
    // await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    await prisma.$disconnect();
  });
