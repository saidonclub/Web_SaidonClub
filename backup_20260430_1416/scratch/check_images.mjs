import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const cats = await p.category.findMany({ where: { type: 'SERVICE' }, select: { name: true, slug: true } });
console.log('SERVICE CATEGORIES:', JSON.stringify(cats, null, 2));
const prodCats = await p.category.findMany({ where: { type: 'PRODUCT' }, select: { name: true, slug: true } });
console.log('PRODUCT CATEGORIES:', JSON.stringify(prodCats, null, 2));
await p['$disconnect']();
