import { verifyCSRF } from '@/lib/auth/csrf';
import { NextResponse } from 'next/server';

export async function csrfMiddleware(request: Request | import('next/server').NextRequest): Promise<NextResponse | null> {
  const isValid = await verifyCSRF(request);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  return null;
}