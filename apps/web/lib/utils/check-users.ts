import { prisma } from '@/lib/prisma';
import { UserRole } from '@saidonclub/database';

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });

    const roles = ['SUPER_ADMIN', 'ADMIN', 'PROVIDER', 'ACCOUNTANT', 'PREFERENTE', 'PIONERO', 'CLIENT'];
    
    console.log('--- User Distribution by Role ---');
    roles.forEach(role => {
      const count = users.filter(u => u.role === (role as UserRole)).length;
      console.log(`${role}: ${count}`);
      if (count > 0) {
        const examples = users.filter(u => u.role === (role as UserRole)).slice(0, 2).map(u => `${u.name || 'No Name'} (${u.email})`);
        console.log(`  Examples: ${examples.join(', ')}`);
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

main();
