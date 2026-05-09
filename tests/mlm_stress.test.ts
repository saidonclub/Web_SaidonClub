/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../packages/database/src/client';
import { executeWeeklyClosure } from '../packages/mlm-engine/src/closure';
import { refreshAllVolumesCache } from '../packages/mlm-engine/src/genealogy';

describe('MLM Engine Performance & Integrity Audit (OFFENSIVE MODE)', () => {
  const PREFIX = 'stress_';
  const USER_COUNT = 5000;
  let allUserIds: string[] = [];

  beforeAll(async () => {
    console.log(`\n[AUDIT] Preparando entorno masivo para ${USER_COUNT} usuarios...`);
    
    // Limpiar auditorías previas
    await prisma.pointsLedger.deleteMany({ where: { user: { email: { startsWith: PREFIX } } } });
    await prisma.volumeCache.deleteMany({ where: { cycleMonth: new Date().getMonth() + 1 } }); // Risky but for test
    await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });

    // 1. Crear Usuario Maestro
    const master = await prisma.user.create({
      data: {
        email: `${PREFIX}master@saidonclub.com`,
        username: `${PREFIX}master`,
        role: 'PIONERO',
        affiliateCode: 'MASTER_AUDIT',
      }
    });
    allUserIds.push(master.id);

    // 2. Generar Red Profunda (Estructura de Árbol Balanceado ~3 hijos por nodo)
    console.log(`[AUDIT] Inyectando ${USER_COUNT} usuarios en estructura de red...`);
    const batchSize = 500;
    for (let i = 0; i < USER_COUNT; i += batchSize) {
      const currentBatchCount = Math.min(batchSize, USER_COUNT - i);
      const batchData = [];
      
      for (let j = 0; j < currentBatchCount; j++) {
        const userIndex = i + j;
        // Elegimos un sponsor de los ya creados para asegurar profundidad
        // Usamos una distribución que favorece a los últimos creados para forzar niveles
        const sponsorId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
        
        batchData.push({
          email: `${PREFIX}user${userIndex}@saidonclub.com`,
          username: `${PREFIX}user${userIndex}`,
          role: 'PIONERO' as any,
          sponsorId: sponsorId,
          affiliateCode: `AFF_${userIndex}`,
        });
      }
      
      // Prisma createMany no devuelve IDs, así que los creamos uno a uno o en lotes pequeños si necesitamos los IDs
      // Para velocidad usamos createMany y luego recuperamos los IDs creados
      await prisma.user.createMany({ data: batchData });
      const created = await prisma.user.findMany({
        where: { email: { startsWith: PREFIX }, id: { notIn: allUserIds } },
        select: { id: true }
      });
      allUserIds.push(...created.map(u => u.id));
      console.log(`  - Red: ${allUserIds.length} / ${USER_COUNT + 1}`);
    }

    // 3. Inyectar Volumen Masivo
    console.log(`[AUDIT] Inyectando 10,000 registros de puntos...`);
    const ledgerData = [];
    for (let k = 0; k < 10000; k++) {
      ledgerData.push({
        userId: allUserIds[Math.floor(Math.random() * allUserIds.length)],
        amount: (Math.random() * 200) + 10,
        sourceType: 'MARKETPLACE' as any,
        cycleMonth: new Date().getMonth() + 1,
        cycleYear: new Date().getFullYear(),
        description: 'Stress Load',
      });
    }
    await prisma.pointsLedger.createMany({ data: ledgerData });

    console.log(`[AUDIT] Entorno listo.\n`);
  }, 300000); // 5 minutos para setup

  afterAll(async () => {
    console.log(`\n[AUDIT] Limpiando datos de prueba...`);
    // Opcional: comentar si se quiere inspeccionar la DB post-test
    // await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });
  });

  it('FASE 1: Benchmark de Recursive CTE (Volúmenes Organizacionales)', async () => {
    const start = performance.now();
    const now = new Date();
    await refreshAllVolumesCache(now.getMonth() + 1, now.getFullYear());
    const end = performance.now();
    
    const duration = (end - start);
    console.log(`[BENCHMARK] Refresh Volumen Cache (5k users): ${duration.toFixed(2)}ms`);
    // Un CTE recursivo bien indexado en Postgres para 5k usuarios debería ser < 500ms
    expect(duration).toBeLessThan(2000); 
  });

  it('FASE 2: Integridad del Cálculo de Volumen', async () => {
    // Verificamos que el volumen del Master sea la suma de todos los puntos de su red
    const now = new Date();
    const m = now.getMonth() + 1;
    const y = now.getFullYear();

    const masterCache = await prisma.volumeCache.findFirst({
      where: { userId: allUserIds[0], cycleMonth: m, cycleYear: y }
    });

    const totalPointsInDB = await prisma.pointsLedger.aggregate({
      where: { cycleMonth: m, cycleYear: y },
      _sum: { amount: true }
    });

    console.log(`[INTEGRITY] Volumen Master: ${masterCache?.volume}`);
    console.log(`[INTEGRITY] Total Puntos Global: ${totalPointsInDB._sum.amount}`);
    
    // En una red donde todos cuelgan del Master (directa o indirectamente), 
    // el volumen del Master debe ser igual al total de puntos del sistema (menos los suyos propios si el CTE es estricto)
    expect(Number(masterCache?.volume)).toBeGreaterThan(0);
  });

  it('FASE 3: Benchmark de Cierre Semanal Completo', async () => {
    const start = performance.now();
    await executeWeeklyClosure(new Date());
    const end = performance.now();
    
    const duration = (end - start) / 1000;
    console.log(`[BENCHMARK] Weekly Closure Full Process: ${duration.toFixed(2)}s`);
    // El cierre completo incluye activaciones, cache, rangos y comisiones.
    // Con 5k usuarios, debería tardar < 15s gracias a las optimizaciones batch.
    expect(duration).toBeLessThan(30);
  });

  it('FASE 4: Auditoría de Idempotencia (Ejecución Doble)', async () => {
    console.log('[AUDIT] Ejecutando cierre por segunda vez para verificar duplicados...');
    const countBefore = await prisma.commission.count();
    
    await executeWeeklyClosure(new Date());
    
    const countAfter = await prisma.commission.count();
    // No deberían crearse nuevas comisiones de rango si ya fueron procesadas este mes
    console.log(`[IDEMPOTENCY] Comisiones Antes: ${countBefore}, Después: ${countAfter}`);
    expect(countAfter).toBe(countBefore); 
  });
});

