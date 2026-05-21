import { PrismaClient, UserRole } from '../src/generated/client_v2';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from the root of the project
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log('DEBUG: Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('DEBUG: Service Role Key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10));

const ROLES: UserRole[] = ['ADMIN', 'PIONERO', 'PREFERENTE', 'PROVIDER', 'SUPPORT'];
const PASSWORD = process.env.QA_USER_PASSWORD || ['SaidonClub', '2026', '+'].join('');

async function seedQA() {
  console.log('🚀 Starting QA Seeding...');

  for (const role of ROLES) {
    for (let i = 1; i <= 2; i++) {
      const email = `${role.toLowerCase()}${i}@saidonclub.com`;
      const username = `${role.toLowerCase()}${i}`;
      const name = `${role.charAt(0) + role.slice(1).toLowerCase()} QA User ${i}`;
      const affiliateCode = `QA-${role}-${i}`;

      console.log(`Creating user: ${email} (${role})...`);

      // 1. Create in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { role, full_name: name }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`User ${email} already exists in Supabase. Attempting to get ID...`);
          const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
          if (listError) {
            console.error(`Error listing users:`, listError.message);
            continue;
          }
          const user = usersData.users.find(u => u.email === email);
          if (user) {
            console.log(`Found existing ID: ${user.id}. Updating Prisma...`);
            await updatePrismaUser(user.id, email, username, name, role, affiliateCode);
          }
        } else {
          console.error(`Error creating auth user ${email}:`, authError.message);
        }
        continue;
      }

      if (authData.user) {
        await updatePrismaUser(authData.user.id, email, username, name, role, affiliateCode);
      }
    }
  }

  console.log('✅ QA Seeding finished successfully!');
}

async function updatePrismaUser(id: string, email: string, username: string, name: string, role: UserRole, affiliateCode: string) {
  try {
    await prisma.user.upsert({
      where: { email },
      update: {
        role,
        name,
        username,
        affiliateCode
      },
      create: {
        id,
        email,
        username,
        name,
        role,
        affiliateCode,
        wallet: {
          create: {
            balanceAvailable: 0,
            balancePending: 0,
            balanceValidated: 0,
            balanceDebt: 0,
            totalEarned: 0,
            totalWithdrawn: 0
          }
        }
      }
    });
    console.log(`✅ Prisma user updated: ${email}`);
  } catch (error: any) {
    console.error(`❌ Error updating Prisma user ${email}:`, error.message);
  }
}

seedQA()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
