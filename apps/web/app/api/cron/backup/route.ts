import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@saidonclub/database';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Inicializar cliente de Supabase de forma segura si las variables de entorno están presentes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'saidonclub-assets';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Función helper para serializar de forma segura datos de Prisma (incluyendo BigInt/Decimal)
function safeStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    // Prisma Decimals implementan toJSON() que retorna una cadena de texto, pero si no se detecta:
    if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
      return value.toString();
    }
    return value;
  }, 2);
}

export async function GET(request: NextRequest) {
  return executeBackup(request);
}

export async function POST(request: NextRequest) {
  return executeBackup(request);
}

async function executeBackup(request: NextRequest) {
  const startTime = Date.now();
  console.log('[Cron Backup] Iniciando proceso de respaldo automatizado...');

  try {
    // 1. Validación de seguridad estricta
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    // Permitir bypass en desarrollo local si no se provee el header o si coincide con el secreto
    const isDev = process.env.NODE_ENV === 'development';
    const isAuthValid = expectedSecret ? (authHeader === `Bearer ${expectedSecret}`) : isDev;

    if (!isAuthValid) {
      console.warn('[Cron Backup] Intento de acceso no autorizado.');
      return NextResponse.json(
        { error: 'Unauthorized. Valid Cron Secret required.' },
        { status: 401 }
      );
    }

    // 2. Recuperar datos tal como en db_backup.ts
    console.log('[Cron Backup] Extrayendo datos críticos de la base de datos...');
    const data = {
      timestamp: new Date().toISOString(),
      categories: await prisma.category.findMany(),
      products: await prisma.product.findMany({
        include: { category: true }
      }),
      services: await prisma.service.findMany({
        include: { category: true, provider: true }
      }),
      cities: await prisma.city.findMany(),
      systemConfig: await prisma.systemConfig.findMany(),
    };

    console.log(`[Cron Backup] Extracción completada. Resumen:
      - Categorías: ${data.categories.length}
      - Productos: ${data.products.length}
      - Servicios: ${data.services.length}
      - Ciudades: ${data.cities.length}
      - Configuración: ${data.systemConfig.length}`);

    // 3. Generar nombres de archivo dinámicos
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timestampStr = `${year}_${month}_${day}_${hours}${minutes}${seconds}`;
    const filename = `SNAPSHOT_${timestampStr}.json`;
    const serializedData = safeStringify(data);

    let localWriteSuccess = false;
    let localPath = '';
    let localError = '';

    // 4. Intentar guardar localmente (es útil en desarrollo y entornos híbridos)
    try {
      const backupDir = path.join(process.cwd(), 'docs/backups/database');
      localPath = path.join(backupDir, filename);

      // Asegurar que el directorio existe
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(localPath, serializedData, 'utf8');
      localWriteSuccess = true;
      console.log(`[Cron Backup] Respaldo guardado localmente en: ${localPath}`);
    } catch (err: any) {
      localError = err.message;
      console.warn(`[Cron Backup] No se pudo escribir el archivo en el disco local (esperado en entornos serverless de solo lectura): ${err.message}`);
    }

    let cloudUploadSuccess = false;
    let cloudUrl = '';
    let cloudError = '';
    const storagePath = `backups/database/${filename}`;

    // 5. Subir a Supabase Storage (Almacenamiento en la nube persistente)
    if (supabase) {
      try {
        console.log(`[Cron Backup] Subiendo respaldo a Supabase Storage: ${bucketName}/${storagePath}`);
        const buffer = Buffer.from(serializedData, 'utf-8');
        
        let uploadResult = await supabase.storage
          .from(bucketName)
          .upload(storagePath, buffer, {
            contentType: 'application/json',
            cacheControl: '3600',
            upsert: true
          });

        if (uploadResult.error && (uploadResult.error.message.includes('Bucket not found') || uploadResult.error.message.includes('does not exist'))) {
          console.log(`[Cron Backup] El bucket '${bucketName}' no fue encontrado. Creándolo automáticamente...`);
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 52428800 // 50MB
          });

          if (createError) {
            console.error(`[Cron Backup] Error al crear el bucket: ${createError.message}`);
            throw new Error(`Failed to create bucket: ${createError.message}`);
          }

          console.log(`[Cron Backup] Bucket '${bucketName}' creado exitosamente. Reintentando subida...`);
          uploadResult = await supabase.storage
            .from(bucketName)
            .upload(storagePath, buffer, {
              contentType: 'application/json',
              cacheControl: '3600',
              upsert: true
            });
        }

        if (uploadResult.error) {
          throw uploadResult.error;
        }

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        cloudUrl = publicUrlData.publicUrl;
        cloudUploadSuccess = true;
        console.log(`[Cron Backup] Respaldo subido exitosamente a la nube: ${cloudUrl}`);
      } catch (err: any) {
        cloudError = err.message;
        console.error(`[Cron Backup] Error al subir a Supabase Storage: ${err.message}`);
      }
    } else {
      console.warn('[Cron Backup] Supabase no inicializado. Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.');
      cloudError = 'Supabase client credentials missing';
    }

    const duration = Date.now() - startTime;

    // 6. Retornar resultado estructurado
    return NextResponse.json({
      success: localWriteSuccess || cloudUploadSuccess,
      message: 'Proceso de respaldo de base de datos finalizado.',
      filename,
      durationMs: duration,
      stats: {
        categories: data.categories.length,
        products: data.products.length,
        services: data.services.length,
        cities: data.cities.length,
        systemConfig: data.systemConfig.length,
        fileSizeBytes: serializedData.length
      },
      local: {
        success: localWriteSuccess,
        path: localPath,
        error: localWriteSuccess ? null : localError
      },
      cloud: {
        success: cloudUploadSuccess,
        url: cloudUrl,
        path: storagePath,
        error: cloudUploadSuccess ? null : cloudError
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Cron Backup] Error crítico en el endpoint de backup:', error);
    return NextResponse.json({
      success: false,
      error: 'Backup process failed',
      details: error.message
    }, { status: 500 });
  }
}
