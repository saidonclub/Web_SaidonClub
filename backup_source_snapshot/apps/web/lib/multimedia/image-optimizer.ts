// ============================================================
// MODULE:     lib/multimedia/image-optimizer
// PURPOSE:    Servicio de optimización de imágenes con Sharp
// ============================================================

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export interface ImageSizeConfig {
  name: string;
  width: number;
  height: number;
  quality?: number;
}

export interface OptimizeOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  stripMetadata?: boolean;
  resize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export interface OptimizeResult {
  success: boolean;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savedPercent: number;
  outputPath?: string;
  format: string;
  error?: string;
}

export const DEFAULT_SIZES: ImageSizeConfig[] = [
  { name: 'thumbnail', width: 150, height: 150, quality: 70 },
  { name: 'small', width: 320, height: 320, quality: 75 },
  { name: 'medium', width: 640, height: 640, quality: 80 },
  { name: 'large', width: 1200, height: 1200, quality: 85 },
  { name: 'xlarge', width: 1920, height: 1920, quality: 90 },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWLISTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
const DENYLISTED_EXTENSIONS = ['.exe', '.scr', '.bat', '.cmd', '.sh', '.php', '.js', '.ts', '.html'];

export class ImageOptimizerService {
  /**
   * Optimiza una imagen individual
   */
  static async optimizeImage(
    inputPath: string,
    outputDir: string,
    options: OptimizeOptions = {}
  ): Promise<OptimizeResult> {
    const {
      quality = 80,
      format = 'webp',
      stripMetadata = true,
      maxWidth = 1200,
      maxHeight = 1200,
    } = options;

    try {
      const inputBuffer = await fs.readFile(inputPath);
      const originalSize = inputBuffer.length;

      if (originalSize > MAX_FILE_SIZE) {
        return {
          success: false,
          originalSize,
          optimizedSize: originalSize,
          savedBytes: 0,
          savedPercent: 0,
          format: 'skip',
          error: 'Archivo > 10MB sin opción de skip',
        };
      }

      let pipeline = sharp(inputBuffer);

      // Redimensionar si es necesario
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });

      // Strip EXIF metadata para privacidad
      if (stripMetadata) {
        pipeline = pipeline.rotate(); // Auto-rotate y remove metadata
      }

      // Convertir al formato especificado
      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ quality });
          break;
        case 'avif':
          pipeline = pipeline.avif({ quality });
          break;
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality, mozjpeg: true });
          break;
        default:
          pipeline = pipeline.webp({ quality });
      }

      const finalBuffer = await pipeline.toBuffer();
      const optimizedSize = finalBuffer.length;

      // Guardar archivo optimizado
      const filename = `${path.basename(inputPath, path.extname(inputPath))}.${format}`;
      const outputPath = path.join(outputDir, filename);
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputPath, finalBuffer);

      const savedBytes = originalSize - optimizedSize;
      const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

      return {
        success: true,
        originalSize,
        optimizedSize,
        savedBytes,
        savedPercent: parseFloat(savedPercent),
        outputPath,
        format,
      };
    } catch (error) {
      console.error('[ImageOptimizer] Error:', error);
      return {
        success: false,
        originalSize: 0,
        optimizedSize: 0,
        savedBytes: 0,
        savedPercent: 0,
        format: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Genera múltiples tamaños de una imagen
   */
  static async generateSizes(
    inputPath: string,
    outputDir: string,
    sizes: ImageSizeConfig[] = DEFAULT_SIZES
  ): Promise<{ success: boolean; outputs: string[]; errors: string[] }> {
    const outputs: string[] = [];
    const errors: string[] = [];

    try {
      const inputBuffer = await fs.readFile(inputPath);
      const metadata = await sharp(inputBuffer).metadata();

      for (const size of sizes) {
        try {
          // Skip si la imagen original es más pequeña
          if (metadata.width && metadata.height) {
            if (metadata.width < size.width && metadata.height < size.height) {
              continue;
            }
          }

          const outputFilename = `${size.name}.webp`;
          const outputPath = path.join(outputDir, outputFilename);

          await sharp(inputBuffer)
            .resize(size.width, size.height, {
              fit: 'cover',
              position: 'center',
            })
            .webp({ quality: size.quality || 80 })
            .toFile(outputPath);

          outputs.push(outputPath);
        } catch (error) {
          errors.push(`Error generando ${size.name}: ${error}`);
        }
      }

      return {
        success: outputs.length > 0,
        outputs,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        outputs: [],
        errors: [error instanceof Error ? error.message : 'Error desconocido'],
      };
    }
  }

  /**
   * Obtiene metadata de una imagen
   */
  static async getMetadata(imagePath: string): Promise<{
    width?: number;
    height?: number;
    format?: string;
    size: number;
    hasAlpha: boolean;
  } | null> {
    try {
      const buffer = await fs.readFile(imagePath);
      const metadata = await sharp(buffer).metadata();
      const stats = await fs.stat(imagePath);

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: stats.size,
        hasAlpha: metadata.hasAlpha || false,
      };
    } catch (error) {
      console.error('[ImageOptimizer] Error getMetadata:', error);
      return null;
    }
  }

  /**
   * Compresión por cuantización de colores usando PNG con paleta
   */
  static async quantizeColors(
    inputPath: string,
    outputDir: string,
    colors: number = 256
  ): Promise<OptimizeResult> {
    try {
      const inputBuffer = await fs.readFile(inputPath);
      const originalSize = inputBuffer.length;

      const pngBuffer = await sharp(inputBuffer)
        .png({ palette: true, colors })
        .toBuffer();

      const outputBuffer = await sharp(pngBuffer)
        .webp({ quality: 75 })
        .toBuffer();

      const filename = `quantized_${path.basename(inputPath).replace(/\.[^.]+$/, '.webp')}`;
      const outputPath = path.join(outputDir, filename);
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputPath, outputBuffer);

      const savedBytes = originalSize - outputBuffer.length;

      return {
        success: true,
        originalSize,
        optimizedSize: outputBuffer.length,
        savedBytes,
        savedPercent: parseFloat(((savedBytes / originalSize) * 100).toFixed(1)),
        outputPath,
        format: 'webp',
      };
    } catch (error) {
      return {
        success: false,
        originalSize: 0,
        optimizedSize: 0,
        savedBytes: 0,
        savedPercent: 0,
        format: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Valida extensión de archivo
   */
  static isAllowedExtension(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ALLOWLISTED_EXTENSIONS.includes(ext);
  }

  /**
   * Verifica si es extensión peligrosa
   */
  static isDangerousExtension(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return DENYLISTED_EXTENSIONS.includes(ext);
  }

  /**
   * Valida dimensiones permitidas
   */
  static async validateDimensions(
    imagePath: string,
    maxWidth: number = 4096,
    maxHeight: number = 4096
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const metadata = await this.getMetadata(imagePath);
      if (!metadata) {
        return { valid: false, error: 'No se pudo leer la imagen' };
      }

      if (metadata.width && metadata.width > maxWidth) {
        return { valid: false, error: `Ancho ${metadata.width}px excede máximo ${maxWidth}px` };
      }

      if (metadata.height && metadata.height > maxHeight) {
        return { valid: false, error: `Alto ${metadata.height}px excede máximo ${maxHeight}px` };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Error de validación',
      };
    }
  }
}