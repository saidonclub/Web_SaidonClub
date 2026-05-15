// ============================================================
// MODULE:     api/upload/optimized/route
// PURPOSE:    Endpoint de subida optimizada para la UI
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { MediaUploadService } from '@/lib/services/media';
import { getUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar Autenticación
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Extraer archivo de la request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    // 3. Procesar y Subir (Optimización automática integrada)
    console.log(`[UploadAPI] Recibido archivo: ${file.name} (${file.size} bytes)`);
    
    const result = await MediaUploadService.uploadOptimized(
      file,
      file.name,
      folder
    );

    console.log(`[UploadAPI] Subida exitosa: ${result.path} (Optimizado: ${result.optimized})`);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: unknown) {
    console.error('[UploadAPI] Error crítico:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Configuración de tamaño máximo para Next.js (Body limit)
export const config = {
  api: {
    bodyParser: false, // Requerido para manejar FormData
  },
};
