import { NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/services/google-sheets.service';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/core';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
    }

    if (!googleSheetsService.isConfigured()) {
      return NextResponse.json({ error: 'Google Sheets is not configured. Missing ENV vars.' }, { status: 500 });
    }

    const result = await googleSheetsService.syncTicketsFromSheet(prisma);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synchronized ${result.updatedCount} tickets from Google Sheets to the Database.` 
    });

  } catch (error: unknown) {
    console.error('[API Sync Sheet-to-DB] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
