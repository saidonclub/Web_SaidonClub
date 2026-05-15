// ============================================================
// MODULE:     api/admin/multimedia/route (DELETE)
// PURPOSE:    DELETE - Eliminar archivos multimedia
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_DIR = process.env.STORAGE_DIR || './public/uploads';
const MAX_DELETE = 100;

interface DeleteRequest {
  fileIds: string[];
}

interface DeleteResult {
  success: boolean;
  deleted: string[];
  freedBytes: number;
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

export async function DELETE(request: NextRequest) {
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

    // Solo ADMIN y SUPER_ADMIN pueden eliminar
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Solo ADMIN puede eliminar' }, { status: 403 });
    }

    // Rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json({ error: 'Rate limit excedido' }, { status: 429 });
    }

    const body: DeleteRequest = await request.json();
    const { fileIds } = body;

    if (!fileIds || fileIds.length === 0) {
      return NextResponse.json({ error: 'No se especificaron archivos' }, { status: 400 });
    }

    if (fileIds.length > MAX_DELETE) {
      return NextResponse.json({ error: `Máximo ${MAX_DELETE} archivos` }, { status: 400 });
    }

    const results: DeleteResult = {
      success: true,
      deleted: [],
      freedBytes: 0,
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

        const stats = await fs.stat(filePath);
        await fs.unlink(filePath);
        
        results.deleted.push(fileId);
        results.freedBytes += stats.size;
      } catch (fileError) {
        results.errors.push(`${fileId}: ${fileError}`);
        results.success = false;
      }
    }

    // Log auditoría
    console.log(`[Multimedia DELETE] User ${user.id} eliminó ${results.deleted.length} archivos, freed ${results.freedBytes} bytes`);

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API /admin/multimedia DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}