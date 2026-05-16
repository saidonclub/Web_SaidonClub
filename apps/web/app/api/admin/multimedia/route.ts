// ============================================================
// MODULE:     api/admin/multimedia/route
// PURPOSE:    GET - Listar archivos multimedia con filtros
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StorageCleanerService } from '@/lib/multimedia/storage-cleaner';
import { ImageOptimizerService } from '@/lib/multimedia/image-optimizer';
import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_DIR = process.env.STORAGE_DIR || './public/uploads';

interface MediaFile {
  id: string;
  filename: string;
  path: string;
  url: string;
  size: number;
  type: 'image' | 'video' | 'other';
  format?: string;
  width?: number;
  height?: number;
  createdAt: string;
  optimized: boolean;
}

interface PaginationResult {
  items: MediaFile[];
  total: number;
  stats: {
    totalFiles: number;
    totalSize: number;
    imagesCount: number;
    videosCount: number;
    unoptimizedCount: number;
    savedBytes: number;
  };
  page: number;
  limit: number;
  totalPages: number;
}

export async function GET(request: NextRequest) {
  try {
    // Autenticación y permisos
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const role = user.role as Role;
    if (!hasPermission(role, Permission.MANAGE_CONTENT)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    // Query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const type = searchParams.get('type'); // image, video
    const sort = searchParams.get('sort') || 'date'; // date, size, name

    // Escanear directorio
    const files: MediaFile[] = [];
    const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
    const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.avi'];

    const walkDir = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await walkDir(fullPath);
          } else {
            const ext = path.extname(entry.name).toLowerCase();
            let fileType: 'image' | 'video' | 'other' = 'other';
            if (IMAGE_EXTS.includes(ext)) fileType = 'image';
            else if (VIDEO_EXTS.includes(ext)) fileType = 'video';

            // Filtrar por tipo si aplica
            if (type && fileType !== type) return;

            const stats = await fs.stat(fullPath);
            const metadata = fileType === 'image' 
              ? await ImageOptimizerService.getMetadata(fullPath)
              : null;

            const relativePath = fullPath.replace(STORAGE_DIR, '').replace(/\\/g, '/');
            
            files.push({
              id: relativePath,
              filename: entry.name,
              path: relativePath,
              url: `/uploads${relativePath}`,
              size: stats.size,
              type: fileType,
              format: metadata?.format || ext.replace('.', ''),
              width: metadata?.width,
              height: metadata?.height,
              createdAt: stats.birthtime.toISOString(),
              optimized: false,
            });
          }
        }
      } catch {
        // Ignorar directorios sin acceso
      }
    };

    await walkDir(STORAGE_DIR);

    // Ordenar
    files.sort((a, b) => {
      switch (sort) {
        case 'size':
          return b.size - a.size;
        case 'name':
          return a.filename.localeCompare(b.filename);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // Paginar
    const total = files.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedFiles = files.slice(start, start + limit);

    // Calcular stats
    const storageStats = await StorageCleanerService.getStats();
    
    // Estimar archivos no optimizados (simplificado)
    const unoptimizedCount = files.filter(f => 
      f.type === 'image' && !f.format?.includes('webp') && !f.format?.includes('avif')
    ).length;

    const response: PaginationResult = {
      items: paginatedFiles,
      total,
      stats: {
        totalFiles: storageStats.totalFiles,
        totalSize: storageStats.totalSize,
        imagesCount: storageStats.imagesCount,
        videosCount: storageStats.videosCount,
        unoptimizedCount,
        savedBytes: storageStats.totalSize - (storageStats.totalSize * 0.8), // Estimado
      },
      page,
      limit,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /admin/multimedia] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}