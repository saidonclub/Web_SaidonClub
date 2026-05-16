import { PrismaClient } from './src/generated/client_v3/index.js';

const prisma = new PrismaClient();

async function main() {
  const productCategories = [
    { name: 'Tecnología & Innovación', slug: 'tecnologia-innovacion' },
    { name: 'Moda & Calzado', slug: 'moda-calzado' },
    { name: 'Hogar & Electrodomésticos', slug: 'hogar-electrodomesticos' },
    { name: 'Salud & Cuidado Personal', slug: 'salud-cuidado-personal' },
    { name: 'Deporte & Aventura', slug: 'deporte-aventura' },
    { name: 'Relojería & Joyería', slug: 'relojeria-joyeria' },
    { name: 'Gastronomía Gourmet', slug: 'gastronomia-gourmet' },
    { name: 'Mascotas Premium', slug: 'mascotas-premium' },
  ];

  const serviceCategories = [
    { name: 'Asesoría Financiera', slug: 'servicio-asesoria-financiera' },
    { name: 'Transformación Digital', slug: 'servicio-transformacion-digital' },
    { name: 'Arquitectura & Diseño', slug: 'servicio-arquitectura-diseno' },
    { name: 'Educación & Capacitación', slug: 'servicio-educacion-capacitacion' },
    { name: 'Salud & Bienestar', slug: 'servicio-salud-bienestar' },
    { name: 'Asesoría Legal', slug: 'servicio-asesoria-legal' },
    { name: 'Turismo & Experiencias', slug: 'servicio-turismo-experiencias' },
    { name: 'Mantenimiento del Hogar', slug: 'servicio-mantenimiento-hogar' },
  ];

  for (const cat of productCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug, type: 'PRODUCT' },
    });
  }

  for (const cat of serviceCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug, type: 'SERVICE' },
    });
  }
  console.log("Categories updated");
}
main().finally(() => prisma.$disconnect());
