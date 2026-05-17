// ============================================================
// MODULE:     database/src/client
// AGENT:      Supabase Architect
// PURPOSE:    Prisma Client singleton para queries complejas
//             que requieren joins, transacciones ACID, o
//             migraciones. Supabase es PostgreSQL, así que
//             Prisma funciona nativamente.
//
// NOTA: En Serverless (Vercel), usar connection pooling de
//       Supabase para evitar agotar conexiones.
// ============================================================

import { PrismaClient } from './generated/client_v3';

console.log('[DEBUG] database/src/client.ts: PrismaClient is', typeof PrismaClient);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

console.log('[DEBUG] database/src/client.ts: prisma instance is', typeof prisma);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
