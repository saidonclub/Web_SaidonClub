import {
  PrismaClient,
  UserRole,
  CategoryType,
  ProductStatus,
  ServiceStatus,
} from "../src/generated/client_v2";
import { Decimal } from "../src/generated/client_v2/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando Seed Maestro PREMIUM - Optimizando SaidonClub Marketplace...");

  // 1. Limpieza Total (Reset para evitar duplicados y basura)
  console.log("🧹 Limpiando base de datos...");
  await prisma.product.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          "admin@saidonclub.com",
          "provider.uio@saidonclub.com",
          "provider.gye@saidonclub.com",
          "provider.cue@saidonclub.com",
          "provider.man@saidonclub.com",
          "provider.loja@saidonclub.com",
        ],
      },
    },
  });

  // 2. Geografía (Ecuador y Ciudades Principales)
  const country = await prisma.country.create({
    data: {
      name: "Ecuador",
      code: "EC",
      currency: "USD",
      phonePrefix: "+593",
    },
  });

  const cities = [
    { name: "Quito", code: "UIO" },
    { name: "Guayaquil", code: "GYE" },
    { name: "Cuenca", code: "CUE" },
    { name: "Manta", code: "MAN" },
    { name: "Ambato", code: "AMB" },
    { name: "Loja", code: "LOU" },
  ];

  const cityMap: Record<string, string> = {};
  for (const c of cities) {
    const createdCity = await prisma.city.create({
      data: {
        name: c.name,
        countryId: country.id,
      },
    });
    cityMap[c.name] = createdCity.id;
  }

  // 3. Proveedores Estratégicos (Localizados)
  const providers = [
    { name: "Saidon Tech Solutions", email: "provider.uio@saidonclub.com", city: "Quito" },
    { name: "Urban Style Imports", email: "provider.gye@saidonclub.com", city: "Guayaquil" },
    { name: "Hogar & Diseño Cuenca", email: "provider.cue@saidonclub.com", city: "Cuenca" },
    { name: "Outdoor Adventure Manta", email: "provider.man@saidonclub.com", city: "Manta" },
    { name: "Gourmet Selection Loja", email: "provider.loja@saidonclub.com", city: "Loja" },
  ];

  const providerMap: Record<string, string> = {};
  for (const p of providers) {
    const createdProvider = await prisma.user.create({
      data: {
        email: p.email,
        username: p.name.toLowerCase().replace(/\s/g, "_"),
        name: p.name,
        role: UserRole.PROVIDER,
        affiliateCode: `PROV-${p.city.substring(0, 3).toUpperCase()}`,
        cityId: cityMap[p.city],
      },
    });
    providerMap[p.name] = createdProvider.id;
  }

  // 4. Categorías Maestras (Alta Rotación en Ecuador)
  const categories = [
    { name: "Tecnología & Innovación", slug: "tecnologia-innovacion" },
    { name: "Moda & Calzado", slug: "moda-calzado" },
    { name: "Hogar & Electrodomésticos", slug: "hogar-electrodomesticos" },
    { name: "Salud & Cuidado Personal", slug: "salud-cuidado-personal" },
    { name: "Deporte & Aventura", slug: "deporte-aventura" },
    { name: "Relojería & Joyería", slug: "relojeria-joyeria" },
    { name: "Gastronomía Gourmet", slug: "gastronomia-gourmet" },
    { name: "Accesorios de Viaje", slug: "accesorios-viaje" },
    { name: "Arte & Coleccionables", slug: "arte-coleccionables" },
    { name: "Mascotas Premium", slug: "mascotas-premium" },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const createdCat = await prisma.category.create({
      data: {
        ...cat,
        type: CategoryType.PRODUCT,
      },
    });
    catMap[cat.slug] = createdCat.id;
  }

  // 5. Los 10 Productos Estrella (Uno por Categoría)
  const products = [
    {
      category: "tecnologia-innovacion",
      name: "Apple iPhone 15 Pro Max 256GB - Titanium Natural",
      description: "El smartphone más avanzado de Apple hasta la fecha. Fabricado en titanio de grado aeroespacial, con el chip A17 Pro que redefine el rendimiento. Cámara de 48MP con zoom óptico de 5x y pantalla Super Retina XDR de 6.7 pulgadas. El dispositivo definitivo para creadores y profesionales.",
      pricePVP: 1549,
      options: [
        { name: "Color", values: ["Titanio Natural", "Titanio Azul", "Titanio Negro", "Titanio Blanco"] },
        { name: "Capacidad", values: ["256GB", "512GB", "1TB"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1696446702183-bc156c257a02?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1696446701777-62629b35b64c?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=xqyUdNxWazA"],
      provider: "Saidon Tech Solutions",
      city: "Quito"
    },
    {
      category: "moda-calzado",
      name: "Nike Air Force 1 '07 Premium - Edición Clásica",
      description: "La leyenda sigue viva con las Nike Air Force 1 '07. Este calzado de básquetbol original le da un giro renovado a lo que mejor conoces: revestimientos con costuras duraderas, acabados impecables y la cantidad perfecta de destello para que brilles. Comodidad y estilo icónico para el día a día.",
      pricePVP: 145,
      options: [
        { name: "Talla (US)", values: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"] },
        { name: "Color", values: ["Blanco/Blanco", "Negro/Negro", "Blanco/Azul Retro"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=2-X-v00O2O0"],
      provider: "Urban Style Imports",
      city: "Guayaquil"
    },
    {
      category: "hogar-electrodomesticos",
      name: "Freidora de Aire Ninja Foodi 6-in-1 Dual Basket (8-Quart)",
      description: "Cocina dos alimentos de dos maneras diferentes y termina al mismo tiempo. Con 2 cestas independientes y tecnología DualZone, puedes freír, asar, hornear y deshidratar con hasta un 75% menos de grasa que los métodos tradicionales. Capacidad total de 8 cuartos.",
      pricePVP: 249,
      options: [
        { name: "Acabado", values: ["Acero Inoxidable", "Negro Mate", "Gris Antracita"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1632233033502-df49f05a96ca?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626074353841-8f5b40026e6d?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=9_b_kUvP_6A"],
      provider: "Hogar & Diseño Cuenca",
      city: "Cuenca"
    },
    {
      category: "salud-cuidado-personal",
      name: "Set Skincare La Roche-Posay Effaclar - Rutina Completa",
      description: "Kit dermatológico especializado para pieles grasas con tendencia acneica. Incluye: Gel Limpiador Purificante (200ml), Tónico Astringente Micro-Exfoliante (200ml) y Tratamiento Effaclar Duo+ (40ml). Reduce imperfecciones y previene su reaparición.",
      pricePVP: 85,
      options: [
        { name: "Tipo de Pack", values: ["Básico", "Avanzado (+Serum)", "Premium (+Protector Solar)"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=yY6mPq6a4wE"],
      provider: "Saidon Tech Solutions",
      city: "Quito"
    },
    {
      category: "deporte-aventura",
      name: "Garmin Fenix 7X Sapphire Solar - Smartwatch GPS",
      description: "El reloj multideporte definitivo con carga solar y lente de zafiro resistente a los arañazos. Mapas TopoActive, linterna LED integrada y autonomía de hasta 37 días. Ideal para triatlón, trail running, senderismo y exploración extrema.",
      pricePVP: 899,
      options: [
        { name: "Correa", values: ["Silicona Negra", "Titanio Ventilado", "Cuero Chestnut"] },
        { name: "Tamaño", values: ["42mm (S)", "47mm", "51mm (X)"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517430868273-09756fb3922c?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=qC5v6F_3w7w"],
      provider: "Outdoor Adventure Manta",
      city: "Manta"
    },
    {
      category: "relojeria-joyeria",
      name: "Rolex Submariner Date - Acero Oystersteel 41mm",
      description: "El reloj de buceo de referencia desde 1953. Este modelo presenta una esfera negra y un bisel Cerachrom giratorio unidireccional con disco de cerámica. Movimiento calibre 3235. Un símbolo de precisión y elegancia atemporal.",
      pricePVP: 12500,
      options: [
        { name: "Material", values: ["Acero Oystersteel", "Oro Amarillo y Acero", "Oro Blanco 18K"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=7uV890O7m_U"],
      provider: "Saidon Tech Solutions",
      city: "Quito"
    },
    {
      category: "gastronomia-gourmet",
      name: "Café de Especialidad Saidon Selection - Loja Edition",
      description: "Café de altura cultivado a 1.900 msnm en los valles de Loja, Ecuador. Nota de cata: Chocolate negro, cítricos dulces y cuerpo sedoso. Tostado artesanal en pequeños lotes para garantizar la máxima frescura. Calificación de 88 puntos SCA.",
      pricePVP: 22,
      options: [
        { name: "Molienda", values: ["Grano Entero", "Molienda Fina (Espresso)", "Molienda Media (Filtro)", "Molienda Gruesa (Prensa)"] },
        { name: "Peso", values: ["250g", "500g", "1000g"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=K35a5DIn_1g"],
      provider: "Gourmet Selection Loja",
      city: "Loja"
    },
    {
      category: "accesorios-viaje",
      name: "Maleta Rimowa Original Cabin - Aluminio Anodizado",
      description: "La maleta de aluminio más icónica del mundo. Reconocible al instante por sus distintivas ranuras, la Rimowa Original es uno de los diseños más influyentes de todos los tiempos. Fabricada en Colonia, Alemania, para durar toda la vida. Sistema Multiwheel® y cierres TSA.",
      pricePVP: 1150,
      options: [
        { name: "Color", values: ["Plata", "Negro", "Titanio"] },
        { name: "Tamaño", values: ["Cabin", "Check-In L", "Trunk Plus"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1572196377254-897493979601?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=680X_6GzV9I"],
      provider: "Urban Style Imports",
      city: "Guayaquil"
    },
    {
      category: "arte-coleccionables",
      name: "Set LEGO Icons - Titanic (9,090 Piezas)",
      description: "Uno de los modelos de LEGO más grandes y detallados jamás creados. Esta réplica a escala 1:200 captura la esencia del majestuoso trasatlántico. Incluye secciones transversales que revelan el comedor de primera clase y la icónica gran escalera. Un desafío de construcción único.",
      pricePVP: 799,
      options: [
        { name: "Edición", values: ["Estándar", "Con Kit de Luces LED (+ $99)"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513364776144-60967b0f80df?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1561149837-7756f71d5334?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=Fj-yI7f_P20"],
      provider: "Saidon Tech Solutions",
      city: "Quito"
    },
    {
      category: "mascotas-premium",
      name: "Localizador GPS Tractive para Perros - Versión LTE",
      description: "Mantén a tu mejor amigo seguro en todo momento. Seguimiento en tiempo real sin límite de distancia en más de 175 países. Define zonas seguras y recibe alertas en tu móvil si tu mascota sale de ellas. Resistente al agua y con 7 días de batería.",
      pricePVP: 55,
      options: [
        { name: "Color", values: ["Blanco", "Azul", "Café"] },
        { name: "Suscripción Incluida", values: ["Sin Suscripción", "1 Año Premium (+ $120)"] }
      ],
      images: [
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1000&auto=format&fit=crop"
      ],
      videos: ["https://www.youtube.com/watch?v=680X_6GzV9I"],
      provider: "Outdoor Adventure Manta",
      city: "Manta"
    }
  ];

  console.log(`📦 Creando ${products.length} productos premium...`);
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const pricePVP = p.pricePVP;
    const priceSaidon = pricePVP * 0.92; // 8% de descuento para socios
    const cost = priceSaidon * 0.75; // Margen del 25% para el club
    const margin = priceSaidon - cost;
    const points = pricePVP * 0.12; // 12% en puntos

    await prisma.product.create({
      data: {
        code: `SAID-PREM-${String(i + 1).padStart(3, "0")}`,
        name: p.name,
        description: p.description,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        pricePVP: new Decimal(pricePVP),
        priceSaidon: new Decimal(priceSaidon),
        pointsEarned: new Decimal(points),
        cost: new Decimal(cost),
        margin: new Decimal(margin),
        stock: 25 + Math.floor(Math.random() * 50),
        categoryId: catMap[p.category],
        providerId: providerMap[p.provider],
        cityId: cityMap[p.city],
        status: ProductStatus.APPROVED,
        isActive: true,
        images: p.images,
        videos: p.videos,
        options: p.options, // Campo JSON para variantes
      },
    });
  }

  // 6. Servicios de Alto Valor (Simplificados)
  console.log("🛠️ Generando servicios premium...");
  const premiumServices = [
    { name: "Asesoría Financiera & Patrimonial", slug: "asesoria-financiera", city: "Quito" },
    { name: "Consultoría de Negocios Digitales", slug: "marketing-digital", city: "Guayaquil" },
    { name: "Arquitectura & Diseño de Interiores", slug: "diseno-branding", city: "Cuenca" },
  ];

  for (const s of premiumServices) {
    const pricePVP = 250;
    const priceSaidon = 210;
    const points = 50;

    // Crear categoría de servicio si no existe (aunque ya limpiamos, por si acaso)
    const sCat = await prisma.category.upsert({
      where: { slug: s.slug },
      update: { name: s.name.split(' & ')[0] },
      create: { name: s.name.split(' & ')[0], slug: s.slug, type: CategoryType.SERVICE }
    });

    await prisma.service.create({
      data: {
        code: `SERV-PREM-${s.slug.toUpperCase()}`,
        name: s.name,
        description: `Servicio exclusivo para socios SaidonClub. ${s.name} con expertos certificados de primer nivel en ${s.city}. Maximiza tu potencial y protege tu futuro con nuestra red de confianza.`,
        slug: `service-${s.slug}`,
        pricePVP: new Decimal(pricePVP),
        priceSaidon: new Decimal(priceSaidon),
        pointsEarned: new Decimal(points),
        cost: new Decimal(priceSaidon * 0.6),
        categoryId: sCat.id,
        providerId: providerMap[providers.find(p => p.city === s.city)?.name || providers[0].name],
        cityId: cityMap[s.city],
        status: ServiceStatus.APPROVED,
        isActive: true,
        location: `Presencial ${s.city} / Online Global`,
        images: ["https://images.unsplash.com/photo-1454165833762-0204b28c6791?q=80&w=1000&auto=format&fit=crop"],
      },
    });
  }

  console.log("✅ Seed Maestro completado con éxito.");
  console.log(`📊 Catálogo final: ${products.length} productos premium y ${premiumServices.length} servicios exclusivos.`);
}

main()
  .catch((e) => {
    console.error("❌ Error en Seed Maestro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

