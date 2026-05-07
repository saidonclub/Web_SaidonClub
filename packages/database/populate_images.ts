import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UNSPLASH_MAP: Record<string, string> = {
  // SERVICES
  'asesoria-financiera':         '1554224155-1696413575b3',
  'srv-contabilidad':            '1554224155-0af7e8c46ed1',
  'desarrollo-software':         '1555066931-4365d14bab8c',
  'srv-desarrollo-web':          '1547658719-da2b511691ee',
  'marketing-digital':           '1533750516457-a7f992034fec',
  'srv-marketing-digital':       '1460925895917-afdab827c52f',
  'consultoria-estrategica':     '1552664730-d307ca884978',
  'diseno-branding':             '1561070791-2526d30994b5',
  'srv-diseño-gráfico':          '1572044162444-ad60f128b582',
  'bienes-raices':               '1560518883-ce09059eeffa',
  'salud-medicina':              '1505751172177-51ad18601432',
  'medicina-general':            '1530499598303-0ad507b99327',
  'pediatria':                   '1584820927498-cdf52ee2fe39',
  'ginecologia':                 '1571772996211-2f02ed97a35c',
  'odontologia':                 '1606811841689-23dfddce3e95',
  'cardiologia':                 '1628348068343-c6a848d2b6dd',
  'dermatologia':                '1586771107445-d3ca888129ff',
  'oftalmologia':                '1551601651-2a8555f1a136',
  'nutricion':                   '1490817233623-f6a9c3358038',
  'psicologia':                  '1573415073024-55511d17f3cd',
  'fisioterapia':                '1544161515-41e7356ad895',
  'gastroenterologia':           '1579684388607-068a443fd204',
  'traumatologia':               '1519494091312-111711512b7d',
  'endocrinologia':              '1502740331572-87c3b4ff00e3',
  'neurologia':                  '1559757175-75b1d1d17be3',
  'otorrinolaringologia':        '1551008471-70d306884154',
  'educacion-capacitacion':      '1524178232047-4de09645f7a7',
  'eventos-experiencias':        '1511795409834-ef04bbd63105',
  'logistica-transporte':        '1586528116311-72ad303d7af7',
  'srv-plomería':                '1585704011311-c7162669abb0',
  'srv-electricidad':            '1621905252457-3e57c320662d',
  'srv-limpieza':                '1581578731548-c64695cc6958',
  'srv-arquitectura':            '1486416717534-1100f9a24554',
  'srv-asesoría-legal':          '1589829085830-19f85101f16a',
  'srv-consultoría-de-negocios': '1553729450-99d67d943248',
  'srv-salud':                   '1576067331814-0ce043d0429a',
  'salud-wellness':              '1511688612347-97d8bba07865',

  // PRODUCTS
  'tecnologia-innovacion':       '1519389950473-47ba0277781c',
  'tecnología-y-electrónica':    '1526733169351-519a17f41d44',
  'electronica':                 '1498049794561-7780e7231661',
  'estilo-vida-lujo':            '1548036328-c9fa89d128fa',
  'moda-exclusiva':              '1539109136881-3be0616acf4b',
  'moda':                        '1483985988308-59c956100ea7',
  'moda-y-accesorios':           '1558762224-05c0fd3f07a7',
  'accesorios-premium':          '1523275335640-df2b4440578b',
  'gastronomia-gourmet':         '1504674900247-0877df9cc836',
  'alimentos':                   '1547519962-63ef1996172d',
  'hogar-inteligente':           '1558002038-1055907df827',
  'hogar':                       '1484101405107-16670a941238',
  'hogar-y-cocina':              '1556910103-1c02747a8581',
  'herramientas-y-mejoras-del-hogar': '1581241858613-26241a7d0200',
  'salud-bienestar':             '1506126613402-121471f45675',
  'salud-y-belleza':             '1522333337-327ad934f01d',
  'deporte-aventura':            '1517836357463-d25dfeac3438',
  'deportes':                    '1534438327202-d93eb0b7a020',
  'deportes-y-fitness':          '1518319530507-684c441675bd',
  'mascotas':                    '1516734212186-a967f81ad0d7',
  'arte-coleccionables':          '1513519245086-46bd522c1930',
  'libros-educacion':            '1495440391672-d9b9d74b3b04',
  'viajes':                      '1500835597722-dc91e840d484',
  'juguetes-y-juegos':           '1558877385-bfdfaeabb550',
};

async function main() {
  console.log('--- POPULATING IMAGES (RAW SQL) ---');
  
  for (const [slug, id] of Object.entries(UNSPLASH_MAP)) {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`;
    
    // Update Services for this category
    await prisma.$executeRaw`
      UPDATE services 
      SET images = ARRAY[${url}]
      WHERE category_id IN (SELECT id FROM categories WHERE slug = ${slug})
    `;
    
    // Update Products for this category
    await prisma.$executeRaw`
      UPDATE products 
      SET images = ARRAY[${url}]
      WHERE category_id IN (SELECT id FROM categories WHERE slug = ${slug})
    `;
  }
  
  console.log('--- DONE! POPULATION COMPLETE ---');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
