import { PrismaClient } from './src/generated/client_v3/index.js';
const prisma = new PrismaClient();

async function main() {
  const serviceCategories = await prisma.category.findMany({ where: { type: 'SERVICE' } });
  if (serviceCategories.length === 0) {
    console.log("No service categories found.");
    return;
  }
  
  // Make sure we have a provider
  let provider = await prisma.providerProfile.findFirst();
  if (!provider) {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found to create a provider. Make sure at least one user exists.");
      return;
    }
    provider = await prisma.providerProfile.create({
      data: {
        userId: user.id,
        businessName: 'Servicios Profesionales Ecuador',
        verificationStatus: 'VERIFIED',
      }
    });
  }

  // Create 6 dummy services
  const images = [
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505751172107-573225a91703?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
  ];

  for (let i = 0; i < 6; i++) {
    const cat = serviceCategories[i % serviceCategories.length];
    
    // Check if it already exists by slug
    const existing = await prisma.service.findUnique({
      where: { slug: `servicio-profesional-${i+1}` }
    });
    
    if (!existing) {
      await prisma.service.create({
        data: {
          providerId: provider.userId,
          categoryId: cat.id,
          name: `Servicio Profesional ${i+1}`,
          slug: `servicio-profesional-${i+1}`,
          description: `Descripción del servicio ${i+1} ofrecido por expertos ecuatorianos.`,
          pricePVP: 60.00 + i * 10,
          priceSaidon: 50.00 + i * 10,
          cost: 30.00 + i * 5,
          tax: 0,
          pointsEarned: 10 + i * 2,
          images: [images[i]],
          status: 'APPROVED',
          isActive: true,
          location: 'Quito, Ecuador',
        }
      });
    }
  }
  console.log("Services seeded");
}
main().finally(() => prisma.$disconnect());
