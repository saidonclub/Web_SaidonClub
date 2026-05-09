import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@saidonclub/database';
import { executeWeeklyClosure } from '../closure';
import { refreshAllVolumesCache } from '../genealogy';

/**
 * TEST DE ESTRÉS OFENSIVO - MOTOR MLM
 * Valida: 
 * 1. Generación masiva de volúmenes (Recursive CTE)
 * 2. Cierre semanal por lotes (Batching)
 * 3. Integridad de comisiones bajo carga
 */
describe('MLM Engine Performance & Integrity Audit', () => {
  const PREFIX = 'audit_';
  const USER_COUNT = 1000; // Ajustable según necesidad

  beforeAll(async () => {
    console.log(`\n[AUDIT] Preparando entorno para ${USER_COUNT} usuarios...`);
    
    // 1. Limpiar auditorías previas
    await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });

    // 2. Crear un usuario raíz (Patrocinador Maestro)
    const master = await prisma.user.create({
      data: {
        email: `${PREFIX}master@saidonclub.com`,
        username: `${PREFIX}master`,
        role: 'PIONERO',
        firstName: 'Audit',
        lastName: 'Master',
        country: 'Colombia',
        city: 'Bogota',
      }
    });

    // 3. Generar árbol en lote (Distribuido)
    console.log(`[AUDIT] Inyectando ${USER_COUNT} usuarios en estructura de red...`);
    const usersData = [];
    for (let i = 1; i <= USER_COUNT; i++) {
      usersData.push({
        email: `${PREFIX}user${i}@saidonclub.com`,
        username: `${PREFIX}user${i}`,
        role: 'PIONERO',
        firstName: 'Audit',
        lastName: `User ${i}`,
        country: 'Colombia',
        city: 'Bogota',
        sponsorId: master.id, // Todos cuelgan del master para simplificar, o podemos crear jerarquías
      });
    }

    // Inserción masiva para ahorrar tiempo
    await prisma.user.createMany({ data: usersData });
    const allUsers = await prisma.user.findMany({ where: { email: { startsWith: PREFIX } } });

    // 4. Inyectar puntos para activar a todos
    console.log(`[AUDIT] Inyectando volumen de puntos masivo...`);
    const ledgerData = allUsers.map(u => ({
      userId: u.id,
      amount: 100, // 100 puntos cada uno
      type: 'PURCHASE' as any,
      description: 'Audit Load',
    }));
    await prisma.pointsLedger.createMany({ data: ledgerData });

    console.log(`[AUDIT] Entorno listo.\n`);
  }, 60000); // 1 minuto de timeout para setup

  afterAll(async () => {
    console.log(`\n[AUDIT] Limpiando rastros de auditoría...`);
    // Borrado en cascada (Prisma handle it)
    await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });
  });

  it('FASE 1: Benchmark de Recursive CTE (Volúmenes)', async () => {
    const start = performance.now();
    const now = new Date();
    await refreshAllVolumesCache(now.getMonth() + 1, now.getFullYear());
    const end = performance.now();
    
    const duration = (end - start);
    console.log(`[BENCHMARK] Refresh Volumen Cache: ${duration.toFixed(2)}ms`);
    
    expect(duration).toBeLessThan(5000); // Debe ser muy rápido gracias a SQL nativo
  });

  it('FASE 2: Benchmark de Cierre Semanal (Batch Processing)', async () => {
    const start = performance.now();
    await executeWeeklyClosure(new Date());
    const end = performance.now();
    
    const duration = (end - start) / 1000;
    console.log(`[BENCHMARK] Weekly Closure (${USER_COUNT} users): ${duration.toFixed(2)}s`);
    
    expect(duration).toBeLessThan(30); // 1000 usuarios deben procesarse en < 30s con el nuevo motor
  });

  it('FASE 3: Validación de Integridad Post-Cierre', async () => {
    const comisiones = await prisma.commission.count({
      where: { user: { email: { startsWith: PREFIX } } }
    });
    
    console.log(`[INTEGRITY] Comisiones generadas: ${comisiones}`);
    // Al menos el master y algunos usuarios deberían tener rango/comisión
    expect(comisiones).toBeGreaterThan(0);

    const volumes = await prisma.volumeCache.findMany({
      where: { userId: { not: '' } }, // Simplificado
      take: 10
    });
    expect(volumes.length).toBeGreaterThan(0);
  });
});
