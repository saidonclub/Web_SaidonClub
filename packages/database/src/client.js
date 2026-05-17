"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_v3_1 = require("./generated/client_v3");
console.log('[DEBUG] database/src/client.ts: PrismaClient is', typeof client_v3_1.PrismaClient);
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma || new client_v3_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
console.log('[DEBUG] database/src/client.ts: prisma instance is', typeof exports.prisma);
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
//# sourceMappingURL=client.js.map