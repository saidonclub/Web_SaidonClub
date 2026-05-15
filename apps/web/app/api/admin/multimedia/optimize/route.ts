// ============================================================
// MODULE:     api/admin/multimedia/optimize/route
// PURPOSE:    POST - Comprimir imágenes seleccionadas
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { ImageOptimizerService } from '@/lib/multimedia/image-optimizer';
import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_DIR = process.env.STORAGE_DIR || './public/uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const RATE_LIMIT = 50; //Máximo 50 archivos por request
const RATE_WINDOW = 60 * 1000; // 1 minuto

interface OptimizeRequest {
  fileIds: string[];
  options?: {
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg';
    resize?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    sizes?: string[];
  };
}

interface OptimizeResult {
  success: boolean;
  optimized: {
    id: string;
    success: boolean;
    originalSize: number;
    optimizedSize: number;
    savedBytes: number;
    savedPercent: number;
    outputPath?: string;
    error?: string;
  }[];
  totalSaved: number;
  errors: string[];
  skipped: string[];
}

// Simple rate limiting en memoria
const rateLimitMap = new Map<string, number>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(userId) || 0;
  
  if (now - lastRequest < RATE_WINDOW) {
    return false;
  }
  
  rateLimitMap.set(userId, now);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Autenticación
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const role = user.role as Role;
    if (!hasPermission(role, Permission.MANAGE_CONTENT)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit excedido. Intenta en 1 minuto.' },
        { status: 429 }
      );
    }

    // Parse body
    const body: OptimizeRequest = await request.json();
    const { fileIds, options = {} } = body;

    if (!fileIds || fileIds.length === 0) {
      return NextResponse.json({ error: 'No se especificaron archivos' }, { status: 400 });
    }

    if (fileIds.length > RATE_LIMIT) {
      return NextResponse.json(
        { error: `Máximo ${RATE_LIMIT} archivos por request` },
        { status: 400 }
      );
    }

    const results: OptimizeResult = {
      success: true,
      optimized: [],
      totalSaved: 0,
      errors: [],
      skipped: [],
    };

    for (const fileId of fileIds) {
      const filePath = path.join(STORAGE_DIR, fileId);
      
      try {
        // Verificar que existe
        const exists = await fs.access(filePath).then(() => true).catch(() => false);
        if (!exists) {
          results.skipped.push(fileId);
          continue;
        }

        // Verificar tamaño
        const stats = await fs.stat(filePath);
        if (stats.size > MAX_FILE_SIZE && !options.resize) {
          results.skipped.push(`${fileId} (>10MB sin opción skip)`);
          continue;
        }

        // Verificar que es imagen
        const ext = path.extname(filePath).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
          results.errors.push(`${fileId}: No es imagen`);
          continue;
        }

        // Optimizar
        const outputDir = path.dirname(filePath);
        const result = await ImageOptimizerService.optimizeImage(
          filePath,
          outputDir,
          {
            quality: options.quality || 80,
            format: options.format || 'webp',
            maxWidth: options.maxWidth || 1200,
            maxHeight: options.maxHeight || 1200,
          }
        );

        if (result.success) {
          results.optimized.push({
            id: fileId,
            success: true,
            originalSize: result.originalSize,
            optimizedSize: result.optimizedSize,
            savedBytes: result.savedBytes,
            savedPercent: result.savedPercent,
            outputPath: result.outputPath,
          });
          results.totalSaved += result.savedBytes;
        } else {
          results.optimized.push({
            id: fileId,
            success: false,
            originalSize: result.originalSize,
            optimizedSize: result.optimizedSize,
            savedBytes: 0,
            savedPercent: 0,
            error: result.error,
          });
          if (result.error) results.errors.push(result.error);
        }
      } catch (fileError) {
        results.errors.push(`${fileId}: ${fileError}`);
        results.optimized.push({
          id: fileId,
          success: false,
          originalSize: 0,
          optimizedSize: 0,
          savedBytes: 0,
          savedPercent: 0,
          error: fileError instanceof Error ? fileError.message : 'Error',
        });
      }
    }

    results.success = results.errors.length === 0;

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API /admin/multimedia/optimize] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}