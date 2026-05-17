import { prisma } from '@saidonclub/database';
import { executeWeeklyClosure } from '../src/closure';
import { refreshAllVolumesCache } from '../src/genealogy';

async function main() {
  const PREFIX = 'audit_stress_';
  const USER_COUNT = 500; // Nivel de estrés controlado

  console.log('--------------------------------------------------');
  console.log('  SAIDONCLUB MLM ENGINE - OFFENSIVE AUDIT');
  console.log('--------------------------------------------------');

  try {
    // 1. LIMPIEZA
    console.log(`[1/5] Limpiando datos previos con prefijo ${PREFIX}...`);
    await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });

    // 2. GENERACIÓN DE ESTRUCTURA
    console.log(`[2/5] Generando ${USER_COUNT} usuarios...`);
    
    // Crear Master
    const master = await prisma.user.create({
      data: {
        email: `${PREFIX}master@saidonclub.com`,
        username: `${PREFIX}master`,
        role: 'PIONERO',
        name: 'Audit Master',
        affiliateCode: `${PREFIX}MASTER`,
        kycLevel: 1
      }
    });

    // Crear 5 líneas directas
    const lines = [];
    for (let i = 1; i <= 5; i++) {
      const lineLeader = await prisma.user.create({
        data: {
          email: `${PREFIX}leader${i}@saidonclub.com`,
          username: `${PREFIX}leader${i}`,
          role: 'PIONERO',
          sponsorId: master.id,
          name: `Audit Leader ${i}`,
          affiliateCode: `${PREFIX}L${i}`,
          kycLevel: 1
        }
      });
      lines.push(lineLeader);
    }

    // Repartir el resto de usuarios en las líneas
    const usersPerLine = Math.floor((USER_COUNT - 6) / 5);
    for (const leader of lines) {
      const batch = [];
      for (let j = 1; j <= usersPerLine; j++) {
        batch.push({
          email: `${PREFIX}u_${leader.username}_${j}@saidonclub.com`,
          username: `${PREFIX}u_${leader.username}_${j}`,
          role: 'PIONERO',
          sponsorId: leader.id,
          name: 'Audit User',
          affiliateCode: `${PREFIX}${leader.username.split('_').pop()}_${j}`,
          kycLevel: 1
        });
      }
      await prisma.user.createMany({ data: batch });
    }

    const totalUsers = await prisma.user.count({ where: { email: { startsWith: PREFIX } } });
    console.log(`[OK] Total usuarios inyectados: ${totalUsers}`);

    // 3. INYECCIÓN DE PUNTOS
    console.log(`[3/5] Inyectando volumen de puntos (100 PV por usuario)...`);
    const allUsers = await prisma.user.findMany({ 
        where: { email: { startsWith: PREFIX } },
        select: { id: true }
    });
    
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    await prisma.pointsLedger.createMany({
      data: allUsers.map(u => ({
        userId: u.id,
        amount: 100,
        sourceType: 'MARKETPLACE',
        description: 'Audit Load Stress',
        cycleMonth: currentMonth,
        cycleYear: currentYear
      }))
    });
    console.log(`[OK] Puntos inyectados.`);

    // 4. BENCHMARK VOLUMEN CACHE (RECURSIVE CTE)
    console.log(`[4/5] Ejecutando Fase 2 (Recursive CTE Refresh)...`);
    const t1 = Date.now();
    await refreshAllVolumesCache(currentMonth, currentYear);
    const t2 = Date.now();
    console.log(`[BENCHMARK] Refresh Volumen Cache: ${t2 - t1}ms`);

    // 5. BENCHMARK CIERRE SEMANAL (BATCHING)
    console.log(`[5/5] Ejecutando Fase 3-4 (Weekly Closure Process)...`);
    const t3 = Date.now();
    await executeWeeklyClosure(new Date());
    const t4 = Date.now();
    console.log(`[BENCHMARK] Weekly Closure: ${(t4 - t3) / 1000}s`);

    // RESULTADOS FINALES
    const comisiones = await prisma.commission.count({
      where: { user: { email: { startsWith: PREFIX } } }
    });
    console.log('--------------------------------------------------');
    console.log(`✅ AUDITORÍA COMPLETADA`);
    console.log(`   - Usuarios: ${totalUsers}`);
    console.log(`   - Comisiones Generadas: ${comisiones}`);
    console.log(`   - Tiempo Total: ${(t4 - t1) / 1000}s`);
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ ERROR EN AUDITORÍA:', error);
  } finally {
    // No limpiar automáticamente para permitir inspección manual si se desea
    // await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });
  }
}

main();
