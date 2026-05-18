import { PrismaClient } from '../src/generated/client_v3';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from workspace root
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('════════════════════════════════════════════════════════════');
  console.log('  MIGRACIÓN: Agregando PROCESSING a ClosureStatus Enum      ');
  console.log('════════════════════════════════════════════════════════════');
  
  try {
    // Check if DIRECT_URL is present
    console.log('[INFO] DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIRMADO' : 'NO CONFIGURADO');
    console.log('[INFO] DIRECT_URL:', process.env.DIRECT_URL ? 'CONFIRMADO' : 'NO CONFIGURADO');
    
    console.log('[INFO] Intentando alterar el enum ClosureStatus...');
    
    // We run the raw query to alter type. We wrap it to handle if it already exists gracefully.
    await prisma.$executeRawUnsafe(`ALTER TYPE "public"."ClosureStatus" ADD VALUE 'PROCESSING';`)
      .then(() => {
        console.log('[ÉXITO] El valor "PROCESSING" fue agregado exitosamente al enum ClosureStatus.');
      })
      .catch((err: any) => {
        if (err.message && err.message.includes('already exists')) {
          console.log('[Aviso] El valor "PROCESSING" ya existía en el enum.');
        } else {
          throw err;
        }
      });
      
  } catch (error) {
    console.error('[ERROR] Error al modificar el enum en la base de datos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('════════════════════════════════════════════════════════════');
  }
}

main();
