const { PrismaClient } = require('./src/generated/client_v2');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.testimonial.count();
  if (count === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: 'María González',
          role: 'Miembro Pionero — Guayaquil',
          content: 'Las recompensas por invitar amigos y las compras inteligentes hicieron que SaidonClub cambie mi forma de ahorrar e interactuar.',
          imageUrl: 'https://i.pravatar.cc/150?img=5',
          avatar: 'MG',
        },
        {
          name: 'Carlos Rodríguez',
          role: 'Proveedor Verificado — Quito',
          content: 'Ofrezco mis servicios en el marketplace y además gano puntos por mis referidos. Es el modelo más inteligente en el que he participado.',
          imageUrl: 'https://i.pravatar.cc/150?img=11',
          avatar: 'CR',
        },
        {
          name: 'Ana Martínez',
          role: 'Miembro Preferente — Lima',
          content: 'Lo que más me convenció fue la transparencia. Cada recompensa se registra en tiempo real y puedo canjearla fácilmente.',
          imageUrl: 'https://i.pravatar.cc/150?img=9',
          avatar: 'AM',
        },
      ],
    });
    console.log('✅ Testimonials seeded OK');
  } else {
    console.log('ℹ️ Already have ' + count + ' testimonials — skipping seed');
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
