import { googleSheetsService } from '../apps/web/lib/services/google-sheets.service';
import { PrismaClient } from '@saidonclub/database';

async function testSync() {
  console.log('🔄 Iniciando prueba de configuración de Google Sheets...');

  const isMock = googleSheetsService.isMockMode();

  if (!googleSheetsService.isConfigured() && !isMock) {
    console.error('❌ Error: Faltan variables de entorno para Google Sheets.');
    console.error('Asegúrate de tener GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY configurados.');
    process.exit(1);
  }

  if (isMock) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️ Corriendo en MOCK MODE (Simulado). Los datos se guardarán en data/mock-google-sheets.json.');
  } else {
    console.log('✅ Variables de entorno detectadas correctamente. Conectando con Google Sheets real.');
  }
  
  try {
    const db = new PrismaClient();
    console.log('📡 Conectando con la base de datos...');
    
    // Crear un ticket de prueba temporal si no hay ninguno
    const countBefore = await db.aITicket.count();
    let tempTicketId: string | null = null;
    
    if (countBefore === 0) {
      console.log('📝 No hay tickets en la base de datos. Creando un ticket de prueba temporal...');
      const tempTicket = await db.aITicket.create({
        data: {
          prompt: 'Prueba de integración automatizada de Google Sheets',
          response: 'La sincronización con Google Sheets funciona perfectamente.',
          status: 'SUCCESS',
          modelUsed: 'gemini-3.1-pro',
        }
      });
      tempTicketId = tempTicket.id;
      console.log(`✅ Ticket de prueba creado con ID: ${tempTicketId}`);
    }
    
    console.log('📡 Conectando con Google Sheets para sincronizar de DB a Sheets...');
    const result = await googleSheetsService.syncTicketsToSheet(db);
    
    if (result.success) {
      console.log(`✅ ¡Sincronización exitosa! ${result.count} tickets exportados.`);
    } else {
      console.error('❌ Falló la sincronización:', result.error);
    }

    // Limpieza
    if (tempTicketId) {
      console.log(`🧹 Eliminando ticket de prueba temporal (${tempTicketId})...`);
      await db.aITicket.delete({
        where: { id: tempTicketId }
      });
      console.log('✅ Limpieza completada.');
    }

    await db.$disconnect();
  } catch (err: unknown) {
    console.error('❌ Error fatal en el test:', err instanceof Error ? err.message : 'Unknown error');
    process.exit(1);
  }
}

testSync();
