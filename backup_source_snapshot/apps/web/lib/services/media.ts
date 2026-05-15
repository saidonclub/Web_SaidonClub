// ============================================================
// MODULE:     lib/media-upload
// PURPOSE:    Utilidad para subida optimizada de medios a Supabase
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { MediaEngine } from '@saidonclub/media-engine';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'saidonclub-assets';

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  size: number;
  originalSize: number;
  optimized: boolean;
}

export class MediaUploadService {
  /**
   * Procesa y sube un archivo (Imagen o Video) de forma optimizada
   */
  static async uploadOptimized(
    file: File | Buffer,
    filename: string,
    folder: string = 'general'
  ): Promise<UploadResult> {
    let buffer: Buffer;
    let mimeType: string;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      mimeType = file.type;
    } else {
      buffer = file;
      mimeType = this.getMimeType(filename);
    }

    let finalBuffer = buffer;
    let isOptimized = false;
    let finalFilename = filename;

    // 1. Optimización de Imágenes
    if (MediaEngine.isOptimizableImage(filename)) {
      console.log(`[MediaUpload] Optimizando imagen: ${filename}`);
      finalBuffer = await MediaEngine.optimizeImage(buffer);
      // Cambiar extensión a .webp para consistencia
      finalFilename = `${filename.split('.')[0]}.webp`;
      mimeType = 'image/webp';
      isOptimized = true;
    } 
    // 2. Optimización de Videos
    else if (MediaEngine.isOptimizableVideo(filename)) {
      console.log(`[MediaUpload] Optimizando video (420p, 15s): ${filename}`);
      finalBuffer = await MediaEngine.optimizeVideo(buffer);
      // Forzar formato mp4 para compatibilidad universal
      finalFilename = `${filename.split('.')[0]}.mp4`;
      mimeType = 'video/mp4';
      isOptimized = true;
    }

    // 3. Generar ruta única en Supabase
    const fileId = uuidv4();
    const storagePath = `${folder}/${fileId}_${finalFilename}`;

    // 4. Subida a Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, finalBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error subiendo a Supabase:', error);
      throw new Error(`Error de almacenamiento: ${error.message}`);
    }

    // 5. Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    return {
      url: publicUrlData.publicUrl,
      path: storagePath,
      filename: finalFilename,
      size: finalBuffer.length,
      originalSize: buffer.length,
      optimized: isOptimized,
    };
  }

  private static getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      default: return 'application/octet-stream';
    }
  }
}
