// ============================================================
// API: admin/import/validate
// PURPOSE: Validación previa de archivos de importación
// GET /api/admin/import/validate?checksum=xxx
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { validateImport, previewImport } from '@/lib/services/import';
import { createHash } from 'crypto';

const ALLOWED_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];

export async function POST(request: NextRequest) {
  console.log('[Import Validate API] Starting validation');

  try {
    const user = await getUser();
    if (!user || !ALLOWED_ROLES.includes(user.role)) {
      console.warn('[Import Validate API] Unauthorized access');
      return NextResponse.json(
        { error: 'Unauthorized. Admin role required.' },
        { status: 403 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data or application/json' },
        { status: 400 }
      );
    }

    let fileContent: string;
    let fileSize = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided in form data' },
          { status: 400 }
        );
      }

      fileSize = file.size;
      fileContent = await file.text();
    } else {
      fileContent = await request.text();
      fileSize = Buffer.byteLength(fileContent, 'utf8');
    }

    if (!fileContent || fileContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'Empty file content' },
        { status: 400 }
      );
    }

    console.log(`[Import Validate API] File size: ${fileSize} bytes`);

    const result = await validateImport(fileContent, fileSize);

    const checksum = createHash('sha256').update(fileContent).digest('hex').substring(0, 16);
    
    const preview = await previewImport(fileContent);

    return NextResponse.json({
      valid: result.valid,
      checksum,
      errors: result.errors,
      warnings: result.warnings,
      preview: preview ? {
        totalRecords: preview.totalRecords,
        sampleUsers: preview.users.length,
        sampleProducts: preview.products.length,
        sampleServices: preview.services.length,
        sampleCategories: preview.categories.length
      } : null,
      metadata: result.data ? {
        version: result.data.metadata.version,
        type: result.data.metadata.type,
        format: result.data.metadata.format,
        generatedAt: result.data.metadata.generatedAt,
        recordCounts: result.data.metadata.recordCounts
      } : null,
      dependencies: ['categories', 'users', 'products', 'services', 'config']
    });

  } catch (error) {
    console.error('[Import Validate API] Error:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Import Validate API',
    methods: {
      POST: {
        description: 'Validate import file before importing',
        contentType: 'multipart/form-data or application/json',
        body: 'file: File',
        returns: {
          valid: 'boolean',
          checksum: 'string (SHA-256)',
          errors: 'string[]',
          warnings: 'string[]',
          preview: 'object (sample records)',
          metadata: 'object (export file metadata)',
          dependencies: 'string[] (import order)'
        }
      }
    }
  });
}