import { PrismaClient } from '../src/generated/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function check() {
  const CATEGORY_ID = 'ea64a02a-3dca-4afd-845e-2d0cb2edefa7';
  const PROVIDER_ID = 'feb76b9a-10c6-43af-8871-10a2ac18d263';

  console.log('Checking Category ID:', CATEGORY_ID);
  const category = await prisma.category.findUnique({ where: { id: CATEGORY_ID } });
  console.log('Category found:', category ? category.name : 'NO');

  console.log('Checking Provider ID:', PROVIDER_ID);
  const provider = await prisma.user.findUnique({ where: { id: PROVIDER_ID } });
  console.log('Provider found:', provider ? provider.name : 'NO');
  
  if (!category || !provider) {
    console.log('\nWarning: IDs not found. Listing some available categories and users...');
    const someCategories = await prisma.category.findMany({ take: 5 });
    console.log('Available Categories:', someCategories.map(c => c.name));
    
    const someUsers = await prisma.user.findMany({ take: 5 });
    console.log('Available Users:', someUsers.map(u => u.name));
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
