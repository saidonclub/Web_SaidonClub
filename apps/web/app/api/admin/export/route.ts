// ============================================================
// API: admin/export
// PURPOSE: Endpoint de exportación de datos del ecosistema
// POST /api/admin/export
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { exportData, convertToCSV } from '@/lib/services/export';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { createImportLog } from '@/lib/services/import';
import type { ExportType, ExportFormat } from '@/lib/services/export-types';

export const dynamic = 'force-dynamic';

const ALLOWED_ROLES: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[Export API] Starting export request');

  try {
    const user = await getUser();
    if (!user || !ALLOWED_ROLES.includes(user.role)) {
      console.warn('[Export API] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized. Admin role required.' },
        { status: 403 }
      );
    }

    let body: { type?: string; format?: string; includeMedia?: boolean };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { type = 'full', format = 'json', includeMedia = false } = body;

    const validTypes: ExportType[] = ['full', 'products', 'services', 'users', 'categories', 'config', 'providers'];
    const validFormats: ExportFormat[] = ['json', 'csv'];

    if (!validTypes.includes(type as ExportType)) {
      return NextResponse.json(
        { error: `Invalid type. Allowed: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validFormats.includes(format as ExportFormat)) {
      return NextResponse.json(
        { error: `Invalid format. Allowed: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    console.log(`[Export API] Exporting: type=${type}, format=${format}, includeMedia=${includeMedia}`);

    const { data, mediaCount } = await exportData(type as ExportType, format as ExportFormat, includeMedia);

    const fileSize = JSON.stringify(data).length;
    if (fileSize > MAX_FILE_SIZE) {
      console.error(`[Export API] File too large: ${fileSize} bytes`);
      return NextResponse.json(
        { error: `Export file too large (${Math.round(fileSize / 1024 / 1024)}MB). Try filtering by type.` },
        { status: 413 }
      );
    }

    let fileContent: string;
    let contentType: string;
    let filename: string;

    if (format === 'csv') {
      if (type !== 'products' && type !== 'services') {
        return NextResponse.json(
          { error: 'CSV format only supported for products and services exports' },
          { status: 400 }
        );
      }

      fileContent = convertToCSV(data.data, type);
      contentType = 'text/csv';
      filename = `saidonclub-${type}-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      fileContent = JSON.stringify(data, null, 2);
      contentType = 'application/json';
      filename = `saidonclub-${type}-${data.metadata.checksum}-${new Date().toISOString().split('T')[0]}.json`;
    }

    await createImportLog(user.id, 'export', {
      type,
      format,
      success: true,
      recordCount: Object.values(data.metadata.recordCounts).reduce((a, b) => a + b, 0)
    });

    const elapsed = Date.now() - startTime;
    console.log(`[Export API] Export completed in ${elapsed}ms. Size: ${fileContent.length} bytes`);

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Checksum': data.metadata.checksum,
        'X-Record-Count': String(Object.values(data.metadata.recordCounts).reduce((a, b) => a + b, 0)),
        'X-Media-References': String(mediaCount)
      }
    });

  } catch (error) {
    console.error('[Export API] Error:', error);

    return NextResponse.json(
      { error: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Export API',
    availableTypes: ['full', 'products', 'services', 'users', 'categories', 'config', 'providers'],
    availableFormats: ['json', 'csv'],
    methods: {
      POST: {
        description: 'Export data',
        body: {
          type: 'ExportType (full|products|services|users|categories|config|providers)',
          format: 'ExportFormat (json|csv)',
          includeMedia: 'boolean (optional)'
        }
      }
    }
  });
}