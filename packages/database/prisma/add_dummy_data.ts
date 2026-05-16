import { prisma } from '../src/client';

async function main() {
  console.log('🌱 Creando datos ficticios para categorías...');

  const productCategories = [
    { name: 'Electrónica', slug: 'electronica' },
    { name: 'Tecnología', slug: 'tecnologia' },
    { name: 'Hogar', slug: 'hogar' },
    { name: 'Belleza', slug: 'belleza' },
    { name: 'Automotriz', slug: 'automotriz' },
    { name: 'Deportes', slug: 'deportes' },
    { name: 'Gaming', slug: 'gaming' },
    { name: 'Mascotas', slug: 'mascotas' },
    { name: 'Moda', slug: 'moda' },
    { name: 'Calzado', slug: 'calzado' },
    { name: 'Juguetes', slug: 'juguetes' },
    { name: 'Ferretería', slug: 'ferreteria' },
    { name: 'Papelería', slug: 'papeleria' },
    { name: 'Herramientas', slug: 'herramientas' },
    { name: 'Móviles', slug: 'moviles' },
  ];

  const serviceCategories = [
    { name: 'Tech & Dev', slug: 'tech' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Salud', slug: 'salud' },
    { name: 'Legal', slug: 'legal' },
    { name: 'Consultoría', slug: 'consultoria' },
    { name: 'Educación', slug: 'educacion' },
    { name: 'Reparaciones', slug: 'reparaciones' },
    { name: 'Logística', slug: 'logistica' },
    { name: 'Diseño', slug: 'diseno' },
    { name: 'Construcción', slug: 'construccion' },
    { name: 'Inmobiliaria', slug: 'inmobiliaria' },
    { name: 'Eventos', slug: 'eventos' },
    { name: 'Servicios Profesionales', slug: 'profesionales' },
    { name: 'Viajes', slug: 'viajes' },
  ];

  // Crear usuario admin/proveedor si no existe
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'testprovider@saidonclub.com',
        firstName: 'Test',
        lastName: 'Provider',
        phone: '0999999999',
        documentId: '0999999999',
        username: 'testprovider',
      }
    });
  }

  let provider = await prisma.providerProfile.findFirst({ where: { userId: user.id } });
  if (!provider) {
    provider = await prisma.providerProfile.create({
      data: {
        userId: user.id,
        companyName: 'Empresa Ficticia S.A.',
      }
    });
  }

  let city = await prisma.city.findFirst();
  if (!city) {
    // Need a country first
    let country = await prisma.country.findFirst();
    if (!country) {
      country = await prisma.country.create({
        data: {
          name: 'Ecuador',
          code: 'EC',
          phonePrefix: '+593',
        }
      });
    }
    
    let province = await prisma.province.findFirst({ where: { countryId: country.id } });
    if (!province) {
      province = await prisma.province.create({
        data: {
          name: 'Guayas',
          countryId: country.id,
        }
      });
    }

    city = await prisma.city.create({
      data: {
        name: 'Guayaquil',
        countryId: country.id,
        provinceId: province.id,
        isActive: true,
      }
    });
  }

  // Productos
  for (const cat of productCategories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, type: 'PRODUCT', isActive: true }
    });

    const exists = await prisma.product.findFirst({ where: { categoryId: category.id } });
    if (!exists) {
      await prisma.product.create({
        data: {
          name: `Producto de ${cat.name}`,
          slug: `producto-${cat.slug}-${Date.now()}`,
          description: `Este es un excelente producto en la categoría de ${cat.name}`,
          pricePVP: 50.00,
          priceSaidon: 40.00,
          pointsEarned: 4.00,
          cost: 30.00,
          margin: 10.00,
          stock: 10,
          isActive: true,
          status: 'ACTIVE',
          categoryId: category.id,
          providerId: user.id,
          cityId: city.id,
        }
      });
    }
  }

  // Servicios
  for (const cat of serviceCategories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, type: 'SERVICE', isActive: true }
    });

    const exists = await prisma.service.findFirst({ where: { categoryId: category.id } });
    if (!exists) {
      await prisma.service.create({
        data: {
          name: `Servicio de ${cat.name}`,
          slug: `servicio-${cat.slug}-${Date.now()}`,
          description: `Este es un excelente servicio en la categoría de ${cat.name}`,
          pricePVP: 100.00,
          priceSaidon: 85.00,
          pointsEarned: 8.50,
          cost: 60.00,
          isActive: true,
          status: 'APPROVED',
          categoryId: category.id,
          providerId: user.id,
          cityId: city.id,
        }
      });
    }
  }

  console.log('✅ Categorías y productos/servicios creados exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
