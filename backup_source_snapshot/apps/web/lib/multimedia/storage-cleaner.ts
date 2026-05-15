// ============================================================
// MODULE:     lib/multimedia/storage-cleaner
// PURPOSE:    Servicio de limpieza de storage y gestión de archivos
// ============================================================

import { prisma } from '@saidonclub/database';
import { promises as fs } from 'fs';
import path from 'path';

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  imagesCount: number;
  videosCount: number;
  orphanCount: number;
  lastCleanup?: Date;
}

export interface CleanupResult {
  success: boolean;
  processedCount: number;
  freedBytes: number;
  deletedFiles: string[];
  errors: string[];
}

export interface QuotaAlarm {
  usedPercent: number;
  usedBytes: number;
  limitBytes: number;
  warning: boolean;
  critical: boolean;
}

const STORAGE_DIR = process.env.STORAGE_DIR || './public/uploads';
const DEFAULT_QUOTA_GB = 10;
const WARNING_THRESHOLD = 80;
const CRITICAL_THRESHOLD = 95;

export class StorageCleanerService {
  /**
   * Obtiene estadísticas del storage
   */
  static async getStats(): Promise<StorageStats> {
    let totalFiles = 0;
    let totalSize = 0;
    let imagesCount = 0;
    let videosCount = 0;

    const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
    const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi'];

    try {
      const walkDir = async (dir: string) => {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              await walkDir(fullPath);
            } else {
              totalFiles++;
              const stats = await fs.stat(fullPath);
              totalSize += stats.size;

              const ext = path.extname(entry.name).toLowerCase();
              if (IMAGE_EXTENSIONS.includes(ext)) imagesCount++;
              if (VIDEO_EXTENSIONS.includes(ext)) videosCount++;
            }
          }
        } catch (error) {
          // Ignorar directorios sin acceso
        }
      };

      await walkDir(STORAGE_DIR);
    } catch (error) {
      console.error('[StorageCleaner] Error getting stats:', error);
    }

    return {
      totalFiles,
      totalSize,
      imagesCount,
      videosCount,
      orphanCount: 0,
      lastCleanup: undefined,
    };
  }

  /**
   * Encuentra archivos huérfanos (no referenciados en BD)
   */
  static async findOrphans(): Promise<string[]> {
    const orphans: string[] = [];

    try {
      const [products, services, users] = await Promise.all([
        prisma.product.findMany({ select: { images: true } }),
        prisma.service.findMany({ select: { images: true } }),
        prisma.user.findMany({ select: { avatar: true } }),
      ]);

      const referencedUrls = new Set<string>();

      for (const p of products) {
        for (const img of p.images) {
          referencedUrls.add(img);
        }
      }

      for (const s of services) {
        for (const img of s.images) {
          referencedUrls.add(img);
        }
      }

      for (const u of users) {
        if (u.avatar) referencedUrls.add(u.avatar);
      }

      const walkDir = async (dir: string) => {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              await walkDir(fullPath);
            } else {
              const url = `/uploads${fullPath.replace(STORAGE_DIR, '')}`;
              if (!referencedUrls.has(url) && !referencedUrls.has(fullPath)) {
                orphans.push(fullPath);
              }
            }
          }
        } catch {
          // Ignorar
        }
      };

      await walkDir(STORAGE_DIR);
    } catch (error) {
      console.error('[StorageCleaner] Error finding orphans:', error);
    }

    return orphans;
  }

  /**
   * Elimina archivos huérfanos
   */
  static async cleanupOrphans(dryRun: boolean = false): Promise<CleanupResult> {
    const orphans = await this.findOrphans();
    const deletedFiles: string[] = [];
    const errors: string[] = [];
    let freedBytes = 0;

    if (dryRun) {
      return {
        success: true,
        processedCount: orphans.length,
        freedBytes: 0,
        deletedFiles: orphans,
        errors: [],
      };
    }

    for (const filePath of orphans) {
      try {
        const stats = await fs.stat(filePath);
        await fs.unlink(filePath);
        deletedFiles.push(filePath);
        freedBytes += stats.size;
      } catch (error) {
        errors.push(`Error eliminando ${filePath}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      processedCount: deletedFiles.length,
      freedBytes,
      deletedFiles,
      errors,
    };
  }

  /**
   * Rotación de logs/imágenes antiguas
   */
  static async rotateOldFiles(daysOld: number = 90): Promise<CleanupResult> {
    const deletedFiles: string[] = [];
    const errors: string[] = [];
    let freedBytes = 0;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    try {
      const ARCHIVE_DIR = path.join(STORAGE_DIR, 'archive');
      await fs.mkdir(ARCHIVE_DIR, { recursive: true });

      const entries = await fs.readdir(STORAGE_DIR, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const fullPath = path.join(STORAGE_DIR, entry.name);
        const stats = await fs.stat(fullPath);

        if (stats.mtime < cutoffDate) {
          const archivePath = path.join(ARCHIVE_DIR, `${Date.now()}_${entry.name}`);
          try {
            await fs.rename(fullPath, archivePath);
            deletedFiles.push(fullPath);
            freedBytes += stats.size;
          } catch {
            // Si falla rename, intentar copiar
            try {
              const content = await fs.readFile(fullPath);
              await fs.writeFile(archivePath, content);
              await fs.unlink(fullPath);
              deletedFiles.push(fullPath);
              freedBytes += stats.size;
            } catch (error) {
              errors.push(`Error procesando ${entry.name}: ${error}`);
            }
          }
        }
      }

      return {
        success: errors.length === 0,
        processedCount: deletedFiles.length,
        freedBytes,
        deletedFiles,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        processedCount: 0,
        freedBytes: 0,
        deletedFiles: [],
        errors: [error instanceof Error ? error.message : 'Error desconocido'],
      };
    }
  }

  /**
   * Verifica cuota de storage y dispara alarmas
   */
  static async checkQuota(limitGB: number = DEFAULT_QUOTA_GB): Promise<QuotaAlarm> {
    const stats = await this.getStats();
    const limitBytes = limitGB * 1024 * 1024 * 1024;
    const usedPercent = (stats.totalSize / limitBytes) * 100;

    return {
      usedPercent: parseFloat(usedPercent.toFixed(1)),
      usedBytes: stats.totalSize,
      limitBytes,
      warning: usedPercent >= WARNING_THRESHOLD,
      critical: usedPercent >= CRITICAL_THRESHOLD,
    };
  }

  /**
   * Fuerza limpieza si quota crítica
   */
  static async emergencyCleanup(): Promise<CleanupResult> {
    const quota = await this.checkQuota();
    
    if (!quota.critical) {
      return {
        success: true,
        processedCount: 0,
        freedBytes: 0,
        deletedFiles: [],
        errors: [],
      };
    }

    // Limpiar huérfanos primero
    const orphanResult = await this.cleanupOrphans(false);

    // Si aún crítico, rotar archivos antiguos
    if ((await this.checkQuota()).critical) {
      const rotateResult = await this.rotateOldFiles(30);
      return {
        success: rotateResult.success,
        processedCount: orphanResult.processedCount + rotateResult.processedCount,
        freedBytes: orphanResult.freedBytes + rotateResult.freedBytes,
        deletedFiles: [...orphanResult.deletedFiles, ...rotateResult.deletedFiles],
        errors: [...orphanResult.errors, ...rotateResult.errors],
      };
    }

    return orphanResult;
  }
}