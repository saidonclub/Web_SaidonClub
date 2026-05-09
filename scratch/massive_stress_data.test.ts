import { test } from 'vitest';
import { prisma } from '../packages/database/src';
import { UserRole, UserStatus } from '../packages/database/src/generated/client_v2';

test('Generación de datos de estrés MLM', async () => {
  console.log('🚀 Iniciando generación de datos de estrés (5,000 usuarios)...');

  // 1. Asegurar usuario Raíz
  let root = await prisma.user.findUnique({ where: { username: 'root_stress' } });
  if (!root) {
    root = await prisma.user.create({
      data: {
        email: 'root@stress.test',
        username: 'root_stress',
        name: 'Root Stress User',
        role: UserRole.PIONERO,
        status: UserStatus.ACTIVE,
        affiliateCode: 'ROOTSTRESS',
      }
    });
    console.log('✅ Usuario Raíz creado.');
  }

  const TOTAL_USERS = 5000;
  const BATCH_SIZE = 500;
  const usersCreatedIds: string[] = [root.id];
  
  // 2. Generar usuarios en red
  console.log('📦 Generando usuarios en estructura de red...');
  for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
    const batchPromises = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_USERS; j++) {
      const userIndex = i + j;
      const sponsorId = usersCreatedIds[Math.floor(Math.random() * usersCreatedIds.length)];
      
      batchPromises.push(
        prisma.user.create({
          data: {
            email: `user_${userIndex}@stress.test`,
            username: `user_${userIndex}`,
            name: `Stress User ${userIndex}`,
            role: UserRole.PIONERO,
            status: UserStatus.ACTIVE,
            affiliateCode: `STRESS_${userIndex}`,
            sponsorId: sponsorId,
          }
        })
      );
    }
    
    const results = await Promise.all(batchPromises);
    usersCreatedIds.push(...results.map(u => u.id));
    console.log(`  - Procesados ${usersCreatedIds.length} usuarios...`);
  }

  // 3. Generar Transacciones (Points Ledger)
  console.log('💰 Generando 20,000 registros de puntos...');
  const TOTAL_POINTS_RECORDS = 20000;
  for (let i = 0; i < TOTAL_POINTS_RECORDS; i += BATCH_SIZE) {
    const batchPromises = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_POINTS_RECORDS; j++) {
      const randomUserId = usersCreatedIds[Math.floor(Math.random() * usersCreatedIds.length)];
      batchPromises.push(
        prisma.pointsLedger.create({
          data: {
            userId: randomUserId,
            amount: (Math.random() * 100) + 10,
            sourceType: 'PURCHASE',
            cycleMonth: new Date().getMonth() + 1,
            cycleYear: new Date().getFullYear(),
            description: 'Compra de prueba estrés',
          }
        })
      );
    }
    await Promise.all(batchPromises);
    if ((i + BATCH_SIZE) % 5000 === 0) {
      console.log(`  - Generados ${i + BATCH_SIZE} registros de puntos...`);
    }
  }

  console.log('✅ Generación masiva completada.');
  console.log(`📊 Resumen: ${usersCreatedIds.length} usuarios, ${TOTAL_POINTS_RECORDS} transacciones.`);
}, 600000); // 10 minutos de timeout

