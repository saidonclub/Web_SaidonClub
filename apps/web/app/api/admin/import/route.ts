// ============================================================
// API: admin/import
// PURPOSE: Endpoint de importación de datos al ecosistema
// POST /api/admin/import
// Headers: X-Import-Mode: merge|replace, X-Dry-Run: true|false
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { executeImport, createImportLog, validateImport } from '@/lib/services/import';

const ALLOWED_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;

const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(userId);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[Import API] Starting import request');

  try {
    const user = await getUser();
    if (!user || !ALLOWED_ROLES.includes(user.role)) {
      console.warn('[Import API] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized. Admin role required.' },
        { status: 403 }
      );
    }

    if (!checkRateLimit(user.id)) {
      console.warn('[Import API] Rate limit exceeded');
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 imports per minute.' },
        { status: 429 }
      );
    }

    const importMode = request.headers.get('X-Import-Mode')?.toLowerCase();
    const dryRunHeader = request.headers.get('X-Dry-Run')?.toLowerCase();
    const isDryRun = dryRunHeader === 'true' || dryRunHeader === '1';

    if (importMode && !['merge', 'replace'].includes(importMode)) {
      return NextResponse.json(
        { error: 'Invalid X-Import-Mode. Use "merge" or "replace".' },
        { status: 400 }
      );
    }

    const mode = (importMode as 'merge' | 'replace') || 'merge';
    console.log(`[Import API] Mode: ${mode}, DryRun: ${isDryRun}`);

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
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      fileSize = file.size;
      
      if (fileSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
          { status: 413 }
        );
      }

      fileContent = await file.text();
    } else {
      fileContent = await request.text();
      fileSize = Buffer.byteLength(fileContent, 'utf8');

      if (fileSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
          { status: 413 }
        );
      }
    }

    if (!fileContent || fileContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'Empty file' },
        { status: 400 }
      );
    }

    console.log(`[Import API] Processing file: ${fileSize} bytes`);

    const validationResult = await validateImport(fileContent, fileSize);
    
    if (!validationResult.valid) {
      console.warn('[Import API] Validation failed:', validationResult.errors);
      
      await createImportLog(user.id, 'import', {
        mode,
        success: false,
        error: `Validation failed: ${validationResult.errors.join(', ')}`
      });

      return NextResponse.json({
        success: false,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        message: 'Import validation failed'
      }, { status: 422 });
    }

    if (isDryRun) {
      console.log('[Import API] Dry-run mode: simulating import');
      
      return NextResponse.json({
        success: true,
        dryRun: true,
        message: 'Dry-run completed. No changes applied.',
        preview: validationResult.data ? {
          totalRecords: (Object.values(validationResult.data.metadata.recordCounts) as number[]).reduce((a, b) => a + b, 0),
          recordCounts: validationResult.data.metadata.recordCounts,
          wouldImport: (Object.values(validationResult.data.metadata.recordCounts) as number[]).reduce((a, b) => a + b, 0)
        } : null,
        warnings: validationResult.warnings
      });
    }

    const importResult = await executeImport(fileContent, mode);

    await createImportLog(user.id, 'import', {
      mode,
      success: importResult.success,
      recordCount: importResult.imported + importResult.updated,
      error: importResult.errors.length > 0 ? importResult.errors[0].error : undefined
    });

    const elapsed = Date.now() - startTime;
    console.log(`[Import API] Completed in ${elapsed}ms. Imported: ${importResult.imported}, Updated: ${importResult.updated}, Skipped: ${importResult.skipped}`);

    return NextResponse.json({
      success: importResult.success,
      imported: importResult.imported,
      updated: importResult.updated,
      skipped: importResult.skipped,
      errors: importResult.errors.length > 0 ? importResult.errors : undefined,
      conflicts: importResult.conflicts,
      message: importResult.success 
        ? `Import completed successfully`
        : `Import completed with ${importResult.errors.length} errors`,
      warnings: validationResult.warnings
    });

  } catch (error) {
    console.error('[Import API] Error:', error);

    return NextResponse.json(
      { 
        success: false,
        error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Import API',
    headers: {
      'X-Import-Mode': 'merge | replace (default: merge)',
      'X-Dry-Run': 'true | false (default: false)'
    },
    modes: {
      merge: 'Add new records, skip existing (recommended)',
      replace: 'Update existing records, add new ones'
    },
    methods: {
      POST: {
        description: 'Import data from exported file',
        contentType: 'multipart/form-data or application/json',
        body: 'file: File (JSON export file)',
        returns: {
          success: 'boolean',
          imported: 'number of new records created',
          updated: 'number of existing records modified',
          skipped: 'number of records skipped (merge mode)',
          errors: 'array of error details',
          dryRun: 'boolean (if X-Dry-Run header was true)'
        }
      }
    }
  });
}