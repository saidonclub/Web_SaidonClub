import { PrismaClient } from '../src/generated/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();


const DOCTORS = [
  'Dr. Carlos Mendoza', 'Dra. Ana Lucía Pérez', 'Dr. Roberto Velasco', 'Dra. Elena Santos',
  'Dr. Mauricio Garcés', 'Dra. Patricia Luna', 'Dr. Sergio Rojas', 'Dra. Mónica Torres',
  'Dr. Fernando Solís', 'Dra. Isabel Castillo', 'Dr. Gabriel Ruiz', 'Dra. Sofía Vaca',
  'Dr. Javier Ortiz', 'Dra. Lorena Paz', 'Dr. Ricardo León', 'Dra. Valentina Vega',
  'Dr. Alberto Morán', 'Dra. Gabriela Silva', 'Dr. Manuel Prado', 'Dra. Estefanía Loor'
];

const CATEGORY_ID = 'ea64a02a-3dca-4afd-845e-2d0cb2edefa7'; // Salud & Medicina
const PROVIDER_ID = 'feb76b9a-10c6-43af-8871-10a2ac18d263'; // Saidon Global Provider

const MEDICAL_CENTERS = [
  'Hospital Metropolitano', 'Clínica Kennedy', 'Hospital Solca', 'Clínica de la Mujer', 
  'Centro Médico AXXIS', 'Hospital Vozandes', 'Clínica Pasteur', 'Hospital San Francisco',
  'Centro de Especialidades SaidonHealth', 'Unidad Médica Especializada'
];

const SPECIALTIES = [
  { name: 'Cardiología Especializada', desc: 'Evaluación integral del sistema cardiovascular con tecnología de punta.' },
  { name: 'Pediatría Integral', desc: 'Cuidado experto para los más pequeños, desde recién nacidos hasta adolescentes.' },
  { name: 'Odontología Estética', desc: 'Diseño de sonrisa y salud oral con especialistas certificados.' },
  { name: 'Oftalmología Avanzada', desc: 'Cirugía láser y control de visión con equipos de última generación.' },
  { name: 'Traumatología y Deporte', desc: 'Rehabilitación y tratamiento de lesiones óseas y musculares.' },
  { name: 'Ginecología y Obstetricia', desc: 'Acompañamiento integral en todas las etapas de la mujer.' },
  { name: 'Nutrición Clínica', desc: 'Planes alimenticios personalizados basados en bioimpedancia.' },
  { name: 'Psicología y Bienestar', desc: 'Apoyo terapéutico profesional para tu salud mental.' },
  { name: 'Dermatología Médica', desc: 'Tratamiento avanzado para patologías de la piel y estética.' },
  { name: 'Gastroenterología', desc: 'Endoscopia y diagnóstico digestivo de alta precisión.' }
];

async function main() {
  console.log('Generating 100 professional medical services for SaidonClub...');
  
  const services = [];
  
  for (let i = 1; i <= 100; i++) {
    const specialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
    const doctor = DOCTORS[Math.floor(Math.random() * DOCTORS.length)];
    const center = MEDICAL_CENTERS[Math.floor(Math.random() * MEDICAL_CENTERS.length)];
    
    const pvp = Math.floor(Math.random() * (150 - 60) + 60);
    const discount = 0.15 + (Math.random() * 0.15); // 15% to 30%
    const saidon = Math.round(pvp * (1 - discount) * 100) / 100;
    const points = Math.floor(saidon * 0.6); 

    services.push({
      name: `${specialty.name} - ${center}`,
      slug: `servicio-medico-profesional-${i}`,
      description: `${specialty.desc} Atendido por el ${doctor} en las instalaciones de ${center}. Incluye consulta de 45 min, diagnóstico y seguimiento digital vía SaidonClub app.`,
      pricePVP: pvp,
      priceSaidon: saidon,
      pointsEarned: points,
      cost: Math.round(saidon * 0.80 * 100) / 100,
      tax: 0,
      commissionRate: 0.10,
      providerId: PROVIDER_ID,
      categoryId: CATEGORY_ID,
      isActive: true,
      images: [`https://images.unsplash.com/photo-${1576091160550 + (i % 50)}?q=80&w=800&auto=format&fit=crop`],
      location: `${center}, Quito - Ecuador`
    });
  }

  // Batch insert
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log('Successfully inserted 100 premium medical services.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
