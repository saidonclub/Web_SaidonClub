/**
 * MLM Engine - Stress & Idempotency Audit (Standalone)
 *
 * Ejecutar con:
 *   pnpm test:stress
 *
 * Usa tsx directamente (no Vitest) para evitar incompatibilidades de
 * Node 24 + Vitest v1 con el binario nativo de Prisma (.node).
 */

import { prisma } from '../packages/database/src/client';
import { executeWeeklyClosure } from '../packages/mlm-engine/src/closure';
import { refreshAllVolumesCache } from '../packages/mlm-engine/src/genealogy';
import { performance } from 'perf_hooks';

// ─────────────────────────────────────────
// Helpers de reporte
// ─────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS  ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function section(title: string) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
}

// ─────────────────────────────────────────
// Main
// ─────────────────────────────────────────
async function main() {
  const PREFIX    = 'stress_';
  const USER_COUNT = 500;
  let allUserIds: string[] = [];

  section('SETUP — Entorno masivo');
  console.log(`[AUDIT] Preparando ${USER_COUNT} usuarios de prueba...`);

  try {
    // ── Limpieza ──────────────────────────────────────────────────
    console.log('[AUDIT] Limpiando corridas anteriores...');
    await prisma.commission.deleteMany({
      where: { orderId: { startsWith: 'RANK-' } },
    });
    await prisma.rank.deleteMany({
      where: { user: { email: { startsWith: PREFIX } } },
    });
    await prisma.pointsLedger.deleteMany({
      where: { user: { email: { startsWith: PREFIX } } },
    });
    await prisma.volumeCache.deleteMany({
      where: { cycleMonth: new Date().getMonth() + 1 },
    });
    await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });

    // ── 1. Usuario Maestro ────────────────────────────────────────
    const master = await prisma.user.create({
      data: {
        email:         `${PREFIX}master@saidonclub.com`,
        username:      `${PREFIX}master`,
        role:          'PIONERO',
        affiliateCode: 'MASTER_AUDIT',
      },
    });
    allUserIds.push(master.id);

    // ── 2. Red profunda (árbol balanceado ~3 hijos/nodo) ──────────
    console.log(`[AUDIT] Inyectando ${USER_COUNT} usuarios en la red...`);
    const batchSize = 500;

    for (let i = 0; i < USER_COUNT; i += batchSize) {
      const currentBatchCount = Math.min(batchSize, USER_COUNT - i);
      const batchData: any[] = [];

      for (let j = 0; j < currentBatchCount; j++) {
        const userIndex = i + j;
        const sponsorId =
          allUserIds[Math.floor(Math.random() * allUserIds.length)];

        batchData.push({
          email:         `${PREFIX}user${userIndex}@saidonclub.com`,
          username:      `${PREFIX}user${userIndex}`,
          role:          'PIONERO',
          sponsorId,
          affiliateCode: `AFF_${userIndex}`,
        });
      }

      await prisma.user.createMany({ data: batchData });
      const created = await prisma.user.findMany({
        where:  { email: { startsWith: PREFIX }, id: { notIn: allUserIds } },
        select: { id: true },
      });
      allUserIds.push(...created.map((u) => u.id));
      console.log(`  - Red: ${allUserIds.length} / ${USER_COUNT + 1}`);
    }

    // ── 3. Volumen masivo ─────────────────────────────────────────
    console.log(`[AUDIT] Inyectando 10,000 registros de puntos...`);
    const ledgerData: any[] = [];
    for (let k = 0; k < 10000; k++) {
      ledgerData.push({
        userId:     allUserIds[Math.floor(Math.random() * allUserIds.length)],
        amount:     Math.random() * 200 + 10,
        sourceType: 'MARKETPLACE',
        cycleMonth: new Date().getMonth() + 1,
        cycleYear:  new Date().getFullYear(),
        description: 'Stress Load',
      });
    }
    await prisma.pointsLedger.createMany({ data: ledgerData });
    console.log('[AUDIT] Entorno listo.\n');

    // ─────────────────────────────────────────────────────────────
    // FASE 1: Benchmark CTE Recursivo
    // ─────────────────────────────────────────────────────────────
    section('FASE 1 — Benchmark Volumen Cache (Recursive CTE)');
    const t1Start = performance.now();
    const now     = new Date();
    await refreshAllVolumesCache(now.getMonth() + 1, now.getFullYear());
    const t1ms = performance.now() - t1Start;

    console.log(
      `[BENCHMARK] refreshAllVolumesCache (${USER_COUNT} users): ${t1ms.toFixed(0)}ms`
    );
    assert(t1ms < 5000, 'CTE refresh < 5 s', `actual: ${t1ms.toFixed(0)}ms`);

    // ─────────────────────────────────────────────────────────────
    // FASE 2: Integridad de Volumen
    // ─────────────────────────────────────────────────────────────
    section('FASE 2 — Integridad del Cálculo de Volumen');
    const m           = now.getMonth() + 1;
    const y           = now.getFullYear();
    const masterCache = await prisma.volumeCache.findFirst({
      where: { userId: allUserIds[0], cycleMonth: m, cycleYear: y },
    });
    const totalPoints = await prisma.pointsLedger.aggregate({
      where: { cycleMonth: m, cycleYear: y },
      _sum:  { amount: true },
    });

    console.log(`[INTEGRITY] Volumen del Master: ${masterCache?.volume}`);
    console.log(`[INTEGRITY] Total puntos global: ${totalPoints._sum.amount}`);
    assert(
      Number(masterCache?.volume) > 0,
      'El volumen del Master debe ser > 0'
    );

    // ─────────────────────────────────────────────────────────────
    // FASE 3: Benchmark del Cierre Semanal
    // ─────────────────────────────────────────────────────────────
    section('FASE 3 — Benchmark Cierre Semanal Completo');
    const t3Start = performance.now();
    await executeWeeklyClosure(new Date());
    const t3s = (performance.now() - t3Start) / 1000;

    console.log(`[BENCHMARK] Cierre completo (${USER_COUNT} users): ${t3s.toFixed(2)}s`);
    assert(t3s < 60, 'Cierre semanal < 60 s', `actual: ${t3s.toFixed(2)}s`);

    // ─────────────────────────────────────────────────────────────
    // FASE 4: Idempotencia — doble ejecución
    // ─────────────────────────────────────────────────────────────
    section('FASE 4 — Auditoría de Idempotencia (Doble Ejecución)');
    console.log('[AUDIT] Ejecutando segundo cierre para verificar duplicados...');

    const commBefore = await prisma.commission.count();
    const rankBefore  = await prisma.rank.count();

    await executeWeeklyClosure(new Date());

    const commAfter  = await prisma.commission.count();
    const rankAfter   = await prisma.rank.count();

    console.log(
      `[IDEMPOTENCY] Comisiones → antes: ${commBefore}  después: ${commAfter}`
    );
    console.log(
      `[IDEMPOTENCY] Rangos      → antes: ${rankBefore}   después: ${rankAfter}`
    );

    assert(
      commAfter === commBefore,
      'Sin comisiones duplicadas en segunda ejecución',
      `antes=${commBefore} después=${commAfter}`
    );
    assert(
      rankAfter === rankBefore,
      'Sin rangos duplicados en segunda ejecución',
      `antes=${rankBefore} después=${rankAfter}`
    );

  } catch (err) {
    console.error('\n[AUDIT] ERROR FATAL:', err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  // ─────────────────────────────────────────
  // Resultado final
  // ─────────────────────────────────────────
  section('RESULTADO FINAL');
  console.log(`  Pasadas: ${passed}  |  Fallidas: ${failed}`);
  if (failed > 0) {
    console.error('\n  ⚠️  AUDITORÍA FALLIDA — revisar errores arriba.\n');
    process.exit(1);
  } else {
    console.log('\n  🎉 AUDITORÍA COMPLETADA — Motor MLM verificado.\n');
    process.exit(0);
  }
}

main();
