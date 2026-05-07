/**
 * seed_geo.ts — Datos geográficos reales para SaidonClub
 * Fuentes: INEC Ecuador, GeoNames, OpenStreetMap
 * Ejecutar: npx ts-node -e "require('./seed_geo.ts')"
 *   o: pnpm db:seed-geo
 */
import { PrismaClient } from '../src/generated/client';
const prisma = new PrismaClient();

// ─── ESTRUCTURA DE DATOS ────────────────────────────────────────────────────
type GeoCountry = {
  name: string; code: string; flag: string; currency: string; phonePrefix: string;
  provinces: { name: string; code: string; cities: string[] }[];
};

const GEO_DATA: GeoCountry[] = [
  // ══════════════════════════════════════════════════════════
  //  ECUADOR — Fuente: INEC Clasificador Geográfico 2024
  // ══════════════════════════════════════════════════════════
  {
    name: 'Ecuador', code: 'EC', flag: '🇪🇨', currency: 'USD', phonePrefix: '+593',
    provinces: [
      { name: 'Azuay',            code: 'AZ', cities: ['Cuenca','Gualaceo','Paute','Sigsig','Santa Isabel','Chordeleg','El Pan','Guachapala','Oña','Pucará','San Fernando','Sevilla de Oro'] },
      { name: 'Bolívar',          code: 'BO', cities: ['Guaranda','Chillanes','Chimbo','Echeandía','Las Naves','San Miguel'] },
      { name: 'Cañar',            code: 'CA', cities: ['Azogues','Biblián','Cañar','Déleg','El Tambo','La Troncal','Suscal'] },
      { name: 'Carchi',           code: 'CR', cities: ['Tulcán','Bolívar','Espejo','Mira','Montúfar','San Pedro de Huaca'] },
      { name: 'Chimborazo',       code: 'CH', cities: ['Riobamba','Alausi','Chambo','Chunchi','Colta','Cumandá','Guamote','Guano','Pallatanga','Penipe'] },
      { name: 'Cotopaxi',         code: 'CO', cities: ['Latacunga','La Maná','Pangua','Pujilí','Salcedo','Saquisilí','Sigchos'] },
      { name: 'El Oro',           code: 'EO', cities: ['Machala','Arenillas','Atahualpa','Balsas','Chilla','El Guabo','Huaquillas','Las Lajas','Marcabelí','Pasaje','Piñas','Portovelo','Santa Rosa','Zaruma'] },
      { name: 'Esmeraldas',       code: 'ES', cities: ['Esmeraldas','Atacames','Eloy Alfaro','La Concordia','Muisne','Quinindé','Rioverde','San Lorenzo'] },
      { name: 'Galápagos',        code: 'GA', cities: ['Puerto Baquerizo Moreno','Puerto Ayora','Puerto Villamil'] },
      { name: 'Guayas',           code: 'GU', cities: ['Guayaquil','Alfredo Baquerizo Moreno','Balao','Balzar','Colimes','Coronel Marcelino Maridueña','Daule','Durán','El Empalme','El Triunfo','General Antonio Elizalde','Isidro Ayora','Lomas de Sargentillo','Milagro','Naranjal','Naranjito','Nobol','Palestina','Pedro Carbo','Playas','Samborondón','San Jacinto de Yaguachi','Santa Lucía','Simón Bolívar'] },
      { name: 'Imbabura',         code: 'IM', cities: ['Ibarra','Antonio Ante','Cotacachi','Otavalo','Pimampiro','San Miguel de Urcuquí'] },
      { name: 'Loja',             code: 'LO', cities: ['Loja','Calvas','Catamayo','Celica','Chaguarpamba','Espíndola','Gonzanamá','Macará','Olmedo','Paltas','Pindal','Puyango','Quilanga','Saraguro','Sozoranga','Zapotillo'] },
      { name: 'Los Ríos',         code: 'LR', cities: ['Babahoyo','Baba','Buena Fe','Mocache','Montalvo','Palenque','Puebloviejo','Quevedo','Quinsaloma','Urdaneta','Valencia','Ventanas','Vinces'] },
      { name: 'Manabí',           code: 'MA', cities: ['Portoviejo','24 de Mayo','Bolívar','Chone','El Carmen','Flavio Alfaro','Jama','Jaramijó','Jipijapa','Junín','Manta','Montecristi','Olmedo','Paján','Pedernales','Pichincha','Puerto López','Rocafuerte','San Vicente','Santa Ana','Sucre','Tosagua'] },
      { name: 'Morona Santiago',  code: 'MS', cities: ['Macas','Gualaquiza','Huamboya','Limón Indanza','Logroño','Pablo Sexto','Palora','San Juan Bosco','Santiago','Sucúa','Taisha','Tiwintza'] },
      { name: 'Napo',             code: 'NA', cities: ['Tena','Archidona','Carlos Julio Arosemena Tola','El Chaco','Quijos'] },
      { name: 'Orellana',         code: 'OR', cities: ['Francisco de Orellana','Aguarico','La Joya de los Sachas','Loreto'] },
      { name: 'Pastaza',          code: 'PA', cities: ['Puyo','Arajuno','Mera','Santa Clara'] },
      { name: 'Pichincha',        code: 'PI', cities: ['Quito','Cayambe','Mejía','Pedro Moncayo','Pedro Vicente Maldonado','Puerto Quito','Rumiñahui','San Miguel de los Bancos'] },
      { name: 'Santa Elena',      code: 'SE', cities: ['Santa Elena','La Libertad','Salinas'] },
      { name: 'Santo Domingo de los Tsáchilas', code: 'SD', cities: ['Santo Domingo','La Concordia'] },
      { name: 'Sucumbíos',        code: 'SU', cities: ['Nueva Loja','Cascales','Cuyabeno','Gonzalo Pizarro','Lago Agrio','Putumayo','Shushufindi','Sucumbíos'] },
      { name: 'Tungurahua',       code: 'TU', cities: ['Ambato','Baños de Agua Santa','Cevallos','Mocha','Patate','Pelileo','Píllaro','Quero','Tisaleo'] },
      { name: 'Zamora Chinchipe', code: 'ZC', cities: ['Zamora','Centinela del Cóndor','Chinchipe','El Pangui','Nangaritza','Palanda','Paquisha','Yacuambi','Yantzaza'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  COLOMBIA — Fuente: DANE / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'Colombia', code: 'CO', flag: '🇨🇴', currency: 'COP', phonePrefix: '+57',
    provinces: [
      { name: 'Cundinamarca',     code: 'CUN', cities: ['Bogotá','Soacha','Zipaquirá','Facatativá','Chía','Fusagasugá','Cajicá','Girardot','Madrid','Mosquera'] },
      { name: 'Antioquia',        code: 'ANT', cities: ['Medellín','Bello','Itagüí','Envigado','Apartadó','Turbo','Rionegro','Sabaneta','Copacabana','Caldas'] },
      { name: 'Valle del Cauca',  code: 'VAC', cities: ['Cali','Buenaventura','Palmira','Tuluá','Buga','Cartago','Jamundí','Yumbo','Florida','Pradera'] },
      { name: 'Atlántico',        code: 'ATL', cities: ['Barranquilla','Soledad','Malambo','Sabanalarga','Baranoa','Galapa'] },
      { name: 'Bolívar',          code: 'BOL', cities: ['Cartagena','Magangué','El Carmen de Bolívar','Turbaco','Arjona'] },
      { name: 'Santander',        code: 'SAN', cities: ['Bucaramanga','Floridablanca','Girón','Piedecuesta','Barrancabermeja','Socorro','San Gil'] },
      { name: 'Córdoba',          code: 'COR', cities: ['Montería','Cereté','Lorica','Sahagún','Montelíbano','Planeta Rica'] },
      { name: 'Nariño',           code: 'NAR', cities: ['Pasto','Tumaco','Ipiales','Túquerres','La Unión'] },
      { name: 'Norte de Santander',code:'NSA', cities: ['Cúcuta','Ocaña','Pamplona','Villa del Rosario','Los Patios','Tibú'] },
      { name: 'Risaralda',        code: 'RIS', cities: ['Pereira','Dosquebradas','Santa Rosa de Cabal','La Virginia','Marsella'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  PERÚ — Fuente: INEI / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'Perú', code: 'PE', flag: '🇵🇪', currency: 'PEN', phonePrefix: '+51',
    provinces: [
      { name: 'Lima',             code: 'LIM', cities: ['Lima','Callao','San Juan de Lurigancho','San Martín de Porres','Ate','Comas','Villa El Salvador','San Juan de Miraflores','Los Olivos','Puente Piedra'] },
      { name: 'Arequipa',         code: 'ARE', cities: ['Arequipa','Cayma','Cerro Colorado','Socabaya','Paucarpata','Jacobo Hunter','Mariano Melgar','Miraflores','Alto Selva Alegre','Yanahuara'] },
      { name: 'La Libertad',      code: 'LAL', cities: ['Trujillo','Víctor Larco Herrera','El Porvenir','Florencia de Mora','La Esperanza','Huanchaco','Chepén','Pacasmayo'] },
      { name: 'Piura',            code: 'PIU', cities: ['Piura','Castilla','Sullana','Talara','Paita','Chulucanas','Morropón','Ayabaca'] },
      { name: 'Lambayeque',       code: 'LAM', cities: ['Chiclayo','Lambayeque','José Leonardo Ortiz','La Victoria','Ferreñafe','Monsefú'] },
      { name: 'Cusco',            code: 'CUS', cities: ['Cusco','San Jerónimo','San Sebastián','Santiago','Wanchaq','Sicuani','Quillabamba'] },
      { name: 'Junín',            code: 'JUN', cities: ['Huancayo','El Tambo','Chilca','Concepción','Satipo','La Oroya'] },
      { name: 'Ica',              code: 'ICA', cities: ['Ica','Chincha Alta','Pisco','Nasca','Palpa'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  VENEZUELA — Fuente: INE / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'Venezuela', code: 'VE', flag: '🇻🇪', currency: 'VES', phonePrefix: '+58',
    provinces: [
      { name: 'Distrito Capital', code: 'DC',  cities: ['Caracas'] },
      { name: 'Miranda',          code: 'MI',  cities: ['Guarenas','Guatire','Los Teques','Charallave','Ocumare del Tuy','San Antonio de los Altos','Cúa'] },
      { name: 'Carabobo',         code: 'CA',  cities: ['Valencia','Maracay','San Diego','Guacara','Los Guayos','Naguanagua','Puerto Cabello'] },
      { name: 'Zulia',            code: 'ZU',  cities: ['Maracaibo','Cabimas','Ciudad Ojeda','San Francisco','Machiques','La Villa del Rosario'] },
      { name: 'Lara',             code: 'LA',  cities: ['Barquisimeto','Cabudare','Carora','El Tocuyo','Quíbor'] },
      { name: 'Bolívar',          code: 'BO',  cities: ['Ciudad Bolívar','Ciudad Guayana','Upata','Tumeremo','El Callao'] },
      { name: 'Aragua',           code: 'AR',  cities: ['Maracay','Villa de Cura','La Victoria','El Limón','Cagua'] },
      { name: 'Anzoátegui',       code: 'AN',  cities: ['Barcelona','Puerto La Cruz','El Tigre','Anaco','Lecherías'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  ARGENTINA — Fuente: INDEC / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'Argentina', code: 'AR', flag: '🇦🇷', currency: 'ARS', phonePrefix: '+54',
    provinces: [
      { name: 'Buenos Aires',     code: 'BA',  cities: ['Buenos Aires','La Plata','Mar del Plata','Quilmes','Lanús','General San Martín','Lomas de Zamora','Morón','Almirante Brown','Tres de Febrero'] },
      { name: 'Córdoba',          code: 'CB',  cities: ['Córdoba','Villa María','Río Cuarto','San Francisco','Villa Carlos Paz','Alta Gracia','Río Tercero'] },
      { name: 'Santa Fe',         code: 'SF',  cities: ['Rosario','Santa Fe','Rafaela','Venado Tuerto','Santo Tomé','Reconquista','Villa Gobernador Gálvez'] },
      { name: 'Mendoza',          code: 'ME',  cities: ['Mendoza','San Rafael','Godoy Cruz','Guaymallén','Maipú','Las Heras','Luján de Cuyo'] },
      { name: 'Tucumán',          code: 'TU',  cities: ['San Miguel de Tucumán','Yerba Buena','Tafí Viejo','Banda del Río Salí','Alderetes','Aguilares'] },
      { name: 'Salta',            code: 'SA',  cities: ['Salta','Tartagal','Orán','General Güemes','Rosario de la Frontera'] },
      { name: 'Chaco',            code: 'CH',  cities: ['Resistencia','Presidencia Roque Sáenz Peña','Villa Ángela','Charata'] },
      { name: 'Entre Ríos',       code: 'ER',  cities: ['Paraná','Concordia','Gualeguaychú','Concepción del Uruguay','Colón'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  MÉXICO — Fuente: INEGI / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'México', code: 'MX', flag: '🇲🇽', currency: 'MXN', phonePrefix: '+52',
    provinces: [
      { name: 'Ciudad de México', code: 'CMX', cities: ['Ciudad de México','Iztapalapa','Gustavo A. Madero','Álvaro Obregón','Coyoacán','Xochimilco','Tlalpan','Miguel Hidalgo','Benito Juárez','Cuauhtémoc'] },
      { name: 'Estado de México', code: 'MEX', cities: ['Ecatepec de Morelos','Toluca','Nezahualcóyotl','Tlalnepantla','Chimalhuacán','Naucalpan','Tultitlán','Atizapán'] },
      { name: 'Jalisco',          code: 'JAL', cities: ['Guadalajara','Zapopan','Tlaquepaque','Tonalá','Puerto Vallarta','Lagos de Moreno','Tepatitlán'] },
      { name: 'Nuevo León',       code: 'NLE', cities: ['Monterrey','San Nicolás de los Garza','Guadalupe','Apodaca','General Escobedo','Juárez','Santa Catarina'] },
      { name: 'Puebla',           code: 'PUE', cities: ['Puebla','Tehuacán','San Andrés Cholula','Cuautlancingo','Atlixco','San Martín Texmelucan'] },
      { name: 'Guanajuato',       code: 'GTO', cities: ['León','Irapuato','Celaya','Salamanca','Guanajuato','San Luis de la Paz'] },
      { name: 'Veracruz',         code: 'VER', cities: ['Veracruz','Xalapa','Coatzacoalcos','Córdoba','Orizaba','Poza Rica'] },
      { name: 'Chihuahua',        code: 'CHH', cities: ['Chihuahua','Ciudad Juárez','Delicias','Cuauhtémoc','Parral'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  CHILE — Fuente: INE / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'Chile', code: 'CL', flag: '🇨🇱', currency: 'CLP', phonePrefix: '+56',
    provinces: [
      { name: 'Región Metropolitana', code: 'RM', cities: ['Santiago','Puente Alto','La Florida','Las Condes','Maipú','Ñuñoa','Providencia','Peñalolén','San Bernardo','Pudahuel'] },
      { name: 'Valparaíso',       code: 'VA',  cities: ['Valparaíso','Viña del Mar','Quilpué','San Antonio','Villa Alemana','Concón','Limache'] },
      { name: 'Biobío',           code: 'BI',  cities: ['Concepción','Talcahuano','Chillán','Los Ángeles','Coronel','San Pedro de la Paz'] },
      { name: 'Maule',            code: 'ML',  cities: ['Talca','Curicó','Linares','Constitución','Molina'] },
      { name: 'Antofagasta',      code: 'AN',  cities: ['Antofagasta','Calama','Tocopilla','Mejillones'] },
      { name: 'Araucanía',        code: 'AR',  cities: ['Temuco','Villarrica','Angol','Pucón','Victoria'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  BOLIVIA — Fuente: INE Bolivia / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'Bolivia', code: 'BO', flag: '🇧🇴', currency: 'BOB', phonePrefix: '+591',
    provinces: [
      { name: 'Santa Cruz',       code: 'SCZ', cities: ['Santa Cruz de la Sierra','Warnes','La Guardia','Montero','Cotoca','El Torno'] },
      { name: 'La Paz',           code: 'LPZ', cities: ['La Paz','El Alto','Viacha','Achacachi','Caranavi','Coroico'] },
      { name: 'Cochabamba',       code: 'CBB', cities: ['Cochabamba','Sacaba','Quillacollo','Colcapirhua','Tiquipaya','Vinto'] },
      { name: 'Oruro',            code: 'ORU', cities: ['Oruro','Challapata','Huanuni','Caracollo'] },
      { name: 'Potosí',           code: 'POT', cities: ['Potosí','Llallagua','Uyuni','Villazón','Tupiza'] },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  PANAMÁ — Fuente: INEC Panamá / GeoNames
  // ══════════════════════════════════════════════════════════
  {
    name: 'Panamá', code: 'PA', flag: '🇵🇦', currency: 'PAB', phonePrefix: '+507',
    provinces: [
      { name: 'Panamá',           code: 'PAN', cities: ['Ciudad de Panamá','San Miguelito','Tocumen','Juan Díaz','La Chorrera'] },
      { name: 'Colón',            code: 'COL', cities: ['Colón','La Pintada','Portobelo','Chagres'] },
      { name: 'Chiriquí',         code: 'CHI', cities: ['David','Boquete','Volcán','Bugaba','Barú'] },
      { name: 'Veraguas',         code: 'VER', cities: ['Santiago','La Palma','Soná','Calobre'] },
    ],
  },
];

// ─── MAIN SEED ──────────────────────────────────────────────────────────────
async function main() {
  console.log('🌍 Iniciando seed geográfico — SaidonClub OS (Fuentes: INEC, INEI, DANE, GeoNames)');
  let totalCountries = 0, totalProvinces = 0, totalCities = 0;

  for (const geo of GEO_DATA) {
    // 1. País
    const country = await prisma.country.upsert({
      where: { code: geo.code },
      update: { name: geo.name, flag: geo.flag, currency: geo.currency, phonePrefix: geo.phonePrefix, isActive: true },
      create:  { name: geo.name, code: geo.code, flag: geo.flag, currency: geo.currency, phonePrefix: geo.phonePrefix, isActive: true },
    });
    totalCountries++;
    console.log(`  🌎 ${geo.flag} ${geo.name}`);

    for (const prov of geo.provinces) {
      // 2. Provincia
      const province = await prisma.province.upsert({
        where: { code_countryId: { code: prov.code, countryId: country.id } },
        update: { name: prov.name, isActive: true },
        create: { name: prov.name, code: prov.code, countryId: country.id, isActive: true },
      });
      totalProvinces++;

      // 3. Ciudades / Cantones
      for (const cityName of prov.cities) {
        await prisma.city.upsert({
          where: { name_countryId: { name: cityName, countryId: country.id } },
          update: { provinceId: province.id, isActive: true },
          create: { name: cityName, countryId: country.id, provinceId: province.id, isActive: true },
        });
        totalCities++;
      }
      console.log(`    📍 ${prov.name}: ${prov.cities.length} ciudades/cantones`);
    }
  }

  console.log('\n✅ Seed geográfico completado:');
  console.log(`   🌍 Países:   ${totalCountries}`);
  console.log(`   🗺  Provincias: ${totalProvinces}`);
  console.log(`   🏙  Ciudades:  ${totalCities}`);
}

main()
  .catch((e) => { console.error('❌ Error en seed_geo:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
