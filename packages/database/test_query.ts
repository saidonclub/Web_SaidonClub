import { PrismaClient } from './src/generated/client_v3';

const prisma = new PrismaClient();

async function main() {
  console.log("Checking table statistics...");
  
  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();
  const membershipCount = await prisma.membership.count();
  const activationCount = await prisma.activationStatus.count();
  
  console.log({
    users: userCount,
    orders: orderCount,
    memberships: membershipCount,
    activations: activationCount
  });

  if (orderCount > 0) {
    const sampleOrders = await prisma.order.findMany({ take: 5 });
    console.log("Sample orders:", sampleOrders);
  } else {
    console.log("No orders found in the database!");
  }

  if (membershipCount > 0) {
    const sampleMemberships = await prisma.membership.findMany({ take: 5 });
    console.log("Sample memberships:", sampleMemberships);
  } else {
    console.log("No memberships found in the database!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
