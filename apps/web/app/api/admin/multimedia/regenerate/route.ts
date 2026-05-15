// ============================================================
// MODULE:     api/admin/multimedia/regenerate/route
// PURPOSE:    POST - Regenerar tamaños de imágenes
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { ImageOptimizerService, DEFAULT_SIZES, ImageSizeConfig } from '@/lib/multimedia/image-optimizer';
import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_DIR = process.env.STORAGE_DIR || './public/uploads';
const RATE_LIMIT = 20;

interface RegenerateRequest {
  fileIds: string[];
  sizes?: string[]; // thumbnail, small, medium, large, xlarge
}

interface RegenerateResult {
  success: boolean;
  regenerated: {
    id: string;
    success: boolean;
    outputs: string[];
    errors: string[];
  }[];
  errors: string[];
}

// Rate limiting
const rateLimitMap = new Map<string, number>();
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(userId) || 0;
  if (now - lastRequest < RATE_WINDOW) return false;
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

    // Rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json({ error: 'Rate limit excedido' }, { status: 429 });
    }

    const body: RegenerateRequest = await request.json();
    const { fileIds, sizes = ['thumbnail', 'small', 'medium', 'large'] } = body;

    if (!fileIds || fileIds.length === 0) {
      return NextResponse.json({ error: 'No se especificaron archivos' }, { status: 400 });
    }

    if (fileIds.length > RATE_LIMIT) {
      return NextResponse.json({ error: `Máximo ${RATE_LIMIT} archivos` }, { status: 400 });
    }

    // Mapear sizes a configuración
    const sizeConfigs: ImageSizeConfig[] = sizes
      .map(s => DEFAULT_SIZES.find(ds => ds.name === s))
      .filter((s): s is ImageSizeConfig => s !== undefined);

    const results: RegenerateResult = {
      success: true,
      regenerated: [],
      errors: [],
    };

    for (const fileId of fileIds) {
      const filePath = path.join(STORAGE_DIR, fileId);
      
      try {
        const exists = await fs.access(filePath).then(() => true).catch(() => false);
        if (!exists) {
          results.errors.push(`${fileId}: No encontrado`);
          continue;
        }

        const outputDir = path.dirname(filePath);
        const generateResult = await ImageOptimizerService.generateSizes(
          filePath,
          outputDir,
          sizeConfigs
        );

        results.regenerated.push({
          id: fileId,
          success: generateResult.success,
          outputs: generateResult.outputs,
          errors: generateResult.errors,
        });

        if (generateResult.errors.length > 0) {
          results.errors.push(...generateResult.errors);
        }
      } catch (fileError) {
        results.errors.push(`${fileId}: ${fileError}`);
        results.regenerated.push({
          id: fileId,
          success: false,
          outputs: [],
          errors: [fileError instanceof Error ? fileError.message : 'Error'],
        });
      }
    }

    results.success = results.errors.length === 0;

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API /admin/multimedia/regenerate] Error:', error);
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}