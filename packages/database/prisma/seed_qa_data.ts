import { prisma, CategoryType, ServiceCategory, ProfessionCategory, UserRole, ServiceModality, ProductStatus } from '../src/index';

const randomString = () => Math.random().toString(36).substring(7);
const randomPrice = () => Math.floor(Math.random() * 900) + 10;


async function main() {
  console.log('🌱 Starting QA Data Seeding...');

  // 1. Create a mock Provider User
  const provider = await prisma.user.upsert({
    where: { email: 'qa-provider@saidonclub.com' },
    update: {},
    create: {
      email: 'qa-provider@saidonclub.com',
      username: 'qa-provider',
      name: 'QA Provider',
      role: UserRole.PROVIDER,
      phone: '+1234567890',
      status: 'ACTIVE',
      kycLevel: 3,
      affiliateCode: 'QA-PROV-123'
    }
  });

  // Create ServiceProvider Profile
  const serviceProvider = await prisma.serviceProvider.upsert({
    where: { userId: provider.id },
    update: {},
    create: {
      userId: provider.id,
      businessName: 'QA Mega Services',
      profession: 'QA Tester',
      professionCategory: ProfessionCategory.TECHNOLOGY,
      bio: 'Proveedor oficial para pruebas de calidad',
      phone: '+1234567890',
      email: 'qa-provider@saidonclub.com',
      city: 'Quito',
      address: 'Av. QA Principal 123',
      province: 'Pichincha',
      whatsapp: '+1234567890',
      averageRating: 5.0,
      totalReviews: 150
    }
  });

  // 2. Ensure Categories exist and have at least 6 items
  const productCategories = ['Electrónica', 'Hogar', 'Moda', 'Deportes'];
  
  for (const catName of productCategories) {
    const slug = catName.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const cat = await prisma.category.upsert({
      where: { slug: slug },
      update: {},
      create: {
        name: catName,
        slug: slug,
        type: CategoryType.PRODUCT,
        icon: 'Box'
      }
    });

    // Count existing products
    const existingProducts = await prisma.product.count({ where: { categoryId: cat.id } });
    
    if (existingProducts < 6) {
      console.log(`Adding ${6 - existingProducts} products to category ${catName}...`);
      for (let i = 0; i < (6 - existingProducts); i++) {
        await prisma.product.create({
          data: {
            name: `Producto QA ${randomString()}`,
            slug: `producto-qa-${randomString()}`,
            description: `Este es un producto generado para pruebas QA. Codigo: ${randomString()}`,
            pricePVP: randomPrice() + 50,
            priceSaidon: randomPrice() + 20,
            pointsEarned: 10,
            cost: 5,
            margin: 15,
            stock: 50,
            categoryId: cat.id,
            providerId: provider.id,
            images: [
              "https://picsum.photos/400/400"
            ],
            status: ProductStatus.ACTIVE
          }
        });
      }
    }
  }

  // 3. Ensure Service Categories have at least 6 services
  const serviceCategories = Object.values(ServiceCategory);
  
  for (const sCat of serviceCategories) {
    const existingServices = await prisma.serviceListing.count({ where: { category: sCat } });
    
    if (existingServices < 6) {
      console.log(`Adding ${6 - existingServices} services to category ${sCat}...`);
      for (let i = 0; i < (6 - existingServices); i++) {
        await prisma.serviceListing.create({
          data: {
            name: `Servicio QA - ${randomString()}`,
            description: `Servicio de prueba QA. Categoria: ${sCat}. ID: ${randomString()}`,
            publicPrice: randomPrice() + 50,
            memberPrice: randomPrice() + 20,
            internalPrice: randomPrice(),
            companyCommission: 10,
            commissionPercentage: 5,
            duration: 60,
            modality: 'VIRTUAL' as any,
            category: sCat,
            providerId: serviceProvider.id,
            isActive: true
          }
        });
      }
    }
  }

  console.log('✅ QA Data Seeding Completed! All categories have at least 6 items.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
