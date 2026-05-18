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

import * as client_v3 from './generated/client_v3';

type PrismaClient = client_v3.PrismaClient;
const PrismaClient = client_v3.PrismaClient;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
