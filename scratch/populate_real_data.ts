import { prisma } from './packages/database/src';

const productData: Record<string, { names: string[], images: string[] }> = {
  'tecnologia-innovacion': {
    names: [
      'Apple iPhone 15 Pro Max 256GB - Titanium Natural',
      'Samsung Galaxy S24 Ultra 512GB - Titanium Gray',
      'MacBook Pro 14" M3 Max Chip - 36GB RAM, 1TB SSD',
      'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      'iPad Pro 12.9" M2 Chip - Liquid Retina XDR Display',
      'Asus ROG Zephyrus G14 Gaming Laptop - RTX 4090',
      'Logitech MX Master 3S Wireless Mouse - Graphite',
      'DJI Mini 4 Pro Drone - 4K HDR Camera',
      'GoPro HERO12 Black - Action Camera with Accessories',
      'Kindle Paperwhite (16 GB) - 6.8" Display'
    ],
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594980596271-e331883a47b3?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  'estilo-vida-lujo': {
    names: [
      'Reloj Rolex Submariner Date - Cerachrom Negra',
      'Bolso Louis Vuitton Neverfull MM - Monogram',
      'Cinturón Gucci con Doble G - Cuero Negro',
      'Gafas de Sol Ray-Ban Aviator Classic',
      'Perfume Chanel No. 5 - Eau de Parfum 100ml',
      'Maleta Rimowa Original Cabin - Aluminio',
      'Pluma Estilográfica Montblanc Meisterstück',
      'Billetera Prada Saffiano - Cuero Azul Marino',
      'Zapatos Christian Louboutin Pigalle - Charol',
      'Pañuelo de Seda Hermès - Edición Especial'
    ],
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917663903-b93240ff83c2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585336261022-69c66d160f8c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  'salud-bienestar': {
    names: [
      'Matur de Yoga Lululemon 5mm - Reversible',
      'Pistola de Masaje Theragun PRO - 4ta Generación',
      'Batido de Proteína Whey Gold Standard 5lb',
      'Difusor de Aceites Esenciales Ultrasónico',
      'Smartwatch Fitbit Charge 6 - Tracker Avanzado',
      'Set de Bandas de Resistencia - 5 Niveles',
      'Purificador de Aire Dyson Purifier Cool',
      'Botella de Agua Inteligente HidrateSpark PRO',
      'Kit de Meditación con Cojín Ergonómico',
      'Suplemento de Multivitaminas Garden of Life'
    ],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593095191850-2a0b3da0a5eb?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585338927000-1c787b17eb5e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523362628744-4c2f3727b14c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550572017-ed20bb7f6361?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  'hogar-inteligente': {
    names: [
      'Robot Aspiradora Roborock S8 Pro Ultra',
      'Cerradura Inteligente August Wi-Fi Smart Lock',
      'Termostato Google Nest Learning (3ra Gen)',
      'Bombillas Inteligentes Philips Hue Starter Kit',
      'Pantalla Amazon Echo Show 15 - Full HD 15.6"',
      'Timbre con Cámara Ring Video Doorbell Pro 2',
      'Enchufe Inteligente TP-Link Kasa (Set de 4)',
      'Cámara de Seguridad Arlo Pro 5S 2K Wireless',
      'Sistema Wi-Fi 6 en Malla TP-Link Deco XE75',
      'Cafetera Inteligente Nespresso Vertuo Next'
    ],
    images: [
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550524514-9636edba3118?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554460300-914266a7f51d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551893086-c0411bd196ad?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512428559083-a4979b2b91ef?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  'moda-exclusiva': {
    names: [
      'Chaqueta de Cuero Genuino - Estilo Biker Premium',
      'Vestido de Noche en Seda - Colección Primavera',
      'Jeans Levi\'s 501 Original Fit - Denim Blue',
      'Camisa de Lino Italiana - Corte Slim Fit',
      'Zapatos Oxford en Cuero Hechos a Mano',
      'Suéter de Cachemira 100% - Gris Melange',
      'Abrigo de Lana Virgen - Corte Estructurado',
      'Pantalones Chinos de Algodón Pima - Beige',
      'Blusa de Gasa con Estampado Floral',
      'Falda Plisada Midi - Textura Satinada'
    ],
    images: [
      'https://images.unsplash.com/photo-1551028711-0305df2a9b39?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539533113208-f6df8140ae69?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583846714867-52c373e79498?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  'gastronomia-gourmet': {
    names: [
      'Aceite de Oliva Extra Virgen - Reserva Familiar',
      'Set de Cuchillos Japoneses en Acero de Damasco',
      'Café de Especialidad en Grano - Origen Etiopía',
      'Vino Tinto Gran Reserva - Edición Limitada',
      'Chocolate Artesanal 85% Cacao - Con Sal de Mar',
      'Kit de Mixología Profesional - 12 Piezas',
      'Miel Orgánica de Bosque Nativo - 500g',
      'Queso Manchego Curado 12 Meses - D.O.P.',
      'Jamón Ibérico de Bellota - 100% Raza Pura',
      'Pasta Artesanal Italiana - Corte de Bronce'
    ],
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbad8a0f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486297678162-ad2a19b05840?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627662236973-4fd8358fa206?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  'deporte-aventura': {
    names: [
      'Bicicleta de Montaña Carbono - 29" Enduro',
      'Mochila de Trekking 65L - Impermeable Pro',
      'Reloj Garmin Fenix 7X - GPS Multideporte',
      'Zapatillas de Trail Running - Grip Agresivo',
      'Carpa de Alta Montaña - 4 Estaciones',
      'Pala de Pádel de Alta Gama - Control & Potencia',
      'Set de Pesas Ajustables - Hasta 40kg',
      'Gafas de Esquí con Lente Fotocromática',
      'Cuerda de Escalada Dinámica - 60m 9.8mm',
      'Saco de Dormir Pluma de Ganso - -10°C'
    ],
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551632432-c735e8299291?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626225967045-97a0bc3a1213?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1638536532686-d614adbc856c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1fed5d96559e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515444744559-7be63e1600de?q=80&w=1000&auto=format&fit=crop'
    ]
  }
};

async function main() {
  console.log('🔄 Actualizando productos con nombres e imágenes realistas...');

  const products = await prisma.product.findMany({
    include: { category: true }
  });

  for (const product of products) {
    const slug = product.category.slug;
    const data = productData[slug];

    if (data) {
      const index = Math.floor(Math.random() * data.names.length);
      const newName = data.names[index];
      const newImage = data.images[index];

      await prisma.product.update({
        where: { id: product.id },
        data: {
          name: newName,
          images: [newImage],
          description: `El mejor ${newName} disponible exclusivamente en SaidonClub. Calidad premium garantizada.`
        }
      });
    } else {
      // Fallback for other categories
      await prisma.product.update({
        where: { id: product.id },
        data: {
          name: `${product.category.name} Premium Pro`,
          images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
          description: `Un producto excepcional de la categoría ${product.category.name}. Diseñado para superar tus expectativas.`
        }
      });
    }
  }

  // Also fix services
  console.log('🔄 Actualizando servicios...');
  const services = await prisma.service.findMany({
    include: { category: true }
  });

  for (const service of services) {
    await prisma.service.update({
      where: { id: service.id },
      data: {
        name: `${service.category.name} Especializado`,
        images: ['https://images.unsplash.com/photo-1454165833762-0204b28c6791?q=80&w=1000&auto=format&fit=crop'],
        description: `Consultoría y ejecución profesional en ${service.category.name}. Resultados garantizados por SaidonClub.`
      }
    });
  }

  console.log('✅ Base de datos actualizada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
