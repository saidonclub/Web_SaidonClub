import { PrismaClient } from './src/generated/client_v2/index.js';
const p = new PrismaClient();
async function main() {
  const count = await p.product.count();
  console.log("Product count:", count);
  const products = await p.product.findMany({ take: 2 });
  console.log(products);
}
main().finally(() => p.$disconnect());
