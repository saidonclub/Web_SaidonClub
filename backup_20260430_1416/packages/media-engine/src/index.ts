// ============================================================
// MODULE:     media-engine/index
// PURPOSE:    Motor de procesamiento y optimización de medios
//             Ajusta imágenes y videos para rendimiento premium.
// ============================================================

import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Configurar el path del binario de FFmpeg automáticamente
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

export interface MediaConfig {
  maxImageWidth: number;
  maxImageHeight: number;
  imageQuality: number;
  imageFormat: 'webp' | 'jpeg' | 'png';
  maxVideoDuration: number; // en segundos
  videoHeight: number; // resolución vertical (e.g. 420)
}

const DEFAULT_CONFIG: MediaConfig = {
  maxImageWidth: 1200,
  maxImageHeight: 1200,
  imageQuality: 80,
  imageFormat: 'webp',
  maxVideoDuration: 15, // Solicitado por el usuario
  videoHeight: 420,     // Solicitado por el usuario
};

export class MediaEngine {
  /**
   * Optimiza una imagen: redimensiona, comprime y convierte a formato moderno.
   */
  static async optimizeImage(
    buffer: Buffer,
    config: Partial<MediaConfig> = {}
  ): Promise<Buffer> {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    try {
      let pipeline = sharp(buffer)
        .resize({
          width: finalConfig.maxImageWidth,
          height: finalConfig.maxImageHeight,
          fit: 'inside',
          withoutEnlargement: true,
        });

      if (finalConfig.imageFormat === 'webp') {
        pipeline = pipeline.webp({ quality: finalConfig.imageQuality });
      }

      return await pipeline.toBuffer();
    } catch (error) {
      console.error('Error optimizando imagen:', error);
      throw new Error('Fallo en la optimización de la imagen');
    }
  }

  /**
   * Optimiza un video: Recorta a 15s, escala a 420p y comprime.
   * Retorna el Buffer del video optimizado.
   */
  static async optimizeVideo(
    inputBuffer: Buffer,
    config: Partial<MediaConfig> = {}
  ): Promise<Buffer> {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const tempIn = path.join(os.tmpdir(), `in_${Date.now()}.mp4`);
    const tempOut = path.join(os.tmpdir(), `out_${Date.now()}.mp4`);

    try {
      // 1. Guardar buffer temporalmente para FFmpeg
      fs.writeFileSync(tempIn, inputBuffer);

      return new Promise((resolve, reject) => {
        ffmpeg(tempIn)
          .setDuration(finalConfig.maxVideoDuration) // Cortar a 15s
          .size(`?x${finalConfig.videoHeight}`)       // Escalar a 420p (manteniendo ratio)
          .videoCodec('libx264')
          .outputOptions([
            '-crf 28',            // Compresión balanceada
            '-preset faster',     // Velocidad de procesamiento
            '-movflags +faststart' // Optimización para web
          ])
          .on('end', () => {
            const outputBuffer = fs.readFileSync(tempOut);
            // Limpieza
            this.cleanup([tempIn, tempOut]);
            resolve(outputBuffer);
          })
          .on('error', (err) => {
            this.cleanup([tempIn, tempOut]);
            reject(err);
          })
          .save(tempOut);
      });
    } catch (error) {
      console.error('Error optimizando video:', error);
      this.cleanup([tempIn, tempOut]);
      throw new Error('Fallo en la optimización del video');
    }
  }

  private static cleanup(paths: string[]) {
    paths.forEach(p => {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });
  }


  /**
   * Determina si un archivo necesita optimización basado en su extensión
   */
  static isOptimizableImage(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext || '');
  }

  static isOptimizableVideo(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['mp4', 'mov', 'webm', 'avi'].includes(ext || '');
  }
}
